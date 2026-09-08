import type { INodeProperties } from 'n8n-workflow';

export const pipelineOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
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
                name: 'Get',
                value: 'get',
                description: 'Get a sales pipeline with its stages by ID',
                action: 'Get a pipeline',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many sales pipelines configured in CRM',
                action: 'Get many pipelines',
            },
            {
                name: 'Get Stages',
                value: 'getStages',
                description: 'List stages of a pipeline with filters',
                action: 'Get pipeline stages',
            },
        ],
        default: 'getAll',
    },
];

export const pipelineFields: INodeProperties[] = [
    {
        displayName: 'Pipeline ID',
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
        description: 'ID of the sales pipeline in Krayin CRM',
    },
    {
        displayName: 'Pipeline ID',
        name: 'pipelineId',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['pipeline'],
                operation: ['getStages'],
            },
        },
        description: 'ID of the pipeline to list stages from (leave empty to search across all pipelines)',
    },
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
            show: {
                resource: ['pipeline'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Filter pipeline by numeric ID (e.g. 1)',
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Filter pipeline by exact name',
            },
        ],
    },
    {
        displayName: 'Stage Filters',
        name: 'stageFilters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
            show: {
                resource: ['pipeline'],
                operation: ['getStages'],
            },
        },
        options: [
            {
                displayName: 'Code',
                name: 'code',
                type: 'string',
                default: '',
                description: 'Filter stage by internal code (e.g. new, won, lost)',
            },
            {
                displayName: 'ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Filter by numeric stage ID (e.g. 1)',
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Filter by stage name (e.g. New, Contacted)',
            },
        ],
    },
];
