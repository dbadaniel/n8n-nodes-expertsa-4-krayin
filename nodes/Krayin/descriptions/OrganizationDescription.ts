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
                name: 'Criar Organização',
                value: 'create',
                description: 'Cadastrar uma nova empresa/organização',
                action: 'Criar uma organização',
            },
            {
                name: 'Obter Organização',
                value: 'get',
                description: 'Buscar uma empresa pelo ID',
                action: 'Obter uma organização',
            },
            {
                name: 'Listar Organizações',
                value: 'getAll',
                description: 'Listar empresas com paginação',
                action: 'Listar organizações',
            },
            {
                name: 'Atualizar Organização',
                value: 'update',
                description: 'Atualizar dados de uma empresa',
                action: 'Atualizar uma organização',
            },
            {
                name: 'Excluir Organização',
                value: 'delete',
                description: 'Excluir uma empresa pelo ID',
                action: 'Excluir uma organização',
            },
        ],
        default: 'getAll',
    },
];

export const organizationFields: INodeProperties[] = [
    {
        displayName: 'ID da Organização',
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
        displayName: 'Nome da Empresa',
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
        displayName: 'Campos para Atualizar',
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
                displayName: 'Nome da Empresa',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Nome da empresa',
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
        description: 'Se deve retornar todos os registros usando paginação automática',
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
        description: 'Quantidade máxima de registros a retornar',
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
                displayName: 'Nome da Empresa',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Filtrar empresas pelo nome',
            },
        ],
    },
];
