import type { INodeProperties } from 'n8n-workflow';

export const productOperations: INodeProperties[] = [
    {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['product'],
            },
        },
        options: [
            {
                name: 'Criar Produto',
                value: 'create',
                description: 'Cadastrar um novo produto ou serviço',
                action: 'Criar um produto',
            },
            {
                name: 'Obter Produto',
                value: 'get',
                description: 'Buscar um produto pelo ID',
                action: 'Obter um produto',
            },
            {
                name: 'Listar Produtos',
                value: 'getAll',
                description: 'Listar produtos cadastrados',
                action: 'Listar produtos',
            },
            {
                name: 'Atualizar Produto',
                value: 'update',
                description: 'Atualizar dados de um produto',
                action: 'Atualizar um produto',
            },
            {
                name: 'Excluir Produto',
                value: 'delete',
                description: 'Excluir um produto pelo ID',
                action: 'Excluir um produto',
            },
        ],
        default: 'getAll',
    },
];

export const productFields: INodeProperties[] = [
    {
        displayName: 'ID do Produto',
        name: 'productId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['get', 'update', 'delete'],
            },
        },
        description: 'O ID numérico do produto no Krayin CRM',
    },
    {
        displayName: 'Nome do Produto',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create'],
            },
        },
        description: 'Nome comercial do produto ou serviço',
    },
    {
        displayName: 'SKU / Código',
        name: 'sku',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create'],
            },
        },
        description: 'Código único de identificação do produto',
    },
    {
        displayName: 'Preço',
        name: 'price',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create'],
            },
        },
        description: 'Preço unitário padrão',
    },
    {
        displayName: 'Campos Adicionais',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Adicionar Campo',
        default: {},
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Descrição',
                name: 'description',
                type: 'string',
                typeOptions: {
                    rows: 2,
                },
                default: '',
                description: 'Detalhes sobre o produto',
            },
            {
                displayName: 'Quantidade em Estoque',
                name: 'quantity',
                type: 'number',
                default: 0,
                description: 'Quantidade disponível',
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
                resource: ['product'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Nome do Produto',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Nome do produto',
            },
            {
                displayName: 'Preço',
                name: 'price',
                type: 'number',
                default: 0,
                description: 'Preço unitário',
            },
            {
                displayName: 'Descrição',
                name: 'description',
                type: 'string',
                default: '',
                description: 'Descrição',
            },
            {
                displayName: 'Quantidade',
                name: 'quantity',
                type: 'number',
                default: 0,
                description: 'Quantidade em estoque',
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
                resource: ['product'],
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
                resource: ['product'],
                operation: ['getAll'],
                returnAll: [false],
            },
        },
        description: 'Quantidade máxima de registros a retornar',
    },
];
