import {
    NodeApiError,
    NodeConnectionTypes,
    NodeOperationError,
} from 'n8n-workflow';
import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IDataObject,
    JsonObject,
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
    stageOperations,
    stageFields,
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
        description: 'Consume Krayin CRM REST API (Leads, Persons, Organizations, Activities, Products, and Pipelines)',
        defaults: {
            name: 'Krayin CRM',
        },
        usableAsTool: true,
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'krayinApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Activity',
                        value: 'activity',
                        description: 'Manage calls, meetings, lunches and tasks',
                    },
                    {
                        name: 'Lead',
                        value: 'lead',
                        description: 'Manage sales leads and opportunities',
                    },
                    {
                        name: 'Organization',
                        value: 'organization',
                        description: 'Manage companies and organizations',
                    },
                    {
                        name: 'Person',
                        value: 'person',
                        description: 'Manage individual contacts and customers',
                    },
                    {
                        name: 'Pipeline',
                        value: 'pipeline',
                        description: 'View sales pipelines',
                    },
                    {
                        name: 'Product',
                        value: 'product',
                        description: 'Manage products and services in CRM',
                    },
                    {
                        name: 'Stage',
                        value: 'stage',
                        description: 'View and filter pipeline stages',
                    },
                ],
                default: 'lead',
            },

            // Operations and Fields for Leads
            ...leadOperations,
            ...leadFields,

            // Operations and Fields for Persons
            ...personOperations,
            ...personFields,

            // Operations and Fields for Organizations
            ...organizationOperations,
            ...organizationFields,

            // Operations and Fields for Activities
            ...activityOperations,
            ...activityFields,

            // Operations and Fields for Products
            ...productOperations,
            ...productFields,

            // Operations and Fields for Pipelines
            ...pipelineOperations,
            ...pipelineFields,

            // Operations and Fields for Stages
            ...stageOperations,
            ...stageFields,
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
                // RESOURCE: LEAD (OPPORTUNITIES)
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
                            lead_pipeline_stage_id: lead_pipeline_stage_id || null,
                            entity_type: 'leads',
                            ...additionalFields,
                        };

                        if (person_id) {
                            body.person_id = person_id;
                            body.person = { id: person_id };
                        }
                        if (lead_pipeline_id) body.lead_pipeline_id = lead_pipeline_id;

                        // 1. Structured products via UI (Product ID, quantity, etc.)
                        const productsUi = this.getNodeParameter('productsUi', i, {}) as {
                            productValues?: Array<{
                                product_id: string;
                                quantity?: number;
                                price?: number;
                                amount?: number;
                                name?: string;
                            }>;
                        };
                        if (productsUi?.productValues && Array.isArray(productsUi.productValues)) {
                            for (const pv of productsUi.productValues) {
                                if (pv.product_id) {
                                    const pId = String(pv.product_id).trim();
                                    const qty = pv.quantity !== undefined && pv.quantity !== null && Number(pv.quantity) > 0 ? Number(pv.quantity) : 1;
                                    const customPrice = pv.price !== undefined && pv.price !== null && Number(pv.price) > 0 ? Number(pv.price) : 0;

                                    const resolved = await resolveProductDetails.call(this, pId, items[i]?.json);
                                    const finalPrice = customPrice > 0 ? customPrice : resolved.price;
                                    const amount = finalPrice * qty;

                                    if (!body.products) body.products = {};
                                    (body.products as IDataObject)[`product_${pId}`] = {
                                        product_id: pId,
                                        name: resolved.name,
                                        quantity: qty,
                                        price: finalPrice.toFixed(4),
                                        amount: amount.toFixed(4),
                                    };
                                }
                            }
                        }

                        // 2. Products via advanced JSON
                        const rawProducts = additionalFields.productsJson || additionalFields.products;
                        delete (body as any).productsJson;
                        if (rawProducts) {
                            const formatted = formatLeadProducts(rawProducts);
                            if (formatted) {
                                body.products = {
                                    ...((body.products as IDataObject) || {}),
                                    ...formatted,
                                };
                            }
                        }

                        // If lead_value is 0 or not provided, but products were provided, calculate lead_value from products
                        if ((!body.lead_value || Number(body.lead_value) === 0) && body.products && typeof body.products === 'object') {
                            let totalVal = 0;
                            for (const prod of Object.values(body.products as Record<string, any>)) {
                                totalVal += Number(prod.amount || 0);
                            }
                            if (totalVal > 0) {
                                body.lead_value = totalVal;
                            }
                        }

                        // 3. Extra/custom attributes structured via UI (code and freeform value)
                        const customAttributesUi = this.getNodeParameter('customAttributesUi', i, {}) as {
                            customAttributeValues?: Array<{
                                code: string;
                                value: any;
                            }>;
                        };
                        if (customAttributesUi?.customAttributeValues && Array.isArray(customAttributesUi.customAttributeValues)) {
                            for (const attr of customAttributesUi.customAttributeValues) {
                                if (attr.code && attr.code.trim()) {
                                    body[attr.code.trim()] = attr.value;
                                }
                            }
                        }

                        // 4. Extra attributes in advanced JSON
                        const customJson = additionalFields.customAttributesJson || additionalFields.customFieldsJson;
                        if (customJson) {
                            let custom = customJson;
                            if (typeof custom === 'string') {
                                try {
                                    custom = JSON.parse(custom);
                                } catch {
                                    // Fallback to empty object if custom attributes JSON parsing fails
                                    custom = {};
                                }
                            }
                            if (custom && typeof custom === 'object') {
                                Object.assign(body, custom);
                            }
                            delete body.customAttributesJson;
                            delete body.customFieldsJson;
                        }

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
                        const body: IDataObject = { ...updateFields };

                        // Determine product update mode (default: preserveAndAdd)
                        const productUpdateMode = (updateFields.productUpdateMode as string) || 'preserveAndAdd';
                        delete body.productUpdateMode;

                        // 1. Structured products via UI
                        const productsUi = this.getNodeParameter('productsUi', i, {}) as {
                            productValues?: Array<{
                                product_id: string;
                                quantity?: number;
                                price?: number;
                                amount?: number;
                                name?: string;
                            }>;
                        };

                        // 2. Products via advanced JSON
                        const rawProductsJson = updateFields.productsJson || updateFields.products;
                        delete body.productsJson;
                        delete body.products;

                        // Manage products according to productUpdateMode
                        if (productUpdateMode === 'clear') {
                            body.products = {};
                        } else {
                            const mergedProducts: Record<string, any> = {};
                            let currentLead: any = null;

                            // In 'preserveAndAdd' mode, fetch the current lead from CRM to preserve existing products
                            if (productUpdateMode === 'preserveAndAdd') {
                                try {
                                    const leadRes = await krayinApiRequest.call(this, 'GET', `/api/v1/leads/${leadId}`);
                                    currentLead = leadRes?.data && !Array.isArray(leadRes.data) ? leadRes.data : (Array.isArray(leadRes) ? leadRes[0] : leadRes);
                                } catch {
                                    currentLead = null;
                                }

                                if (currentLead) {
                                    const existingProducts = currentLead.lead_products || currentLead.products || [];
                                    if (Array.isArray(existingProducts)) {
                                        for (const ep of existingProducts) {
                                            const pId = String(ep.product_id || ep.product?.id || ep.id || '').trim();
                                            if (pId) {
                                                const pName = ep.name || ep.product?.name || `Product ${pId}`;
                                                const pQty = Number(ep.quantity) > 0 ? Number(ep.quantity) : 1;
                                                const pPrice = Number(ep.price !== undefined && ep.price !== null ? ep.price : (ep.product?.price || 0));
                                                const pAmount = Number(ep.amount !== undefined && ep.amount !== null ? ep.amount : (pPrice * pQty));

                                                mergedProducts[`product_${pId}`] = {
                                                    product_id: pId,
                                                    name: pName,
                                                    quantity: pQty,
                                                    price: pPrice.toFixed(4),
                                                    amount: pAmount.toFixed(4),
                                                };
                                            }
                                        }
                                    } else if (typeof existingProducts === 'object') {
                                        const formattedExisting = formatLeadProducts(existingProducts);
                                        if (formattedExisting) {
                                            Object.assign(mergedProducts, formattedExisting);
                                        }
                                    }
                                }
                            }

                            // Merge new products coming from UI
                            let hasNewProducts = false;
                            let addedProductsAmount = 0;

                            if (productsUi?.productValues && Array.isArray(productsUi.productValues)) {
                                for (const pv of productsUi.productValues) {
                                    if (pv.product_id) {
                                        const pId = String(pv.product_id).trim();
                                        const qty = pv.quantity !== undefined && pv.quantity !== null && Number(pv.quantity) > 0 ? Number(pv.quantity) : 1;
                                        const customPrice = pv.price !== undefined && pv.price !== null && Number(pv.price) > 0 ? Number(pv.price) : 0;

                                        const resolved = await resolveProductDetails.call(this, pId, items[i]?.json);
                                        const finalPrice = customPrice > 0 ? customPrice : resolved.price;
                                        const amount = finalPrice * qty;

                                        mergedProducts[`product_${pId}`] = {
                                            product_id: pId,
                                            name: resolved.name,
                                            quantity: qty,
                                            price: finalPrice.toFixed(4),
                                            amount: amount.toFixed(4),
                                        };

                                        hasNewProducts = true;
                                        addedProductsAmount += amount;
                                    }
                                }
                            }

                            // Merge new products coming from JSON
                            if (rawProductsJson) {
                                const formatted = formatLeadProducts(rawProductsJson);
                                if (formatted) {
                                    for (const [key, prod] of Object.entries(formatted)) {
                                        mergedProducts[key] = prod;
                                        hasNewProducts = true;
                                        addedProductsAmount += Number(prod.amount || 0);
                                    }
                                }
                            }

                            if (Object.keys(mergedProducts).length > 0) {
                                body.products = mergedProducts;
                            } else if (productUpdateMode === 'replace') {
                                body.products = {};
                            }

                            // If new products were added and lead_value was not explicitly passed in updateFields,
                            // update lead_value by adding current lead value + new products
                            if (hasNewProducts && body.lead_value === undefined && currentLead) {
                                const currentLeadValue = Number(currentLead.lead_value || 0);
                                body.lead_value = currentLeadValue + addedProductsAmount;
                            }
                        }

                        // 3. Extra attributes structured via UI
                        const customAttributesUi = this.getNodeParameter('customAttributesUi', i, {}) as {
                            customAttributeValues?: Array<{
                                code: string;
                                value: any;
                            }>;
                        };
                        if (customAttributesUi?.customAttributeValues && Array.isArray(customAttributesUi.customAttributeValues)) {
                            for (const attr of customAttributesUi.customAttributeValues) {
                                if (attr.code && attr.code.trim()) {
                                    body[attr.code.trim()] = attr.value;
                                }
                            }
                        }

                        // 4. Extra attributes in advanced JSON
                        const customJson = updateFields.customAttributesJson || updateFields.customFieldsJson;
                        if (customJson) {
                            let custom = customJson;
                            if (typeof custom === 'string') {
                                try {
                                    custom = JSON.parse(custom);
                                } catch {
                                    // Fallback to empty object if custom attributes JSON parsing fails
                                    custom = {};
                                }
                            }
                            if (custom && typeof custom === 'object') {
                                Object.assign(body, custom);
                            }
                            delete body.customAttributesJson;
                            delete body.customFieldsJson;
                        }

                        responseData = await krayinApiRequest.call(this, 'PUT', `/api/v1/leads/${leadId}`, body);
                    } else if (operation === 'delete') {
                        const leadId = this.getNodeParameter('leadId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'DELETE', `/api/v1/leads/${leadId}`);
                    }
                }

                // ============================================================
                // RESOURCE: PERSON (CONTACTS)
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
                            emails: email ? [{ value: email, label: 'work' }] : [],
                            contact_numbers: contact_number ? [{ value: contact_number, label: 'work' }] : [],
                            ...additionalFields,
                        };

                        if (organization_id) {
                            body.organization_id = organization_id;
                        }

                        responseData = await krayinApiRequest.call(this, 'POST', '/api/v1/contacts/persons', body);
                    } else if (operation === 'get') {
                        const personId = this.getNodeParameter('personId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'GET', `/api/v1/contacts/persons/${personId}`);
                    } else if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
                        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
                        const targetEmail = ((filters.emails || filters.email) as string || '').trim();
                        const targetName = ((filters.name) as string || '').trim();

                        let rawPersons: any[] = [];

                        if (targetEmail || targetName) {
                            const searchTerm = targetEmail || targetName;

                            // 1. Try search endpoint /search with Prettus RequestCriteria LIKE
                            try {
                                const searchRes = await krayinApiRequest.call(
                                    this,
                                    'GET',
                                    '/api/v1/contacts/persons/search',
                                    {},
                                    {
                                        search: searchTerm,
                                        searchFields: 'emails:like;name:like',
                                        searchJoin: 'or',
                                        limit: 100,
                                    },
                                );
                                rawPersons = Array.isArray(searchRes) ? searchRes : searchRes?.data || [];
                            } catch {
                                rawPersons = [];
                            }

                            // 2. If /search did not find anything (e.g. JSON field in MySQL or permissions),
                            // fetch all CRM contacts (with pagination=0 or full pagination)
                            if (rawPersons.length === 0) {
                                try {
                                    const fullRes = await krayinApiRequest.call(
                                        this,
                                        'GET',
                                        '/api/v1/contacts/persons',
                                        {},
                                        { pagination: 0 },
                                    );
                                    rawPersons = Array.isArray(fullRes) ? fullRes : fullRes?.data || [];
                                } catch {
                                    rawPersons = [];
                                }

                                if (rawPersons.length === 0) {
                                    rawPersons = await krayinApiRequestAllItems.call(this, '/api/v1/contacts/persons');
                                }
                            }

                            // 3. Precise in-memory validation and filtering
                            responseData = rawPersons.filter((person: any) => {
                                if (targetEmail) {
                                    const lowerTargetEmail = targetEmail.toLowerCase();
                                    let emailsList: any[] = [];
                                    if (Array.isArray(person.emails)) {
                                        emailsList = person.emails;
                                    } else if (typeof person.emails === 'string') {
                                        try {
                                            const parsed = JSON.parse(person.emails);
                                            emailsList = Array.isArray(parsed) ? parsed : [person.emails];
                                        } catch {
                                            emailsList = [person.emails];
                                        }
                                    }

                                    const emailMatch = emailsList.some((e: any) => {
                                        const val = typeof e === 'string' ? e : e?.value;
                                        if (!val) return false;
                                        const sVal = String(val).toLowerCase().trim();
                                        return sVal === lowerTargetEmail || sVal.includes(lowerTargetEmail);
                                    });

                                    if (!emailMatch) return false;
                                }

                                if (targetName) {
                                    const lowerTargetName = targetName.toLowerCase();
                                    const pName = String(person.name || '').toLowerCase().trim();
                                    if (!pName.includes(lowerTargetName)) return false;
                                }

                                return true;
                            });

                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i, 50) as number;
                                responseData = responseData.slice(0, limit);
                            }
                        } else {
                            if (returnAll) {
                                responseData = await krayinApiRequestAllItems.call(this, '/api/v1/contacts/persons');
                            } else {
                                const limit = this.getNodeParameter('limit', i, 50) as number;
                                const res = await krayinApiRequest.call(this, 'GET', '/api/v1/contacts/persons', {}, { limit });
                                responseData = res?.data || res;
                            }
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

                        responseData = await krayinApiRequest.call(this, 'PUT', `/api/v1/contacts/persons/${personId}`, body);
                    } else if (operation === 'delete') {
                        const personId = this.getNodeParameter('personId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'DELETE', `/api/v1/contacts/persons/${personId}`);
                    }
                }

                // ============================================================
                // RESOURCE: ORGANIZATION (COMPANIES)
                // ============================================================
                else if (resource === 'organization') {
                    if (operation === 'create') {
                        const name = this.getNodeParameter('name', i) as string;
                        const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
                        const body: IDataObject = {
                            name,
                            ...additionalFields,
                        };
                        responseData = await krayinApiRequest.call(this, 'POST', '/api/v1/contacts/organizations', body);
                    } else if (operation === 'get') {
                        const organizationId = this.getNodeParameter('organizationId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'GET', `/api/v1/contacts/organizations/${organizationId}`);
                    } else if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
                        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
                        const targetName = ((filters.name) as string || '').trim();

                        if (targetName) {
                            let orgs: any[] = [];
                            if (returnAll) {
                                orgs = await krayinApiRequestAllItems.call(this, '/api/v1/contacts/organizations');
                            } else {
                                const limit = this.getNodeParameter('limit', i, 50) as number;
                                const res = await krayinApiRequest.call(this, 'GET', '/api/v1/contacts/organizations', {}, { limit: Math.max(limit, 100) });
                                orgs = Array.isArray(res) ? res : res?.data || [];
                            }
                            const lowerTarget = targetName.toLowerCase();
                            responseData = orgs.filter((org: any) =>
                                String(org.name || '').toLowerCase().includes(lowerTarget)
                            );
                        } else {
                            if (returnAll) {
                                responseData = await krayinApiRequestAllItems.call(this, '/api/v1/contacts/organizations');
                            } else {
                                const limit = this.getNodeParameter('limit', i, 50) as number;
                                const res = await krayinApiRequest.call(this, 'GET', '/api/v1/contacts/organizations', {}, { limit });
                                responseData = res?.data || res;
                            }
                        }
                    } else if (operation === 'update') {
                        const organizationId = this.getNodeParameter('organizationId', i) as string;
                        const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
                        responseData = await krayinApiRequest.call(this, 'PUT', `/api/v1/contacts/organizations/${organizationId}`, updateFields);
                    } else if (operation === 'delete') {
                        const organizationId = this.getNodeParameter('organizationId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'DELETE', `/api/v1/contacts/organizations/${organizationId}`);
                    }
                }

                // ============================================================
                // RESOURCE: ACTIVITY (TASKS / MEETINGS / CALLS)
                // ============================================================
                else if (resource === 'activity') {
                    if (operation === 'create') {
                        const title = this.getNodeParameter('title', i) as string;
                        const type = this.getNodeParameter('type', i) as string;
                        const schedule_from = this.getNodeParameter('schedule_from', i, '') as string;
                        const schedule_to = this.getNodeParameter('schedule_to', i, '') as string;
                        const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

                        const body: IDataObject = {
                            title,
                            type,
                            ...additionalFields,
                        };
                        if (schedule_from) body.schedule_from = schedule_from;
                        if (schedule_to) body.schedule_to = schedule_to;

                        responseData = await krayinApiRequest.call(this, 'POST', '/api/v1/activities', body);
                    } else if (operation === 'get') {
                        const activityId = this.getNodeParameter('activityId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'GET', `/api/v1/activities/${activityId}`);
                    } else if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
                        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
                        const qs: IDataObject = { ...filters };

                        if (returnAll) {
                            responseData = await krayinApiRequestAllItems.call(this, '/api/v1/activities', qs);
                        } else {
                            const limit = this.getNodeParameter('limit', i, 50) as number;
                            qs.limit = limit;
                            const res = await krayinApiRequest.call(this, 'GET', '/api/v1/activities', {}, qs);
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
                // RESOURCE: PRODUCT (PRODUCTS / SERVICES)
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
                        const rawProductId = this.getNodeParameter('productId', i, '') as any;
                        const productId = String(rawProductId ?? '').trim();

                        if (!productId || productId === 'null' || productId === 'undefined') {
                            throw new NodeOperationError(
                                this.getNode(),
                                `The 'Product ID or SKU' parameter is empty or returned null. ` +
                                `Verify that the field exists in the previous node. Tip: in n8n use "$('processacrm').first().json.Oferta_code" ` +
                                `or "$node['processacrm'].json['Oferta_code']" to ensure the value is not null.`,
                                { itemIndex: i },
                            );
                        }

                        let product: any = null;

                        // 1. If purely numeric (digits only), fetch directly by ID (/products/{id})
                        if (/^\d+$/.test(productId)) {
                            try {
                                const res = await krayinApiRequest.call(this, 'GET', `/api/v1/products/${productId}`);
                                product = res?.data && !Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res[0] : res);
                            } catch (error: any) {
                                // If 404 by ID, try searching by SKU (in case a product has a purely numeric SKU)
                                try {
                                    const skuRes = await krayinApiRequest.call(this, 'GET', '/api/v1/products', {}, { sku: productId });
                                    const list = Array.isArray(skuRes) ? skuRes : skuRes?.data || [];
                                    if (list.length > 0) {
                                        product = list[0];
                                    }
                                } catch {
                                    // Retain original error if not found by SKU either
                                }
                                if (!product) {
                                    throw new NodeApiError(this.getNode(), error as JsonObject);
                                }
                            }
                        } else {
                            // 2. If text or alphanumeric code (e.g. offer code '9d5ejnqr'): search by SKU
                            const skuRes = await krayinApiRequest.call(this, 'GET', '/api/v1/products', {}, { sku: productId });
                            let list = Array.isArray(skuRes) ? skuRes : skuRes?.data || [];

                            // If direct search by ?sku= returned nothing, try search endpoint
                            if (list.length === 0) {
                                try {
                                    const searchRes = await krayinApiRequest.call(this, 'GET', '/api/v1/products', {}, { search: productId });
                                    list = Array.isArray(searchRes) ? searchRes : searchRes?.data || [];
                                } catch {
                                    list = [];
                                }
                            }

                            // If still not found, fetch all products and filter in-memory (case-insensitive)
                            if (list.length === 0) {
                                try {
                                    const allProds = await krayinApiRequestAllItems.call(this, '/api/v1/products');
                                    const lower = productId.toLowerCase();
                                    const matched = allProds.filter((p: any) =>
                                        String(p.sku || '').toLowerCase() === lower ||
                                        String(p.name || '').toLowerCase().includes(lower)
                                    );
                                    if (matched.length > 0) {
                                        list = matched;
                                    }
                                } catch {
                                    list = [];
                                }
                            }

                            if (list.length > 0) {
                                const exact = list.find((p: any) => String(p.sku || '').toLowerCase() === productId.toLowerCase());
                                product = exact || list[0];
                            } else {
                                throw new NodeOperationError(
                                    this.getNode(),
                                    `No product found in Krayin CRM with SKU or code: "${productId}".`,
                                    { itemIndex: i },
                                );
                            }
                        }

                        if (product) {
                            responseData = product;
                        }
                    } else if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
                        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
                        const targetSku = ((filters.sku) as string || '').trim();
                        const targetName = ((filters.name) as string || '').trim();

                        if (targetSku || targetName) {
                            let prods: any[] = [];
                            if (targetSku) {
                                const skuRes = await krayinApiRequest.call(this, 'GET', '/api/v1/products', {}, { sku: targetSku });
                                prods = Array.isArray(skuRes) ? skuRes : skuRes?.data || [];
                            }
                            if (prods.length === 0) {
                                if (returnAll) {
                                    prods = await krayinApiRequestAllItems.call(this, '/api/v1/products');
                                } else {
                                    const limit = this.getNodeParameter('limit', i, 50) as number;
                                    const res = await krayinApiRequest.call(this, 'GET', '/api/v1/products', {}, { limit: Math.max(limit, 100) });
                                    prods = Array.isArray(res) ? res : res?.data || [];
                                }
                            }

                            const lowerSku = targetSku.toLowerCase();
                            const lowerName = targetName.toLowerCase();
                            responseData = prods.filter((p: any) => {
                                if (targetSku && !String(p.sku || '').toLowerCase().includes(lowerSku)) {
                                    return false;
                                }
                                if (targetName && !String(p.name || '').toLowerCase().includes(lowerName)) {
                                    return false;
                                }
                                return true;
                            });

                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i, 50) as number;
                                responseData = responseData.slice(0, limit);
                            }
                        } else {
                            if (returnAll) {
                                responseData = await krayinApiRequestAllItems.call(this, '/api/v1/products');
                            } else {
                                const limit = this.getNodeParameter('limit', i, 50) as number;
                                const res = await krayinApiRequest.call(this, 'GET', '/api/v1/products', {}, { limit });
                                responseData = res?.data || res;
                            }
                        }
                    } else if (operation === 'update') {
                        let productId = this.getNodeParameter('productId', i) as string;
                        if (productId && !/^\d+$/.test(productId.trim())) {
                            try {
                                const sRes = await krayinApiRequest.call(this, 'GET', '/api/v1/products', {}, { sku: productId.trim() });
                                const list = Array.isArray(sRes) ? sRes : sRes?.data || [];
                                if (list.length > 0 && list[0].id) {
                                    productId = String(list[0].id);
                                }
                            } catch {
                                // fallback
                            }
                        }
                        const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
                        responseData = await krayinApiRequest.call(this, 'PUT', `/api/v1/products/${productId}`, updateFields);
                    } else if (operation === 'delete') {
                        let productId = this.getNodeParameter('productId', i) as string;
                        if (productId && !/^\d+$/.test(productId.trim())) {
                            try {
                                const sRes = await krayinApiRequest.call(this, 'GET', '/api/v1/products', {}, { sku: productId.trim() });
                                const list = Array.isArray(sRes) ? sRes : sRes?.data || [];
                                if (list.length > 0 && list[0].id) {
                                    productId = String(list[0].id);
                                }
                            } catch {
                                // fallback
                            }
                        }
                        responseData = await krayinApiRequest.call(this, 'DELETE', `/api/v1/products/${productId}`);
                    }
                }

                // ============================================================
                // RESOURCE: PIPELINE (PIPELINES AND STAGES)
                // ============================================================
                else if (resource === 'pipeline') {
                    if (operation === 'get') {
                        const pipelineId = this.getNodeParameter('pipelineId', i) as string;
                        responseData = await krayinApiRequest.call(this, 'GET', `/api/v1/settings/pipelines/${pipelineId}`);
                    } else if (operation === 'getAll') {
                        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
                        const qs: IDataObject = { ...filters };
                        const res = await krayinApiRequest.call(this, 'GET', '/api/v1/settings/pipelines', {}, qs);
                        responseData = res?.data || res;
                    } else if (operation === 'getStages') {
                        const pipelineId = this.getNodeParameter('pipelineId', i, '') as string;
                        const stageFilters = this.getNodeParameter('stageFilters', i, {}) as IDataObject;
                        responseData = await fetchAndFilterStages.call(this, pipelineId, stageFilters);
                    }
                }

                // ============================================================
                // RESOURCE: STAGE (PIPELINE STAGES)
                // ============================================================
                else if (resource === 'stage') {
                    if (operation === 'getAll') {
                        const pipelineId = this.getNodeParameter('pipelineId', i, '') as string;
                        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
                        responseData = await fetchAndFilterStages.call(this, pipelineId, filters);
                    } else if (operation === 'get') {
                        const pipelineId = this.getNodeParameter('pipelineId', i, '') as string;
                        const stageId = this.getNodeParameter('stageId', i) as string;
                        const stages = await fetchAndFilterStages.call(this, pipelineId, { id: stageId });
                        responseData = stages.length > 0 ? stages[0] : null;
                    }
                }

                // Normalize return data into n8n execution items
                if (Array.isArray(responseData)) {
                    for (const entry of responseData) {
                        returnData.push({ json: entry, pairedItem: { item: i } });
                    }
                } else if (responseData !== undefined && responseData !== null) {
                    returnData.push({ json: responseData, pairedItem: { item: i } });
                }
            } catch (error: any) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
                    continue;
                }
                throw new NodeApiError(this.getNode(), error as JsonObject);
            }
        }

        return [returnData];
    }
}

