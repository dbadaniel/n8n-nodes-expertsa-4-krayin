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
                    name: 'Login (Email & Password) - Recommended',
                    value: 'login',
                    description: 'Authenticates via API and obtains the Bearer token automatically',
                },
                {
                    name: 'API Token (In Development)',
                    value: 'apiToken',
                    description: 'Direct Bearer token option (use Login for standard setup)',
                },
            ],
            default: 'login',
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
            description: 'The Bearer API token generated in Krayin CRM',
        },
    ];

    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{$credentials?.baseUrl?.replace(/\\/+$/, "")}}',
            url: '={{$credentials?.loginPath || "/api/v1/login"}}',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: {
                email: '={{$credentials?.email}}',
                password: '={{$credentials?.password}}',
                device_name: '={{$credentials?.deviceName || "n8n"}}',
            },
        },
    };
}
