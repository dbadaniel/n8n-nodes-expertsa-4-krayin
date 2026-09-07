import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IDataObject,
} from 'n8n-workflow';

import {
    leadOperations,
    leadFields,
    personOperations,
    personFields,
    organizationOperations,
    organizationFields,
    activityOperations,
    activityFields,
    productOperations,
    productFields,
    pipelineOperations,
    pipelineFields,
} from './descriptions';

import {
    krayinApiRequest,
    krayinApiRequestAllItems,
} from './GenericFunctions';

export class Krayin implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Krayin CRM',
        name: 'krayin',
        icon: 'file:krayin.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Integração completa com a API REST do Krayin CRM (Leads, Contatos, Empresas, Atividades e Produtos)',
        defaults: {
            name: 'Krayin CRM',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'krayinApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Recurso',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Lead / Oportunidade',
                        value: 'lead',
                        description: 'Gerenciar oportunidades de vendas no funil',
                    },
                    {
                        name: 'Pessoa / Contato',
                        value: 'person',
                        description: 'Gerenciar pessoas e contatos de clientes',
                    },
                    {
                        name: 'Organização / Empresa',
                        value: 'organization',
                        description: 'Gerenciar empresas e organizações',
                    },
                    {
                        name: 'Atividade / Tarefa',
                        value: 'activity',
                        description: 'Gerenciar chamadas, reuniões e tarefas',
                    },
                    {
                        name: 'Produto / Serviço',
                        value: 'product',
                        description: 'Gerenciar produtos e itens do CRM',
                    },
                    {
                        name: 'Funil (Pipeline)',
                        value: 'pipeline',
                        description: 'Consultar pipelines e etapas de vendas',
                    },
                ],
                default: 'lead',
            },

            // Operações e Campos de Leads
            ...leadOperations,
            ...leadFields,

            // Operações e Campos de Persons
            ...personOperations,
            ...personFields,

            // Operações e Campos de Organizations
            ...organizationOperations,
            ...organizationFields,

            // Operações e Campos de Activities
            ...activityOperations,
            ...activityFields,

            // Operações e Campos de Products
            ...productOperations,
            ...productFields,

            // Operações e Campos de Pipelines
            ...pipelineOperations,
            ...pipelineFields,
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        for (let i = 0; i < items.length; i++) {
            try {
                let responseData: any;

                // ============================================================
                // RECURSO: LEAD (OPORTUNIDADES)
                // ============================================================
                if (resource === 'lead') {
                    if (operation === 'create') {
                        const title = this.getNodeParameter('title', i) as string;
                        const lead_value = this.getNodeParameter('lead_value', i) as number;
                        const person_id = this.getNodeParameter('person_id', i, '') as string;
                        const lead_pipeline_id = this.getNodeParameter('lead_pipeline_id', i, '') as string;
                        const lead_pipeline_stage_id = this.getNodeParameter('lead_pipeline_stage_id', i, '') as string;
                        const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

                        const body: IDataObject = {
                            title,
                            lead_value,
                            ...additionalFields,
                        };

                        if (person_id) body.person_id = person_id;
                        if (lead_pipeline_id) body.lead_pipeline_id = lead_pipeline_id;
                        if (lead_pipeline_stage_id) body.lead_pipeline_stage_id = lead_pipeline_stage_id;

                        responseData = await krayinApiRequest.call(this, 'POST', '/api/v1/leads', body);
                    } else if (operation === 'get') {
                        const leadId = this.getNodeParameter('leadId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'GET', `/api/v1/leads/${leadId}`);
                    } else if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
                        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
                        const qs: IDataObject = { ...filters };

                        if (returnAll) {
                            responseData = await krayinApiRequestAllItems.call(this, '/api/v1/leads', qs);
                        } else {
                            const limit = this.getNodeParameter('limit', i, 50) as number;
                            qs.limit = limit;
                            const res = await krayinApiRequest.call(this, 'GET', '/api/v1/leads', {}, qs);
                            responseData = res?.data || res;
                        }
                    } else if (operation === 'update') {
                        const leadId = this.getNodeParameter('leadId', i) as string;
                        const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
                        responseData = await krayinApiRequest.call(this, 'PUT', `/api/v1/leads/${leadId}`, updateFields);
                    } else if (operation === 'delete') {
                        const leadId = this.getNodeParameter('leadId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'DELETE', `/api/v1/leads/${leadId}`);
                    }
                }

                // ============================================================
                // RECURSO: PERSON (CONTATOS)
                // ============================================================
                else if (resource === 'person') {
                    if (operation === 'create') {
                        const name = this.getNodeParameter('name', i) as string;
                        const email = this.getNodeParameter('email', i, '') as string;
                        const contact_number = this.getNodeParameter('contact_number', i, '') as string;
                        const organization_id = this.getNodeParameter('organization_id', i, '') as string;
                        const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

                        const body: IDataObject = {
                            name,
                            ...additionalFields,
                        };

                        if (email) {
                            body.emails = [{ value: email, label: 'work' }];
                        }
                        if (contact_number) {
                            body.contact_numbers = [{ value: contact_number, label: 'work' }];
                        }
                        if (organization_id) {
                            body.organization_id = organization_id;
                        }

                        responseData = await krayinApiRequest.call(this, 'POST', '/api/v1/persons', body);
                    } else if (operation === 'get') {
                        const personId = this.getNodeParameter('personId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'GET', `/api/v1/persons/${personId}`);
                    } else if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
                        if (returnAll) {
                            responseData = await krayinApiRequestAllItems.call(this, '/api/v1/persons');
                        } else {
                            const limit = this.getNodeParameter('limit', i, 50) as number;
                            const res = await krayinApiRequest.call(this, 'GET', '/api/v1/persons', {}, { limit });
                            responseData = res?.data || res;
                        }
                    } else if (operation === 'update') {
                        const personId = this.getNodeParameter('personId', i) as string;
                        const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
                        const body: IDataObject = { ...updateFields };

                        if (updateFields.email) {
                            body.emails = [{ value: updateFields.email, label: 'work' }];
                            delete body.email;
                        }
                        if (updateFields.contact_number) {
                            body.contact_numbers = [{ value: updateFields.contact_number, label: 'work' }];
                            delete body.contact_number;
                        }

                        responseData = await krayinApiRequest.call(this, 'PUT', `/api/v1/persons/${personId}`, body);
                    } else if (operation === 'delete') {
                        const personId = this.getNodeParameter('personId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'DELETE', `/api/v1/persons/${personId}`);
                    }
                }

                // ============================================================
                // RECURSO: ORGANIZATION (EMPRESAS)
                // ============================================================
                else if (resource === 'organization') {
                    if (operation === 'create') {
                        const name = this.getNodeParameter('name', i) as string;
                        const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
                        const body: IDataObject = {
                            name,
                            ...additionalFields,
                        };
                        responseData = await krayinApiRequest.call(this, 'POST', '/api/v1/organizations', body);
                    } else if (operation === 'get') {
                        const organizationId = this.getNodeParameter('organizationId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'GET', `/api/v1/organizations/${organizationId}`);
                    } else if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
                        if (returnAll) {
                            responseData = await krayinApiRequestAllItems.call(this, '/api/v1/organizations');
                        } else {
                            const limit = this.getNodeParameter('limit', i, 50) as number;
                            const res = await krayinApiRequest.call(this, 'GET', '/api/v1/organizations', {}, { limit });
                            responseData = res?.data || res;
                        }
                    } else if (operation === 'update') {
                        const organizationId = this.getNodeParameter('organizationId', i) as string;
                        const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
                        responseData = await krayinApiRequest.call(this, 'PUT', `/api/v1/organizations/${organizationId}`, updateFields);
                    } else if (operation === 'delete') {
                        const organizationId = this.getNodeParameter('organizationId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'DELETE', `/api/v1/organizations/${organizationId}`);
                    }
                }

                // ============================================================
                // RECURSO: ACTIVITY (ATENÇÃO / TAREFAS / COMPROMISSOS)
                // ============================================================
                else if (resource === 'activity') {
                    if (operation === 'create') {
                        const title = this.getNodeParameter('title', i) as string;
                        const type = this.getNodeParameter('type', i) as string;
                        const schedule_from = this.getNodeParameter('schedule_from', i) as string;
                        const schedule_to = this.getNodeParameter('schedule_to', i) as string;
                        const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

                        const body: IDataObject = {
                            title,
                            type,
                            schedule_from,
                            schedule_to,
                            ...additionalFields,
                        };
                        responseData = await krayinApiRequest.call(this, 'POST', '/api/v1/activities', body);
                    } else if (operation === 'get') {
                        const activityId = this.getNodeParameter('activityId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'GET', `/api/v1/activities/${activityId}`);
                    } else if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
                        if (returnAll) {
                            responseData = await krayinApiRequestAllItems.call(this, '/api/v1/activities');
                        } else {
                            const limit = this.getNodeParameter('limit', i, 50) as number;
                            const res = await krayinApiRequest.call(this, 'GET', '/api/v1/activities', {}, { limit });
                            responseData = res?.data || res;
                        }
                    } else if (operation === 'update') {
                        const activityId = this.getNodeParameter('activityId', i) as string;
                        const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
                        responseData = await krayinApiRequest.call(this, 'PUT', `/api/v1/activities/${activityId}`, updateFields);
                    } else if (operation === 'delete') {
                        const activityId = this.getNodeParameter('activityId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'DELETE', `/api/v1/activities/${activityId}`);
                    }
                }

                // ============================================================
                // RECURSO: PRODUCT (PRODUTOS / SERVIÇOS)
                // ============================================================
                else if (resource === 'product') {
                    if (operation === 'create') {
                        const name = this.getNodeParameter('name', i) as string;
                        const sku = this.getNodeParameter('sku', i) as string;
                        const price = this.getNodeParameter('price', i) as number;
                        const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

                        const body: IDataObject = {
                            name,
                            sku,
                            price,
                            ...additionalFields,
                        };
                        responseData = await krayinApiRequest.call(this, 'POST', '/api/v1/products', body);
                    } else if (operation === 'get') {
                        const productId = this.getNodeParameter('productId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'GET', `/api/v1/products/${productId}`);
                    } else if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
                        if (returnAll) {
                            responseData = await krayinApiRequestAllItems.call(this, '/api/v1/products');
                        } else {
                            const limit = this.getNodeParameter('limit', i, 50) as number;
                            const res = await krayinApiRequest.call(this, 'GET', '/api/v1/products', {}, { limit });
                            responseData = res?.data || res;
                        }
                    } else if (operation === 'update') {
                        const productId = this.getNodeParameter('productId', i) as string;
                        const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
                        responseData = await krayinApiRequest.call(this, 'PUT', `/api/v1/products/${productId}`, updateFields);
                    } else if (operation === 'delete') {
                        const productId = this.getNodeParameter('productId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'DELETE', `/api/v1/products/${productId}`);
                    }
                }

                // ============================================================
                // RECURSO: PIPELINE (FUNIS E ESTÁGIOS)
                // ============================================================
                else if (resource === 'pipeline') {
                    if (operation === 'get') {
                        const pipelineId = this.getNodeParameter('pipelineId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'GET', `/api/v1/pipelines/${pipelineId}`);
                    } else if (operation === 'getAll') {
                        const res = await krayinApiRequest.call(this, 'GET', '/api/v1/pipelines');
                        responseData = res?.data || res;
                    }
                }

                // Normaliza o retorno em itens do n8n
                if (Array.isArray(responseData)) {
                    for (const entry of responseData) {
                        returnData.push({ json: entry });
                    }
                } else if (responseData !== undefined && responseData !== null) {
                    returnData.push({ json: responseData });
                }
            } catch (error: any) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}
