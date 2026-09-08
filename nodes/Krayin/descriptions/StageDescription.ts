import type { INodeProperties } from 'n8n-workflow';

export const stageOperations: INodeProperties[] = [
    {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['stage'],
            },
        },
        options: [
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Listar estágios/etapas dos funis de vendas com filtros',
                action: 'Listar est gios',
            },
            {
                name: 'Obter Estágio',
                value: 'get',
                description: 'Buscar um estágio específico pelo ID',
                action: 'Obter um est gio',
            },
        ],
        default: 'getAll',
    },
];

export const stageFields: INodeProperties[] = [
    {
        displayName: 'ID Do Funil (Pipeline ID)',
        name: 'pipelineId',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['stage'],
                operation: ['getAll', 'get'],
            },
        },
        description: 'ID do funil para buscar os estágios (deixe vazio para buscar em todos os funis)',
    },
    {
        displayName: 'ID Do Estágio (Stage ID)',
        name: 'stageId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['stage'],
                operation: ['get'],
            },
        },
        description: 'O ID numérico do estágio no Krayin CRM',
    },
    {
        displayName: 'Filtros',
        name: 'filters',
        type: 'collection',
        placeholder: 'Adicionar Filtro',
        default: {},
        displayOptions: {
            show: {
                resource: ['stage'],
                operation: ['getAll'],
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