async function fetchAndFilterStages(
    this: IExecuteFunctions,
    pipelineId: string,
    filters: IDataObject,
): Promise<any[]> {
    let stages: any[] = [];

    if (pipelineId) {
        const res = await krayinApiRequest.call(this, 'GET', `/api/v1/settings/pipelines/${pipelineId}`);
        const pipelineData = res?.data || res;
        if (pipelineData && Array.isArray(pipelineData.stages)) {
            for (const s of pipelineData.stages) {
                stages.push({
                    ...s,
                    pipeline_id: pipelineData.id,
                    pipeline_name: pipelineData.name,
                });
            }
        }
    } else {
        const res = await krayinApiRequest.call(this, 'GET', '/api/v1/settings/pipelines');
        const pipelines = Array.isArray(res) ? res : res?.data || [];
        for (const p of pipelines) {
            if (p && Array.isArray(p.stages)) {
                for (const s of p.stages) {
                    stages.push({
                        ...s,
                        pipeline_id: p.id,
                        pipeline_name: p.name,
                    });
                }
            }
        }
    }

    if (filters.id) {
        const idStr = String(filters.id).trim();
        stages = stages.filter((s: any) => String(s.id).trim() === idStr);
    }

    if (filters.name) {
        const nameStr = String(filters.name).toLowerCase().trim();
        stages = stages.filter((s: any) =>
            s.name?.toLowerCase().trim() === nameStr ||
            s.name?.toLowerCase().includes(nameStr)
        );
    }

    if (filters.code) {
        const codeStr = String(filters.code).toLowerCase().trim();
        stages = stages.filter((s: any) => s.code?.toLowerCase().trim() === codeStr);
    }

    return stages;
}

