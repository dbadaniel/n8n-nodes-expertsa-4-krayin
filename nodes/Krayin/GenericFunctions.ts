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

// In-memory cache for tokens obtained via login: cacheKey -> { token, expiresAt, workingLoginPath }
interface ITokenCacheItem {
    token: string;
    expiresAt: number;
    workingLoginPath?: string;
}
const tokenCache: Map<string, ITokenCacheItem> = new Map();

/**
 * Normalizes the base URL by stripping trailing slashes
 */
export function normalizeBaseUrl(baseUrl: string): string {
    return (baseUrl || '').trim().replace(/\/+$/, '');
}

/**
 * Obtains or refreshes the authentication token (using direct Bearer or via Login)
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
                message: 'Krayin CRM API Token was not provided.',
            } as JsonObject);
        }
        return { token: credentials.apiToken, workingLoginPath: '' };
    }

    // Authentication via Login (Email + Password)
    if (!credentials.email || !credentials.password) {
        throw new NodeApiError(context.getNode(), {
            message: 'Krayin CRM Email and Password are required for Login authentication.',
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

    // Candidate login endpoint paths
    const specifiedPath = credentials.loginPath?.trim();
    const candidatePaths: string[] = [];
    if (specifiedPath) {
        candidatePaths.push(specifiedPath.startsWith('/') ? specifiedPath : `/${specifiedPath}`);
    }
    // Add default paths if not already present
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
            // If 404 Not Found, try the next candidate path
            if (error.response?.status === 404) {
                continue;
            }
            // If another error occurred (e.g. 422 Invalid Credentials), stop and throw the error
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
                message: `Krayin CRM login failed (${workingPath}): ${errorMessage}`,
                httpCode: lastError.response.status?.toString(),
                description: JSON.stringify(data),
            } as JsonObject);
        }

        throw new NodeApiError(context.getNode(), (lastError || { message: 'Failed to connect to the login endpoint' }) as JsonObject);
    }

    const token =
        response?.token ||
        response?.data?.token ||
        response?.data?.api_token ||
        response?.api_token;

    if (!token) {
        throw new NodeApiError(context.getNode(), {
            message: 'Krayin login succeeded, but no token was returned by the API.',
            description: JSON.stringify(response),
        } as JsonObject);
    }

    // Cache token for 12 hours
    tokenCache.set(cacheKey, {
        token,
        expiresAt: Date.now() + 12 * 60 * 60 * 1000,
        workingLoginPath: workingPath,
    });

    return { token, workingLoginPath: workingPath };
}

/**
 * Performs an authenticated HTTP request to the Krayin CRM REST API
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
            message: 'Krayin CRM instance Base URL was not provided.',
        } as JsonObject);
    }

    let auth = await getAuthToken(this, credentials);
    const cleanBaseUrl = normalizeBaseUrl(credentials.baseUrl);

    // If login succeeded with /public prefix (e.g. /public/api/v1/login), adjust the endpoint
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
        // If 401 (Unauthorized) is returned and using Login authentication, refresh token and retry once
        const isLogin = credentials.authenticationType !== 'apiToken';
        if (error.response?.status === 401 && isLogin) {
            try {
                auth = await getAuthToken(this, credentials, true);
                return await makeRequest(auth.token);
            } catch {
                // If refresh fails, ignore and propagate original error
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
 * Fetches all paginated items from the Krayin CRM API
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
