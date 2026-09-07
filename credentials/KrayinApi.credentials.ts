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
            displayName: 'URL Base da Instância',
            name: 'baseUrl',
            type: 'string',
            default: '',
            placeholder: 'https://crm.suaempresa.com.br',
            required: true,
            description: 'A URL base da sua instalação do Krayin CRM (sem barra no final)',
        },
        {
            displayName: 'API Token (Laravel Sanctum)',
            name: 'apiToken',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            required: true,
            description: 'O Bearer Token de API gerado no Krayin CRM',
        },
    ];

    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{$credentials?.baseUrl?.replace(/\/\/+$/, "")}}',
            url: '/api/v1/leads',
            method: 'GET',
            headers: {
                Authorization: '=Bearer {{$credentials?.apiToken}}',
                Accept: 'application/json',
            },
            qs: {
                limit: 1,
            },
        },
    };
}