function formatLeadProducts(input: any): Record<string, any> | undefined {
    if (!input) return undefined;

    let parsed = input;
    if (typeof input === 'string') {
        const trimmed = input.trim();
        if (!trimmed) return undefined;
        try {
            parsed = JSON.parse(trimmed);
        } catch {
            return undefined;
        }
    }

    if (!parsed || typeof parsed !== 'object') {
        return undefined;
    }

    const formatItem = (it: Record<string, any>, defaultId: string | number) => {
        const pId = String(it.product_id || it.product?.id || it.id || defaultId).trim();
        const pName = it.name || it.product?.name || `Product ${pId}`;
        const pQty = Number(it.quantity) > 0 ? Number(it.quantity) : 1;
        const rawPrice = Number(it.price !== undefined && it.price !== null ? it.price : (it.product?.price || 0));
        const rawAmount = Number(it.amount !== undefined && it.amount !== null ? it.amount : (rawPrice * pQty));
        return {
            product_id: pId,
            name: pName,
            quantity: pQty,
            price: rawPrice.toFixed(4),
            amount: rawAmount.toFixed(4),
        };
    };

    // Case 1: Already an object/dictionary
    if (!Array.isArray(parsed)) {
        // If single product (e.g. output from "Get a product": { id: 6, name: "...", price: 224 })
        if (parsed.id || parsed.product_id || parsed.product?.id) {
            const item = formatItem(parsed, parsed.product_id || parsed.id);
            return {
                [`product_${item.product_id}`]: item,
            };
        }

        // If already a dictionary of products, normalize keys to 'product_X'
        const result: Record<string, any> = {};
        for (const [key, item] of Object.entries(parsed)) {
            if (item && typeof item === 'object') {
                const defaultId = key.replace(/^product_/, '');
                const formatted = formatItem(item as Record<string, any>, defaultId);
                result[`product_${formatted.product_id}`] = formatted;
            }
        }
        return Object.keys(result).length > 0 ? result : undefined;
    }

    // Case 2: Array of products [ { product_id: 6, name: "...", ... } ]
    if (Array.isArray(parsed)) {
        const result: Record<string, any> = {};
        for (let idx = 0; idx < parsed.length; idx++) {
            const item = parsed[idx];
            if (item && typeof item === 'object') {
                const formatted = formatItem(item as Record<string, any>, idx + 1);
                result[`product_${formatted.product_id}`] = formatted;
            }
        }
        return Object.keys(result).length > 0 ? result : undefined;
    }

    return undefined;
}

