import type { INodeProperties } from 'n8n-workflow';

export const personOperations: INodeProperties[] = [
    {
        displayName: 'Operação',
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
                name: 'Atualizar Contato',
                value: 'update',
                description: 'Atualizar dados de um contato existente',
                action: 'Atualizar um contato',
            },
            {
                name: 'Criar Contato',
                value: 'create',
                description: 'Cadastrar uma nova pessoa/contato',
                action: 'Criar um contato',
            },
            {
                name: 'Excluir Contato',
                value: 'delete',
                description: 'Excluir um contato pelo ID',
                action: 'Excluir um contato',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Listar contatos com paginação e filtros',
                action: 'Listar contatos',
            },
            {
                name: 'Obter Contato',
                value: 'get',
                description: 'Buscar um contato pelo ID',
                action: 'Obter um contato',
            },
        ],
        default: 'getAll',
    },
];

export const personFields: INodeProperties[] = [
    // ID do Contato
    {
        displayName: 'ID Do Contato',
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
        description: 'O ID numérico do contato no Krayin CRM',
    },

    // Criar Contato
    {
        displayName: 'Nome Completo',
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
        description: 'Nome da pessoa de contato',
    },
    {
        displayName: 'E-Mail Principal',
        name: 'email',
        type: 'string',
        placeholder: 'nome@exemplo.com',
        default: '',
        displayOptions: {
            show: {
                resource: ['person'],
                operation: ['create'],
            },
        },
        description: 'Endereço de e-mail do contato',
    },
    {
        displayName: 'Telefone Principal',
        name: 'contact_number',
        type: 'string',
        placeholder: '+55 11 99999-9999',
        default: '',
        displayOptions: {
            show: {
                resource: ['person'],
                operation: ['create'],
            },
        },
        description: 'Número de telefone ou WhatsApp',
    },
    {
        displayName: 'ID Da Organização',
        name: 'organization_id',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['person'],
                operation: ['create'],
            },
        },
        description: 'ID da empresa à qual este contato pertence',
    },
    {
        displayName: 'Campos Adicionais',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Adicionar Campo',
        default: {},
        displayOptions: {
            show: {
                resource: ['person'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Cargo (Job Title)',
                name: 'job_title',
                type: 'string',
                default: '',
                description: 'Cargo ou ocupação profissional',
            },
        ],
    },

    // Atualizar Contato
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Adicionar Campo',
        default: {},
        displayOptions: {
            show: {
                resource: ['person'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Cargo (Job Title)',
                name: 'job_title',
                type: 'string',
                default: '',
                description: 'Cargo da pessoa',
            },
            {
                displayName: 'E-Mail Principal',
                name: 'email',
                type: 'string',
                placeholder: 'name@email.com',
                default: '',
                description: 'Endereço de e-mail',
            },
            {
                displayName: 'ID Da Organização',
                name: 'organization_id',
                type: 'string',
                default: '',
                description: 'Vincular a uma empresa',
            },
            {
                displayName: 'Nome Completo',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Nome da pessoa',
            },
            {
                displayName: 'Telefone Principal',
                name: 'contact_number',
                type: 'string',
                default: '',
                description: 'Número de telefone',
            },
        ],
    },

    // Listar Contatos (getAll)
    {
        displayName: 'Retornar Todos',
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
        displayName: 'Limite',
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
        displayName: 'Filtros',
        name: 'filters',
        type: 'collection',
        placeholder: 'Adicionar Filtro',
        default: {},
        displayOptions: {
            show: {
                resource: ['person'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Nome',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Filtrar contatos pelo nome',
            },
            {
                displayName: 'E-Mail',
                name: 'emails',
                type: 'string',
                default: '',
                description: 'Filtrar contatos pelo e-mail',
            },
        ],
    },
];
