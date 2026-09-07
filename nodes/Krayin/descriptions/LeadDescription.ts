import type { INodeProperties } from 'n8n-workflow';

export const leadOperations: INodeProperties[] = [
    {
        displayName: 'Operação',
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
                name: 'Criar Lead',
                value: 'create',
                description: 'Criar uma nova oportunidade ou lead no funil',
                action: 'Criar um lead',
            },
            {
                name: 'Obter Lead',
                value: 'get',
                description: 'Buscar um lead específico pelo ID',
                action: 'Obter um lead',
            },
            {
                name: 'Listar Leads',
                value: 'getAll',
                description: 'Listar oportunidades/leads com filtros e paginação',
                action: 'Listar leads',
            },
            {
                name: 'Atualizar Lead',
                value: 'update',
                description: 'Atualizar dados, estágio ou status de um lead',
                action: 'Atualizar um lead',
            },
            {
                name: 'Excluir Lead',
                value: 'delete',
                description: 'Remover um lead pelo ID',
                action: 'Excluir um lead',
            },
        ],
        default: 'getAll',
    },
];

export const leadFields: INodeProperties[] = [
    // -------------------------------------------------------------
    // Obter / Excluir Lead
    // -------------------------------------------------------------
    {
        displayName: 'ID do Lead',
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
        description: 'O ID numérico do lead no Krayin CRM',
    },

    // -------------------------------------------------------------
    // Criar Lead
    // -------------------------------------------------------------
    {
        displayName: 'Título',
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
        description: 'Título ou nome da oportunidade de venda',
    },
    {
        displayName: 'Valor do Lead',
        name: 'lead_value',
        type: 'number',
        default: 0,
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create'],
            },
        },
        description: 'Valor monetário estimado da oportunidade',
    },
    {
        displayName: 'ID da Pessoa (Contato)',
        name: 'person_id',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create'],
            },
        },
        description: 'ID da pessoa/contato associado a este lead',
    },
    {
        displayName: 'ID do Funil (Pipeline)',
        name: 'lead_pipeline_id',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create'],
            },
        },
        description: 'ID do funil de vendas (se vazio, usa o funil padrão)',
    },
    {
        displayName: 'ID da Fase (Stage)',
        name: 'lead_pipeline_stage_id',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create'],
            },
        },
        description: 'ID da etapa do funil em que o lead será criado',
    },
    {
        displayName: 'Campos Adicionais',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Adicionar Campo',
        default: {},
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Descrição',
                name: 'description',
                type: 'string',
                typeOptions: {
                    rows: 3,
                },
                default: '',
                description: 'Detalhes ou anotações sobre o lead',
            },
            {
                displayName: 'ID da Origem (Source ID)',
                name: 'lead_source_id',
                type: 'string',
                default: '',
                description: 'ID da origem do lead (ex: Google, Indicação, etc.)',
            },
            {
                displayName: 'ID do Tipo de Lead',
                name: 'lead_type_id',
                type: 'string',
                default: '',
                description: 'ID da categoria/tipo de oportunidade',
            },
            {
                displayName: 'ID do Responsável (User ID)',
                name: 'user_id',
                type: 'string',
                default: '',
                description: 'ID do vendedor/usuário responsável pelo lead',
            },
            {
                displayName: 'Data Prevista de Fechamento',
                name: 'expected_close_date',
                type: 'dateTime',
                default: '',
                description: 'Previsão de quando a negociação será finalizada',
            },
        ],
    },

    // -------------------------------------------------------------
    // Atualizar Lead
    // -------------------------------------------------------------
    {
        displayName: 'Campos para Atualizar',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Adicionar Campo',
        default: {},
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Título',
                name: 'title',
                type: 'string',
                default: '',
                description: 'Novo título da oportunidade',
            },
            {
                displayName: 'Valor do Lead',
                name: 'lead_value',
                type: 'number',
                default: 0,
                description: 'Novo valor da oportunidade',
            },
            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                options: [
                    { name: 'Aberto', value: 1 },
                    { name: 'Ganho (Won)', value: 2 },
                    { name: 'Perdido (Lost)', value: 3 },
                ],
                default: 1,
                description: 'Situação da negociação',
            },
            {
                displayName: 'ID da Fase (Stage)',
                name: 'lead_pipeline_stage_id',
                type: 'string',
                default: '',
                description: 'Mover lead para uma nova fase do funil',
            },
            {
                displayName: 'ID do Funil (Pipeline)',
                name: 'lead_pipeline_id',
                type: 'string',
                default: '',
                description: 'ID do funil de vendas',
            },
            {
                displayName: 'Descrição',
                name: 'description',
                type: 'string',
                typeOptions: {
                    rows: 3,
                },
                default: '',
                description: 'Descrição ou notas',
            },
            {
                displayName: 'ID do Responsável (User ID)',
                name: 'user_id',
                type: 'string',
                default: '',
                description: 'Reatribuir lead para outro usuário',
            },
            {
                displayName: 'Data Prevista de Fechamento',
                name: 'expected_close_date',
                type: 'dateTime',
                default: '',
                description: 'Previsão de conclusão',
            },
        ],
    },

    // -------------------------------------------------------------
    // Listar Leads (getAll)
    // -------------------------------------------------------------
    {
        displayName: 'Retornar Todos',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['getAll'],
            },
        },
        description: 'Se deve retornar todos os registros usando paginação automática',
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
                resource: ['lead'],
                operation: ['getAll'],
                returnAll: [false],
            },
        },
        description: 'Quantidade máxima de registros a retornar',
    },
    {
        displayName: 'Filtros',
        name: 'filters',
        type: 'collection',
        placeholder: 'Adicionar Filtro',
        default: {},
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'ID do Funil (Pipeline ID)',
                name: 'lead_pipeline_id',
                type: 'string',
                default: '',
                description: 'Filtrar leads de um funil específico',
            },
            {
                displayName: 'ID da Fase (Stage ID)',
                name: 'lead_pipeline_stage_id',
                type: 'string',
                default: '',
                description: 'Filtrar leads de uma fase específica',
            },
            {
                displayName: 'ID do Responsável (User ID)',
                name: 'user_id',
                type: 'string',
                default: '',
                description: 'Filtrar leads atribuídos a um usuário',
            },
        ],
    },
];
