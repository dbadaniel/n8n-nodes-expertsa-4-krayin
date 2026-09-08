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
    authenticationType?: 'login' | 'apiToken';
    baseUrl: string;
    email?: string;
    password?: string;
    deviceName?: string;
    loginPath?: string;
    apiToken?: string;
}

// Cache em memória para tokens obtidos via login: cacheKey -> { token, expiresAt, workingLoginPath }
interface ITokenCacheItem {
    token: string;
    expiresAt: number;
    workingLoginPath?: string;
}
const tokenCache: Map<string, ITokenCacheItem> = new Map();

/**
 * Normaliza a URL base removendo barras finais
 */
export function normalizeBaseUrl(baseUrl: string): string {
    return (baseUrl || '').trim().replace(/\/+$/, '');
}

/**
 * Obtém ou renova o token de autenticação (usando Bearer direto ou via Login)
 */
export async function getAuthToken(
    context: IExecuteFunctions | ILoadOptionsFunctions,
    credentials: IKrayinCredentials,
    forceRefresh = false,
): Promise<{ token: string; workingLoginPath: string }> {
    const authType = credentials.authenticationType || (credentials.apiToken ? 'apiToken' : 'login');

    if (authType === 'apiToken') {
        if (!credentials.apiToken) {
            throw new NodeApiError(context.getNode(), {
                message: 'API Token do Krayin CRM não foi informado.',
            } as JsonObject);
        }
        return { token: credentials.apiToken, workingLoginPath: '' };
    }

    // Autenticação via Login (Email + Senha)
    if (!credentials.email || !credentials.password) {
        throw new NodeApiError(context.getNode(), {
            message: 'Email e Senha do Krayin CRM são obrigatórios para autenticação via Login.',
        } as JsonObject);
    }

    const cleanBaseUrl = normalizeBaseUrl(credentials.baseUrl);
    const cacheKey = `${cleanBaseUrl}:${credentials.email}`;

    if (!forceRefresh && tokenCache.has(cacheKey)) {
        const cached = tokenCache.get(cacheKey)!;
        if (Date.now() < cached.expiresAt) {
            return { token: cached.token, workingLoginPath: cached.workingLoginPath || '/api/v1/login' };
        }
    }

    const deviceName = credentials.deviceName || 'n8n';

    // Lista de candidatos a endpoints de login
    const specifiedPath = credentials.loginPath?.trim();
    const candidatePaths: string[] = [];
    if (specifiedPath) {
        candidatePaths.push(specifiedPath.startsWith('/') ? specifiedPath : `/${specifiedPath}`);
    }
    // Adiciona caminhos padrão se não constarem
    const defaults = ['/api/v1/login', '/api/admin/login', '/public/api/v1/login', '/public/api/admin/login'];
    for (const d of defaults) {
        if (!candidatePaths.includes(d)) {
            candidatePaths.push(d);
        }
    }

    const executeLogin = async (path: string) => {
        const url = `${cleanBaseUrl}${path}`;
        return await context.helpers.httpRequest({
            method: 'POST',
            url,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: {
                email: credentials.email,
                password: credentials.password,
                device_name: deviceName,
            },
            json: true,
        });
    };

    let response: any;
    let workingPath = candidatePaths[0];
    let lastError: any;

    for (const path of candidatePaths) {
        try {
            response = await executeLogin(path);
            workingPath = path;
            break;
        } catch (error: any) {
            lastError = error;
            // Se for 404 Not Found, tenta o próximo candidato
            if (error.response?.status === 404) {
                continue;
            }
            // Se for outro erro (ex: 422 Credenciais Inválidas), para e joga o erro
            break;
        }
    }

    if (!response) {
        tokenCache.delete(cacheKey);

        if (lastError?.response?.data) {
            const data = lastError.response.data;
            let errorMessage = data.message || lastError.message;

            if (data.errors && typeof data.errors === 'object') {
                const details = Object.entries(data.errors)
                    .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                    .join(' | ');
                errorMessage = `${errorMessage} - [${details}]`;
            }

            throw new NodeApiError(context.getNode(), {
                message: `Falha no login do Krayin CRM (${workingPath}): ${errorMessage}`,
                httpCode: lastError.response.status?.toString(),
                description: JSON.stringify(data),
            } as JsonObject);
        }

        throw new NodeApiError(context.getNode(), (lastError || { message: 'Falha ao conectar no endpoint de login' }) as JsonObject);
    }

    const token =
        response?.token ||
        response?.data?.token ||
        response?.data?.api_token ||
        response?.api_token;

    if (!token) {
        throw new NodeApiError(context.getNode(), {
            message: 'Login no Krayin realizado com sucesso, mas nenhum token foi retornado pela API.',
            description: JSON.stringify(response),
        } as JsonObject);
    }

    // Cacheia o token por 12 horas
    tokenCache.set(cacheKey, {
        token,
        expiresAt: Date.now() + 12 * 60 * 60 * 1000,
        workingLoginPath: workingPath,
    });

    return { token, workingLoginPath: workingPath };
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
        throw new NodeApiError(this.getNode(), {
            message: 'URL Base da instância do Krayin CRM não foi informada.',
        } as JsonObject);
    }

    let auth = await getAuthToken(this, credentials);
    const cleanBaseUrl = normalizeBaseUrl(credentials.baseUrl);

    // Se o login foi bem sucedido com prefixo /public (ex: /public/api/v1/login), ajusta o endpoint
    const prefix = auth.workingLoginPath.startsWith('/public') ? '/public' : '';

    const buildFullUrl = (pfx: string, path: string) => {
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        if (pfx && !cleanPath.startsWith(pfx) && !cleanBaseUrl.endsWith(pfx)) {
            return `${cleanBaseUrl}${pfx}${cleanPath}`;
        }
        return `${cleanBaseUrl}${cleanPath}`;
    };

    const makeRequest = async (authToken: string) => {
        const url = buildFullUrl(prefix, endpoint);
        const options: IHttpRequestOptions = {
            headers: {
                Authorization: `Bearer ${authToken}`,
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

        return await this.helpers.httpRequest(options);
    };

    try {
        return await makeRequest(auth.token);
    } catch (error: any) {
        // Se retornar 401 (Unauthorized) e estiver usando autenticação via Login, renova o token e retenta uma vez
        const isLogin = credentials.authenticationType !== 'apiToken';
        if (error.response?.status === 401 && isLogin) {
            try {
                auth = await getAuthToken(this, credentials, true);
                return await makeRequest(auth.token);
            } catch {
                // Se renovação falhar, propaga o erro original
            }
        }

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
