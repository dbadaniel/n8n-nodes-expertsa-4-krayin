import type { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
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
                name: 'Create',
                value: 'create',
                description: 'Create a new organization or company',
                action: 'Create an organization',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete an organization by ID',
                action: 'Delete an organization',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get an organization by ID',
                action: 'Get an organization',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many organizations with pagination',
                action: 'Get many organizations',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update organization details',
                action: 'Update an organization',
            },
        ],
        default: 'getAll',
    },
];

export const organizationFields: INodeProperties[] = [
    {
        displayName: 'Organization ID',
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
        description: 'Numeric ID of the organization in Krayin CRM',
    },
    {
        displayName: 'Name',
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
        description: 'Name of the company or organization',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['organization'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Address',
                name: 'address',
                type: 'string',
                typeOptions: {
                    rows: 2,
                },
                default: '',
                description: 'Full address of the organization',
            },
        ],
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['organization'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Address',
                name: 'address',
                type: 'string',
                typeOptions: {
                    rows: 2,
                },
                default: '',
                description: 'Full address of the organization',
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Name of the company or organization',
            },
        ],
    },
    {
        displayName: 'Return All',
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
        displayName: 'Limit',
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
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
            show: {
                resource: ['organization'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Filter organizations by name',
            },
        ],
    },
];
