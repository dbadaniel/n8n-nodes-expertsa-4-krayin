import type { INodeProperties } from 'n8n-workflow';

export const activityOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['activity'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new activity (call, meeting, lunch or note)',
                action: 'Create an activity',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete an activity by ID',
                action: 'Delete an activity',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get an activity by ID',
                action: 'Get an activity',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many scheduled activities',
                action: 'Get many activities',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update activity details or mark as completed',
                action: 'Update an activity',
            },
        ],
        default: 'getAll',
    },
];

export const activityFields: INodeProperties[] = [
    {
        displayName: 'Activity ID',
        name: 'activityId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['activity'],
                operation: ['get', 'update', 'delete'],
            },
        },
        description: 'Numeric ID of the activity in Krayin CRM',
    },
    {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['activity'],
                operation: ['create'],
            },
        },
        description: 'Title or subject of the activity',
    },
    {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
            { name: 'Call', value: 'call' },
            { name: 'Lunch', value: 'lunch' },
            { name: 'Meeting', value: 'meeting' },
            { name: 'Note', value: 'note' },
        ],
        default: 'call',
        required: true,
        displayOptions: {
            show: {
                resource: ['activity'],
                operation: ['create'],
            },
        },
        description: 'Type of activity',
    },
    {
        displayName: 'Schedule From',
        name: 'schedule_from',
        type: 'dateTime',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['activity'],
                operation: ['create'],
            },
        },
        description: 'Scheduled start date and time',
    },
    {
        displayName: 'Schedule To',
        name: 'schedule_to',
        type: 'dateTime',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['activity'],
                operation: ['create'],
            },
        },
        description: 'Scheduled end date and time',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['activity'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Comment',
                name: 'comment',
                type: 'string',
                typeOptions: {
                    rows: 3,
                },
                default: '',
                description: 'Details or notes about the activity',
            },
            {
                displayName: 'Lead ID',
                name: 'lead_id',
                type: 'string',
                default: '',
                description: 'Link this activity to a lead ID',
            },
            {
                displayName: 'Location',
                name: 'location',
                type: 'string',
                default: '',
                description: 'Location or meeting link (e.g. Google Meet)',
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
                resource: ['activity'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Comment',
                name: 'comment',
                type: 'string',
                default: '',
                description: 'Details or notes about the activity',
            },
            {
                displayName: 'Completed',
                name: 'is_done',
                type: 'boolean',
                default: false,
                description: 'Whether the activity is marked as completed',
            },
            {
                displayName: 'Title',
                name: 'title',
                type: 'string',
                default: '',
                description: 'Title of the activity',
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
                resource: ['activity'],
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
                resource: ['activity'],
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
                resource: ['activity'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Completed',
                name: 'is_done',
                type: 'boolean',
                default: false,
                description: 'Whether to filter by completed activities',
            },
            {
                displayName: 'Lead ID',
                name: 'lead_id',
                type: 'string',
                default: '',
                description: 'Filter activities linked to a specific lead ID',
            },
            {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: [
                    { name: 'Call', value: 'call' },
                    { name: 'Lunch', value: 'lunch' },
                    { name: 'Meeting', value: 'meeting' },
                    { name: 'Note', value: 'note' },
                ],
                default: 'call',
                description: 'Filter by activity type',
            },
        ],
    },
];
