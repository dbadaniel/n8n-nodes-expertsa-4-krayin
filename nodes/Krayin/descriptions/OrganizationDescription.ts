import type { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
    {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['organization'],
            },
        },
        options: [
            {
                name: 'Atualizar Organização',
                value: 'update',
                description: 'Atualizar dados de uma empresa',
                action: 'Atualizar uma organiza o',
            },
            {
                name: 'Criar Organização',
                value: 'create',
                description: 'Cadastrar uma nova empresa/organização',
                action: 'Criar uma organiza o',
            },
            {
                name: 'Excluir Organização',
                value: 'delete',
                description: 'Excluir uma empresa pelo ID',
                action: 'Excluir uma organiza o',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Listar empresas com paginação',
                action: 'Listar organiza es',
            },
            {
                name: 'Obter Organização',
                value: 'get',
                description: 'Buscar uma empresa pelo ID',
                action: 'Obter uma organiza o',
            },
        ],
        default: 'getAll',
    },
];

export const organizationFields: INodeProperties[] = [
    {
        displayName: 'ID Da Organização',
        name: 'organizationId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['organization'],
                operation: ['get', 'update', 'delete'],
            },
        },
        description: 'O ID numérico da empresa no Krayin CRM',
    },
    {
        displayName: 'Nome Da Empresa',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['organization'],
                operation: ['create'],
            },
        },
        description: 'Razão social ou nome fantasia da empresa',
    },
    {
        displayName: 'Campos Adicionais',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Adicionar Campo',
        default: {},
        displayOptions: {
            show: {
                resource: ['organization'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Endereço',
                name: 'address',
                type: 'string',
                typeOptions: {
                    rows: 2,
                },
                default: '',
                description: 'Endereço completo da empresa',
            },
        ],
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Adicionar Campo',
        default: {},
        displayOptions: {
            show: {
                resource: ['organization'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Nome Da Empresa',
                name: 'name',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Endereço',
                name: 'address',
                type: 'string',
                typeOptions: {
                    rows: 2,
                },
                default: '',
                description: 'Endereço completo',
            },
        ],
    },
    {
        displayName: 'Retornar Todos',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: ['organization'],
                operation: ['getAll'],
            },
        },
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limite',
        name: 'limit',
        type: 'number',
        typeOptions: {
            minValue: 1,
        },
        default: 50,
        displayOptions: {
            show: {
                resource: ['organization'],
                operation: ['getAll'],
                returnAll: [false],
            },
        },
        description: 'Max number of results to return',
    },
    {
        displayName: 'Filtros',
        name: 'filters',
        type: 'collection',
        placeholder: 'Adicionar Filtro',
        default: {},
        displayOptions: {
            show: {
                resource: ['organization'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Nome Da Empresa',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Filtrar empresas pelo nome',
            },
        ],
    },
];
