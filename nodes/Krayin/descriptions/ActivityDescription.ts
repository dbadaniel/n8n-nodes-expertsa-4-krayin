import type { INodeProperties } from 'n8n-workflow';

export const activityOperations: INodeProperties[] = [
    {
        displayName: 'Operação',
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
                name: 'Criar Atividade',
                value: 'create',
                description: 'Agendar uma tarefa, ligação, reunião ou almoço',
                action: 'Criar uma atividade',
            },
            {
                name: 'Obter Atividade',
                value: 'get',
                description: 'Buscar uma atividade pelo ID',
                action: 'Obter uma atividade',
            },
            {
                name: 'Listar Atividades',
                value: 'getAll',
                description: 'Listar atividades agendadas',
                action: 'Listar atividades',
            },
            {
                name: 'Atualizar Atividade',
                value: 'update',
                description: 'Atualizar dados ou marcar atividade como concluída',
                action: 'Atualizar uma atividade',
            },
            {
                name: 'Excluir Atividade',
                value: 'delete',
                description: 'Excluir uma atividade pelo ID',
                action: 'Excluir uma atividade',
            },
        ],
        default: 'getAll',
    },
];

export const activityFields: INodeProperties[] = [
    {
        displayName: 'ID da Atividade',
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
        description: 'O ID numérico da atividade no Krayin CRM',
    },
    {
        displayName: 'Título',
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
        description: 'Título ou resumo da atividade',
    },
    {
        displayName: 'Tipo de Atividade',
        name: 'type',
        type: 'options',
        options: [
            { name: 'Ligação (Call)', value: 'call' },
            { name: 'Reunião (Meeting)', value: 'meeting' },
            { name: 'Almoço (Lunch)', value: 'lunch' },
            { name: 'Anotação / Tarefa (Note)', value: 'note' },
        ],
        default: 'call',
        required: true,
        displayOptions: {
            show: {
                resource: ['activity'],
                operation: ['create'],
            },
        },
        description: 'Tipo de compromisso ou tarefa',
    },
    {
        displayName: 'Data/Hora de Início',
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
        description: 'Horário de início programado',
    },
    {
        displayName: 'Data/Hora de Fim',
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
        description: 'Horário de término programado',
    },
    {
        displayName: 'Campos Adicionais',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Adicionar Campo',
        default: {},
        displayOptions: {
            show: {
                resource: ['activity'],
                operation: ['create'],
            },
        },
        options: [
            {
                displayName: 'Comentário / Detalhes',
                name: 'comment',
                type: 'string',
                typeOptions: {
                    rows: 3,
                },
                default: '',
                description: 'Observações sobre a atividade',
            },
            {
                displayName: 'ID do Lead',
                name: 'lead_id',
                type: 'string',
                default: '',
                description: 'Vincular esta atividade a uma oportunidade de lead',
            },
            {
                displayName: 'Localização',
                name: 'location',
                type: 'string',
                default: '',
                description: 'Local ou link da reunião (ex: Google Meet)',
            },
        ],
    },
    {
        displayName: 'Campos para Atualizar',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Adicionar Campo',
        default: {},
        displayOptions: {
            show: {
                resource: ['activity'],
                operation: ['update'],
            },
        },
        options: [
            {
                displayName: 'Título',
                name: 'title',
                type: 'string',
                default: '',
                description: 'Título da atividade',
            },
            {
                displayName: 'Concluída (is_done)',
                name: 'is_done',
                type: 'boolean',
                default: false,
                description: 'Se a atividade já foi realizada',
            },
            {
                displayName: 'Comentário',
                name: 'comment',
                type: 'string',
                default: '',
                description: 'Comentários ou anotações',
            },
        ],
    },
    {
        displayName: 'Retornar Todos',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: ['activity'],
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
                resource: ['activity'],
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
                resource: ['activity'],
                operation: ['getAll'],
            },
        },
        options: [
            {
                displayName: 'Tipo de Atividade',
                name: 'type',
                type: 'options',
                options: [
                    { name: 'Ligação (Call)', value: 'call' },
                    { name: 'Reunião (Meeting)', value: 'meeting' },
                    { name: 'Almoço (Lunch)', value: 'lunch' },
                    { name: 'Anotação / Tarefa (Note)', value: 'note' },
                ],
                default: 'call',
                description: 'Filtrar por tipo de atividade',
            },
            {
                displayName: 'Concluída (is_done)',
                name: 'is_done',
                type: 'boolean',
                default: false,
                description: 'Filtrar por atividades concluídas (1) ou pendentes (0)',
            },
            {
                displayName: 'ID do Lead',
                name: 'lead_id',
                type: 'string',
                default: '',
                description: 'Filtrar atividades vinculadas a um lead específico',
            },
        ],
    },
];
