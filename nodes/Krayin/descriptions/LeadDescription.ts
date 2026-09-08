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
            {
                displayName: 'Produtos em JSON (Avançado)',
                name: 'productsJson',
                type: 'json',
                default: '',
                description: 'Permite passar produtos diretamente via JSON, array de objetos ou objeto Krayin',
            },
            {
                displayName: 'Atributos Extras em JSON (Avançado)',
                name: 'customAttributesJson',
                type: 'json',
                default: '',
                description: 'Objeto JSON com quaisquer atributos personalizados para o lead (ex: {"hotmart_status": "APPROVED"})',
            },
        ],
    },

    // -------------------------------------------------------------
    // Produtos do Lead (Criar e Atualizar)
    // -------------------------------------------------------------
    {
        displayName: 'Produtos do Lead',
        name: 'productsUi',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        placeholder: 'Adicionar Produto',
        default: {},
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create', 'update'],
            },
        },
        description: 'Vincular produtos ao lead informando o ID e a quantidade',
        options: [
            {
                name: 'productValues',
                displayName: 'Produto',
                values: [
                    {
                        displayName: 'ID do Produto',
                        name: 'product_id',
                        type: 'string',
                        required: true,
                        default: '',
                        description: 'ID numérico do produto no Krayin CRM (ex: 6 ou {{ $json.id }})',
                    },
                    {
                        displayName: 'Quantidade',
                        name: 'quantity',
                        type: 'number',
                        default: 1,
                        description: 'Quantidade de unidades deste produto',
                    },
                    {
                        displayName: 'Preço Customizado (Opcional)',
                        name: 'price',
                        type: 'number',
                        default: 0,
                        description: 'Deixe 0 para buscar automaticamente o nome e preço cadastrados no CRM',
                    },
                ],
            },
        ],
    },

    // -------------------------------------------------------------
    // Atributos Extras / Customizados (Criar e Atualizar)
    // -------------------------------------------------------------
    {
        displayName: 'Atributos Extras (Custom Attributes)',
        name: 'customAttributesUi',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        placeholder: 'Adicionar Atributo',
        default: {},
        displayOptions: {
            show: {
                resource: ['lead'],
                operation: ['create', 'update'],
            },
        },
        description: 'Campos e atributos personalizados do seu CRM (ex: status, transação, observação externa, etc.)',
        options: [
            {
                name: 'customAttributeValues',
                displayName: 'Atributo',
                values: [
                    {
                        displayName: 'Código do Atributo (Code)',
                        name: 'code',
                        type: 'string',
                        required: true,
                        default: '',
                        placeholder: 'ex: hotmart_status',
                        description: 'Código da coluna/atributo customizado cadastrado no Krayin CRM',
                    },
                    {
                        displayName: 'Valor',
                        name: 'value',
                        type: 'string',
                        default: '',
                        placeholder: 'ex: APPROVED',
                        description: 'Valor do atributo',
                    },
                ],
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
                displayName: 'ID da Origem (Source ID)',
                name: 'lead_source_id',
                type: 'string',
                default: '',
                description: 'ID da origem do lead',
            },
            {
                displayName: 'ID do Tipo de Lead',
                name: 'lead_type_id',
                type: 'string',
                default: '',
                description: 'ID da categoria do lead',
            },
            {
                displayName: 'Data Prevista de Fechamento',
                name: 'expected_close_date',
                type: 'dateTime',
                default: '',
                description: 'Previsão de conclusão',
            },
            {
                displayName: 'Modo de Atualização de Produtos',
                name: 'productUpdateMode',
                type: 'options',
                options: [
                    {
                        name: 'Preservar Existentes e Mesclar Novos (Padrão)',
                        value: 'preserveAndAdd',
                        description: 'Mantém os produtos atuais do lead intactos e anexa os novos informados',
                    },
                    {
                        name: 'Substituir Todos (Overwrite)',
                        value: 'replace',
                        description: 'Substitui todos os produtos do lead exclusivamente pelos informados nesta execução',
                    },
                    {
                        name: 'Remover Todos os Produtos',
                        value: 'clear',
                        description: 'Remove todos os produtos vinculados ao lead',
                    },
                ],
                default: 'preserveAndAdd',
                description: 'Define como os produtos do lead devem ser gerenciados nesta atualização',
            },
            {
                displayName: 'Produtos em JSON (Avançado)',
                name: 'productsJson',
                type: 'json',
                default: '',
                description: 'Permite passar produtos diretamente via JSON, array de objetos ou objeto Krayin',
            },
            {
                displayName: 'Atributos Extras em JSON (Avançado)',
                name: 'customAttributesJson',
                type: 'json',
                default: '',
                description: 'Objeto JSON com quaisquer atributos personalizados para o lead',
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
                displayName: 'ID do Contato (Person ID)',
                name: 'person_id',
                type: 'string',
                default: '',
                description: 'Filtrar leads vinculados a um contato/cliente específico (ex: ID que veio de Listar Contatos)',
            },
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
                description: 'Filtrar leads de uma fase específica do funil',
            },
            {
                displayName: 'ID do Responsável / Vendedor (User ID)',
                name: 'user_id',
                type: 'string',
                default: '',
                description: 'Filtrar leads atribuídos ao usuário/vendedor do CRM',
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
                description: 'Filtrar pela situação do lead',
            },
        ],
    },
];
