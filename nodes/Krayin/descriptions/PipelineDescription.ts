import type { INodeProperties } from 'n8n-workflow';

export const pipelineOperations: INodeProperties[] = [
    {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['pipeline'],
            },
        },
        options: [
            {
                name: 'Obter Funil',
                value: 'get',
                description: 'Buscar um funil com suas fases pelo ID',
                action: 'Obter um funil',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Listar funis de vendas configurados no CRM',
                action: 'Listar funis',
            },
            {
                name: 'Listar Estágios Do Funil',
                value: 'getStages',
                description: 'Listar os estágios/fases de um funil com filtros de nome e ID',
                action: 'Listar est gios do funil',
            },
        ],
        default: 'getAll',
    },
];

export const pipelineFields: INodeProperties[] = [
    {
        displayName: 'ID Do Funil (Pipeline ID)',
        name: 'pipelineId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['pipeline'],
                operation: ['get'],
            },
        },
        description: 'O ID do funil de vendas no Krayin CRM',
    },
    {
        displayName: 'ID Do Funil (Pipeline ID)',
        name: 'pipelineId',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['pipeline'],
                operation: ['getStages'],
            },
        },
        description: 'ID do funil cujos estágios deseja listar (deixe vazio para buscar em todos os funis)',
    },
    {
        displayName: 'Filtros',
        name: 'filters',
        type: 'collection',
        placeholder: 'Adicionar Filtro',
        default: {},
        displayOptions: {
            show: {
                resource: ['pipeline'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'ID Do Funil',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Filtrar funil pelo ID numérico (ex: 1)',
            },
            {
                displayName: 'Nome Do Funil',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Filtrar funil exatamente pelo nome (ex: Funil de Vendas)',
            },
        ],
    },
    {
        displayName: 'Filtros De Estágio',
        name: 'stageFilters',
        type: 'collection',
        placeholder: 'Adicionar Filtro',
        default: {},
        displayOptions: {
            show: {
                resource: ['pipeline'],
                operation: ['getStages'],
            },
        },
        options: [
            {
                displayName: 'ID Do Estágio',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Filtrar pelo ID numérico do estágio (ex: 1)',
            },
            {
                displayName: 'Nome Do Estágio',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Filtrar pelo nome do estágio (ex: Novo, Contactado, etc.)',
            },
            {
                displayName: 'Código Do Estágio (Code)',
                name: 'code',
                type: 'string',
                default: '',
                description: 'Filtrar pelo código interno do estágio (ex: new, won, lost)',
            },
        ],
    },
];
