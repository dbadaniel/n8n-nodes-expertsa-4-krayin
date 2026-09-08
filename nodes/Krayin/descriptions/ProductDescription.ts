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
                name: 'Atualizar Produto',
                value: 'update',
                description: 'Atualizar dados de um produto',
                action: 'Atualizar um produto',
            },
            {
                name: 'Criar Produto',
                value: 'create',
                description: 'Cadastrar um novo produto ou serviço',
                action: 'Criar um produto',
            },
            {
                name: 'Excluir Produto',
                value: 'delete',
                description: 'Excluir um produto pelo ID',
                action: 'Excluir um produto',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Listar produtos cadastrados',
                action: 'Listar produtos',
            },
            {
                name: 'Obter / Buscar Produto',
                value: 'get',
                description: 'Buscar um produto por ID ou SKU / Código de Oferta',
                action: 'Obter ou buscar um produto',
            },
        ],
        default: 'getAll',
    },
];

export const productFields: INodeProperties[] = [
    {
        displayName: 'ID Ou SKU Do Produto',
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
        description: 'ID numérico do produto (ex: 6) ou código SKU da oferta (ex: 9d5ejnqr). Na busca, aceita ID numérico ou código SKU.',
    },
    {
        displayName: 'Nome Do Produto',
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
                displayName: 'Quantidade Em Estoque',
                name: 'quantity',
                type: 'number',
                default: 0,
                description: 'Quantidade disponível',
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
                resource: ['product'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Nome Do Produto',
                name: 'name',
                type: 'string',
                default: '',
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
                resource: ['product'],
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
                resource: ['product'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Nome Do Produto',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Filtrar produtos pelo nome',
            },
            {
                displayName: 'SKU / Código',
                name: 'sku',
                type: 'string',
                default: '',
                description: 'Filtrar produtos pelo código SKU',
            },
        ],
    },
];
