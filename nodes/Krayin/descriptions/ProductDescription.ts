import type { INodeProperties } from 'n8n-workflow';

export const productOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
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
                name: 'Create',
                value: 'create',
                description: 'Create a new product or service',
                action: 'Create a product',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a product by ID',
                action: 'Delete a product',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a product by ID or SKU',
                action: 'Get a product',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many products registered in CRM',
                action: 'Get many products',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update product details',
                action: 'Update a product',
            },
        ],
        default: 'getAll',
    },
];

export const productFields: INodeProperties[] = [
    {
        displayName: 'Product ID or SKU',
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
        description: 'Numeric product ID (e.g. 6) or SKU code (e.g. 9d5ejnqr).',
    },
    {
        displayName: 'Name',
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
        description: 'Name of the product or service',
    },
    {
        displayName: 'SKU',
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
        description: 'Unique SKU identification code',
    },
    {
        displayName: 'Price',
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
        description: 'Standard unit price',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                typeOptions: {
                    rows: 2,
                },
                default: '',
                description: 'Description or details of the product',
            },
            {
                displayName: 'Quantity',
                name: 'quantity',
                type: 'number',
                default: 0,
                description: 'Available inventory quantity',
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
                resource: ['product'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                default: '',
                description: 'Description or details of the product',
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Name of the product or service',
            },
            {
                displayName: 'Price',
                name: 'price',
                type: 'number',
                default: 0,
                description: 'Unit price of the product',
            },
            {
                displayName: 'Quantity',
                name: 'quantity',
                type: 'number',
                default: 0,
                description: 'Inventory quantity in stock',
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
                resource: ['product'],
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
                resource: ['product'],
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
                resource: ['product'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Filter products by name',
            },
            {
                displayName: 'SKU',
                name: 'sku',
                type: 'string',
                default: '',
                description: 'Filter products by SKU code',
            },
        ],
    },
];
