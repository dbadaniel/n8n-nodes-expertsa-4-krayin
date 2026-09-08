import type { INodeProperties } from 'n8n-workflow';

export const leadOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['lead'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new sales lead or opportunity',
                action: 'Create a lead',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a lead by ID',
                action: 'Delete a lead',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a lead by ID',
                action: 'Get a lead',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many leads with filters and pagination',
                action: 'Get many leads',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update lead details, stage or status',
                action: 'Update a lead',
            },
        ],
        default: 'getAll',
    },
];

export const leadFields: INodeProperties[] = [
    // -------------------------------------------------------------
    // Get / Delete Lead
    // -------------------------------------------------------------
    {
        displayName: 'Lead ID',
        name: 'leadId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['get', 'update', 'delete'],
            },
        },
        description: 'Numeric ID of the lead in Krayin CRM',
    },

    // -------------------------------------------------------------
    // Create Lead
    // -------------------------------------------------------------
    {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create'],
            },
        },
        description: 'Title or name of the lead opportunity',
    },
    {
        displayName: 'Lead Value',
        name: 'lead_value',
        type: 'number',
        default: 0,
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create'],
            },
        },
        description: 'Estimated monetary value of the opportunity',
    },
    {
        displayName: 'Contact ID',
        name: 'person_id',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create'],
            },
        },
        description: 'ID of the contact person associated with this lead',
    },
    {
        displayName: 'Pipeline ID',
        name: 'lead_pipeline_id',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create'],
            },
        },
        description: 'ID of the sales pipeline (uses default pipeline if empty)',
    },
    {
        displayName: 'Stage ID',
        name: 'lead_pipeline_stage_id',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create'],
            },
        },
        description: 'ID of the pipeline stage where the lead will be placed',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Custom Attributes JSON (Advanced)',
                name: 'customAttributesJson',
                type: 'json',
                default: '',
                description: 'JSON object with custom attributes for the lead (e.g. {"hotmart_status": "APPROVED"})',
            },
            {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                typeOptions: {
                    rows: 3,
                },
                default: '',
                description: 'Notes or details about the lead',
            },
            {
                displayName: 'Expected Close Date',
                name: 'expected_close_date',
                type: 'dateTime',
                default: '',
                description: 'Forecasted deal closing date',
            },
            {
                displayName: 'Lead Source ID',
                name: 'lead_source_id',
                type: 'string',
                default: '',
                description: 'ID of the lead source (e.g. Website, Referral)',
            },
            {
                displayName: 'Lead Type ID',
                name: 'lead_type_id',
                type: 'string',
                default: '',
                description: 'ID of the lead category or type',
            },
            {
                displayName: 'Products JSON (Advanced)',
                name: 'productsJson',
                type: 'json',
                default: '',
                description: 'Pass products directly as a JSON array of objects or Krayin product payload',
            },
            {
                displayName: 'User ID',
                name: 'user_id',
                type: 'string',
                default: '',
                description: 'ID of the CRM user/salesperson responsible for the lead',
            },
        ],
    },

    // -------------------------------------------------------------
    // Lead Products (Create & Update)
    // -------------------------------------------------------------
    {
        displayName: 'Lead Products',
        name: 'productsUi',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        placeholder: 'Add Product',
        default: {},
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create', 'update'],
            },
        },
        description: 'Link products to the lead by specifying ID and quantity',
        options: [
            {
                name: 'productValues',
                displayName: 'Product',
                values: [
                    {
                        displayName: 'Product ID',
                        name: 'product_id',
                        type: 'string',
                        required: true,
                        default: '',
                        description: 'Numeric ID of the product in Krayin CRM (e.g. 6)',
                    },
                    {
                        displayName: 'Quantity',
                        name: 'quantity',
                        type: 'number',
                        default: 1,
                        description: 'Quantity of units for this product',
                    },
                    {
                        displayName: 'Price',
                        name: 'price',
                        type: 'number',
                        default: 0,
                        description: 'Custom price (leave 0 to fetch standard price from CRM)',
                    },
                ],
            },
        ],
    },

    // -------------------------------------------------------------
    // Custom Attributes (Create & Update)
    // -------------------------------------------------------------
    {
        displayName: 'Custom Attributes',
        name: 'customAttributesUi',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        placeholder: 'Add Attribute',
        default: {},
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create', 'update'],
            },
        },
        description: 'Custom fields and attributes for your CRM leads',
        options: [
            {
                name: 'customAttributeValues',
                displayName: 'Attribute',
                values: [
                    {
                        displayName: 'Code',
                        name: 'code',
                        type: 'string',
                        required: true,
                        default: '',
                        placeholder: 'e.g. hotmart_status',
                        description: 'Attribute column code in Krayin CRM',
                    },
                    {
                        displayName: 'Value',
                        name: 'value',
                        type: 'string',
                        default: '',
                        placeholder: 'e.g. APPROVED',
                        description: 'Attribute value',
                    },
                ],
            },
        ],
    },

    // -------------------------------------------------------------
    // Update Lead
    // -------------------------------------------------------------
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Custom Attributes JSON (Advanced)',
                name: 'customAttributesJson',
                type: 'json',
                default: '',
                description: 'JSON object with custom attributes for the lead',
            },
            {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                typeOptions: {
                    rows: 3,
                },
                default: '',
                description: 'Notes or details about the lead',
            },
            {
                displayName: 'Expected Close Date',
                name: 'expected_close_date',
                type: 'dateTime',
                default: '',
                description: 'Forecasted deal closing date',
            },
            {
                displayName: 'Lead Source ID',
                name: 'lead_source_id',
                type: 'string',
                default: '',
                description: 'ID of the lead source',
            },
            {
                displayName: 'Lead Type ID',
                name: 'lead_type_id',
                type: 'string',
                default: '',
                description: 'ID of the lead category or type',
            },
            {
                displayName: 'Lead Value',
                name: 'lead_value',
                type: 'number',
                default: 0,
                description: 'Updated monetary value of the opportunity',
            },
            {
                displayName: 'Pipeline ID',
                name: 'lead_pipeline_id',
                type: 'string',
                default: '',
                description: 'ID of the sales pipeline',
            },
            {
                displayName: 'Product Update Mode',
                name: 'productUpdateMode',
                type: 'options',
                options: [
                    {
                        name: 'Clear All Products',
                        value: 'clear',
                        description: 'Remove all products attached to the lead',
                    },
                    {
                        name: 'Preserve Existing and Add New (Default)',
                        value: 'preserveAndAdd',
                        description: 'Keep current products and merge new ones',
                    },
                    {
                        name: 'Replace All (Overwrite)',
                        value: 'replace',
                        description: 'Overwrite existing products exclusively with new ones',
                    },
                ],
                default: 'preserveAndAdd',
                description: 'How products should be managed during this lead update',
            },
            {
                displayName: 'Products JSON (Advanced)',
                name: 'productsJson',
                type: 'json',
                default: '',
                description: 'Pass products directly as JSON',
            },
            {
                displayName: 'Stage ID',
                name: 'lead_pipeline_stage_id',
                type: 'string',
                default: '',
                description: 'Move lead to a new pipeline stage ID',
            },
            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                options: [
                    { name: 'Lost', value: 3 },
                    { name: 'Open', value: 1 },
                    { name: 'Won', value: 2 },
                ],
                default: 1,
                description: 'Status of the lead opportunity',
            },
            {
                displayName: 'Title',
                name: 'title',
                type: 'string',
                default: '',
                description: 'Updated title of the opportunity',
            },
            {
                displayName: 'User ID',
                name: 'user_id',
                type: 'string',
                default: '',
                description: 'Reassign lead to another salesperson ID',
            },
        ],
    },

    // -------------------------------------------------------------
    // Get Many Leads (getAll)
    // -------------------------------------------------------------
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: ['lead'],
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
                resource: ['lead'],
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
                resource: ['lead'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Contact ID',
                name: 'person_id',
                type: 'string',
                default: '',
                description: 'Filter leads linked to a specific contact ID',
            },
            {
                displayName: 'Pipeline ID',
                name: 'lead_pipeline_id',
                type: 'string',
                default: '',
                description: 'Filter leads from a specific pipeline ID',
            },
            {
                displayName: 'Stage ID',
                name: 'lead_pipeline_stage_id',
                type: 'string',
                default: '',
                description: 'Filter leads from a specific stage ID',
            },
            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                options: [
                    { name: 'Lost', value: 3 },
                    { name: 'Open', value: 1 },
                    { name: 'Won', value: 2 },
                ],
                default: 1,
                description: 'Filter by lead status',
            },
            {
                displayName: 'User ID',
                name: 'user_id',
                type: 'string',
                default: '',
                description: 'Filter leads assigned to a specific user ID',
            },
        ],
    },
];
