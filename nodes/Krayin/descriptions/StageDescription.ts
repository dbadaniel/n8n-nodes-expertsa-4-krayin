import type { INodeProperties } from 'n8n-workflow';

export const stageOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
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
                name: 'Get',
                value: 'get',
                description: 'Get a specific pipeline stage by ID',
                action: 'Get a stage',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many pipeline stages with filters',
                action: 'Get many stages',
            },
        ],
        default: 'getAll',
    },
];

export const stageFields: INodeProperties[] = [
    {
        displayName: 'Pipeline ID',
        name: 'pipelineId',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['stage'],
                operation: ['getAll', 'get'],
            },
        },
        description: 'Pipeline ID to fetch stages from (leave empty to search across all pipelines)',
    },
    {
        displayName: 'Stage ID',
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
        description: 'Numeric ID of the stage in Krayin CRM',
    },
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
            show: {
                resource: ['stage'],
                operation: ['getAll'],
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