async function resolveProductDetails(
    this: IExecuteFunctions,
    productId: string,
    fallbackItemJson: any,
): Promise<{ name: string; price: number }> {
    let name = '';
    let price = 0;

    // 1. Try getting from current input item if it matches the ID
    if (fallbackItemJson && (String(fallbackItemJson.id) === productId || String(fallbackItemJson.product_id) === productId)) {
        if (fallbackItemJson.name) name = String(fallbackItemJson.name);
        if (fallbackItemJson.price !== undefined && fallbackItemJson.price !== null) {
            price = parseFloat(fallbackItemJson.price as string) || 0;
        }
    }

    // 2. If no valid name or price (> 0) was found, fetch product directly from CRM API
    if (!name || price <= 0) {
        try {
            const prodRes = await krayinApiRequest.call(this, 'GET', `/api/v1/products/${productId}`);
            const pData = prodRes?.data && !Array.isArray(prodRes.data) ? prodRes.data : (Array.isArray(prodRes) ? prodRes[0] : prodRes);
            if (pData) {
                if (!name && pData.name) name = String(pData.name);
                if (price <= 0 && pData.price !== undefined && pData.price !== null) {
                    price = parseFloat(pData.price as string) || 0;
                }
            }
        } catch {
            // Silently fallback to standard defaults if lookup fails
        }
    }

    return {
        name: name || `Product ${productId}`,
        price: price > 0 ? price : 0,
    };
}


