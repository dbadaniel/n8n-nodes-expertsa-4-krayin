import type {
    IExecuteFunctions,
    ILoadOptionsFunctions,
    IDataObject,
    IHttpRequestMethods,
    IHttpRequestOptions,
    JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export interface IKrayinCredentials {
    baseUrl: string;
    apiToken: string;
}

/**
 * Normaliza a URL base removendo barras finais
 */
export function normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.trim().replace(/\/+$/, '');
}

/**
 * Faz uma requisição HTTP autenticada à REST API do Krayin CRM
 */
export async function krayinApiRequest(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
): Promise<any> {
    const credentials = (await this.getCredentials('krayinApi')) as unknown as IKrayinCredentials;

    if (!credentials.baseUrl) {
        throw new NodeApiError(this.getNode(), { message: 'URL Base da instância do Krayin CRM não foi informada.' } as JsonObject);
    }

    if (!credentials.apiToken) {
        throw new NodeApiError(this.getNode(), { message: 'API Token do Krayin CRM não foi informado.' } as JsonObject);
    }

    const cleanBaseUrl = normalizeBaseUrl(credentials.baseUrl);
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${cleanBaseUrl}${cleanEndpoint}`;

    const options: IHttpRequestOptions = {
        headers: {
            Authorization: `Bearer ${credentials.apiToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method,
        url,
        qs,
        json: true,
    };

    if (Object.keys(body).length > 0) {
        options.body = body;
    }

    try {
        const response = await this.helpers.httpRequest(options);
        return response;
    } catch (error: any) {
        if (error.response?.data) {
            const data = error.response.data;
            let errorMessage = data.message || error.message;

            if (data.errors && typeof data.errors === 'object') {
                const details = Object.entries(data.errors)
                    .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                    .join(' | ');
                errorMessage = `${errorMessage} - [${details}]`;
            }

            throw new NodeApiError(this.getNode(), {
                message: errorMessage,
                httpCode: error.response.status?.toString(),
                description: JSON.stringify(data),
            } as JsonObject);
        }

        throw new NodeApiError(this.getNode(), error as JsonObject);
    }
}

/**
 * Busca todos os itens paginados da API do Krayin CRM
 */
export async function krayinApiRequestAllItems(
    this: IExecuteFunctions,
    endpoint: string,
    qs: IDataObject = {},
    limit: number = 0,
): Promise<any[]> {
    const returnData: any[] = [];
    let page = 1;
    const perPage = 50;
    qs.limit = perPage;

    do {
        qs.page = page;
        const responseData = await krayinApiRequest.call(this, 'GET', endpoint, {}, qs);

        const items = Array.isArray(responseData)
            ? responseData
            : responseData?.data || [];

        if (items.length === 0) {
            break;
        }

        for (const item of items) {
            returnData.push(item);
            if (limit > 0 && returnData.length >= limit) {
                return returnData;
            }
        }

        if (items.length < perPage) {
            break;
        }

        page++;
    } while (true);

    return returnData;
}
