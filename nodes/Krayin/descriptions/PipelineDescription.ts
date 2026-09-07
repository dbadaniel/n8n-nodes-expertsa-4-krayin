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
                name: 'Listar Funis',
                value: 'getAll',
                description: 'Listar todos os funis de vendas configurados no CRM',
                action: 'Listar funis',
            },
        ],
        default: 'getAll',
    },
];

export const pipelineFields: INodeProperties[] = [
    {
        displayName: 'ID do Funil (Pipeline ID)',
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
];
