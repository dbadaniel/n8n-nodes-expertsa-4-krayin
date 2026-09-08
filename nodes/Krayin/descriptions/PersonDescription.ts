import type { INodeProperties } from 'n8n-workflow';

export const personOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['person'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new contact or person',
                action: 'Create a person',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a contact by ID',
                action: 'Delete a person',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a contact by ID',
                action: 'Get a person',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many contacts with pagination and filters',
                action: 'Get many persons',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update contact details',
                action: 'Update a person',
            },
        ],
        default: 'getAll',
    },
];

export const personFields: INodeProperties[] = [
    {
        displayName: 'Contact ID',
        name: 'personId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['person'],
                operation: ['get', 'update', 'delete'],
            },
        },
        description: 'Numeric ID of the contact in Krayin CRM',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['person'],
                operation: ['create'],
            },
        },
        description: 'Full name of the contact person',
    },
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@example.com',
        default: '',
        displayOptions: {
            show: {
                resource: ['person'],
                operation: ['create'],
            },
        },
        description: 'Primary email address of the contact',
    },
    {
        displayName: 'Contact Number',
        name: 'contact_number',
        type: 'string',
        placeholder: '+1 234 567 8900',
        default: '',
        displayOptions: {
            show: {
                resource: ['person'],
                operation: ['create'],
            },
        },
        description: 'Primary phone number of the contact',
    },
    {
        displayName: 'Organization ID',
        name: 'organization_id',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['person'],
                operation: ['create'],
            },
        },
        description: 'ID of the organization this contact belongs to',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['person'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Job Title',
                name: 'job_title',
                type: 'string',
                default: '',
                description: 'Professional role or job title of the contact',
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
                resource: ['person'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Contact Number',
                name: 'contact_number',
                type: 'string',
                default: '',
                description: 'Phone number of the contact',
            },
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                placeholder: 'name@example.com',
                default: '',
                description: 'Email address of the contact',
            },
            {
                displayName: 'Job Title',
                name: 'job_title',
                type: 'string',
                default: '',
                description: 'Job title of the contact',
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Full name of the contact',
            },
            {
                displayName: 'Organization ID',
                name: 'organization_id',
                type: 'string',
                default: '',
                description: 'Link this contact to an organization ID',
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
                resource: ['person'],
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
                resource: ['person'],
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
                resource: ['person'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Email',
                name: 'emails',
                type: 'string',
                placeholder: 'name@example.com',
                default: '',
                description: 'Filter contacts by email address',
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Filter contacts by name',
            },
        ],
    },
];
