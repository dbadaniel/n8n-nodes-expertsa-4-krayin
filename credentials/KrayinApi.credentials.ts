import type {
    ICredentialType,
    INodeProperties,
    ICredentialTestRequest,
} from 'n8n-workflow';

export class KrayinApi implements ICredentialType {
    name = 'krayinApi';
    displayName = 'Krayin CRM API';
    documentationUrl = 'https://krayincrm.com/';

    properties: INodeProperties[] = [
        {
            displayName: 'Tipo de Autenticação',
            name: 'authenticationType',
            type: 'options',
            options: [
                {
                    name: 'Login (Email e Senha)',
                    value: 'login',
                    description: 'Autentica via API e obtém o token automaticamente',
                },
                {
                    name: 'API Token Direto',
                    value: 'apiToken',
                    description: 'Utiliza um Bearer Token (Sanctum) já gerado',
                },
            ],
            default: 'login',
            description: 'Como o n8n deve autenticar na API do Krayin CRM',
        },
        {
            displayName: 'URL Base da Instância',
            name: 'baseUrl',
            type: 'string',
            default: '',
            placeholder: 'https://crm.suaempresa.com.br ou http://localhost/public',
            required: true,
            description: 'A URL base da instalação do Krayin CRM (sem barra final). Ex: https://ocjcrm.expertsa.com.br',
        },
        // Campos para Login (Email e Senha)
        {
            displayName: 'Email do Administrador',
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
            description: 'Email do usuário administrador no Krayin CRM',
        },
        {
            displayName: 'Senha',
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
            description: 'Senha do administrador no Krayin CRM',
        },
        {
            displayName: 'Nome do Dispositivo (Device Name)',
            name: 'deviceName',
            type: 'string',
            default: 'n8n',
            placeholder: 'n8n',
            displayOptions: {
                show: {
                    authenticationType: ['login'],
                },
            },
            description: 'Identificador do dispositivo enviado ao Laravel Sanctum (device_name)',
        },
        {
            displayName: 'Endpoint de Login',
            name: 'loginPath',
            type: 'string',
            default: '/api/v1/login',
            placeholder: '/api/v1/login ou /api/admin/login',
            displayOptions: {
                show: {
                    authenticationType: ['login'],
                },
            },
            description: 'Caminho do endpoint de login. O padrão oficial da API é /api/v1/login.',
        },
        // Campo para API Token direto
        {
            displayName: 'API Token (Laravel Sanctum)',
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
            description: 'O Bearer Token de API gerado no Krayin CRM',
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
