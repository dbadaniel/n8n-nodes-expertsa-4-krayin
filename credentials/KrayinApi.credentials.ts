import type {
    ICredentialType,
    INodeProperties,
    ICredentialTestRequest,
} from 'n8n-workflow';

export class KrayinApi implements ICredentialType {
    name = 'krayinApi';
    displayName = 'Krayin CRM API';
    documentationUrl = 'https://krayincrm.com/';
    icon = 'file:krayin.svg' as const;

    properties: INodeProperties[] = [
        {
            displayName: 'Authentication Type',
            name: 'authenticationType',
            type: 'options',
            options: [
                {
                    name: 'API Token (Personal Access Token) - Recommended for High Concurrency',
                    value: 'apiToken',
                    description: 'Direct Bearer token generated in Krayin CRM via expertsa/krayin-api-keys plugin',
                },
                {
                    name: 'Login (Email & Password)',
                    value: 'login',
                    description: 'Authenticates via API and obtains Bearer token automatically with persistent cache',
                },
            ],
            default: 'apiToken',
            description: 'How n8n should authenticate with the Krayin CRM API',
        },
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            default: '',
            placeholder: 'https://crm.example.com or http://localhost/public',
            required: true,
            description: 'The base URL of the Krayin CRM instance (without trailing slash)',
        },
        // API Token
        {
            displayName: 'API Token',
            name: 'apiToken',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            displayOptions: {
                show: {
                    authenticationType: ['apiToken'],
                },
            },
            description: 'Personal Access Token generated in Krayin CRM (Settings > API Keys with expertsa/krayin-api-keys plugin)',
        },
        // Login Credentials
        {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            default: '',
            placeholder: 'admin@example.com',
            required: true,
            displayOptions: {
                show: {
                    authenticationType: ['login'],
                },
            },
            description: 'Administrator email in Krayin CRM',
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            displayOptions: {
                show: {
                    authenticationType: ['login'],
                },
            },
            description: 'Administrator password in Krayin CRM',
        },
        {
            displayName: 'Device Name',
            name: 'deviceName',
            type: 'string',
            default: 'n8n',
            placeholder: 'n8n',
            displayOptions: {
                show: {
                    authenticationType: ['login'],
                },
            },
            description: 'Device identifier sent to Laravel Sanctum (device_name)',
        },
        {
            displayName: 'Login Endpoint',
            name: 'loginPath',
            type: 'string',
            default: '/api/v1/login',
            placeholder: '/api/v1/login',
            displayOptions: {
                show: {
                    authenticationType: ['login'],
                },
            },
            description: 'Path of the login endpoint. Default is /api/v1/login.',
        },
    ];

    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{$credentials?.baseUrl?.replace(/\\/+$/, "")}}',
            url: '={{$credentials?.authenticationType === "apiToken" ? "/api/v1/settings/pipelines" : ($credentials?.loginPath || "/api/v1/login")}}',
            method: '={{$credentials?.authenticationType === "apiToken" ? "GET" : "POST"}}' as any,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: '={{$credentials?.authenticationType === "apiToken" ? "Bearer " + $credentials?.apiToken : undefined}}',
            },
            body: '={{$credentials?.authenticationType === "apiToken" ? undefined : ({ email: $credentials?.email, password: $credentials?.password, device_name: $credentials?.deviceName || "n8n" })}}',
        },
    };
}
