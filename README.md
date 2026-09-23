<div align="center">
  <img src="./Exsa-azul.png" alt="Expertsa" width="480"/>
  <h1>n8n-nodes-expertsa-4-krayin</h1>
  <p><strong>Full-featured & Intelligent Krayin CRM Integration for n8n</strong></p>
</div>

Built to address real-world operational challenges in digital sales workflows. Fully optimized for Krayin CRM.

---

## 🚀 Why is this node different?

Most CRM integrations are basic wrappers, but this node was engineered specifically to solve real-world pains and production requirements:

- 🛡️ **Intelligent Lead Product Preservation**: In standard Krayin CRM API updates, modifying a lead wipes out all attached products unless you resend the entire catalog array. Our node handles this seamlessly: when moving a lead between stages (e.g. from abandoned checkout to approved purchase), it queries existing products and preserves them 100% intact — without requiring custom code or complex `flatMap`, `reduce`, or `JSON.stringify` expressions.
- ➕ **Frictionless Offer Merging & Upsells**: Need to add an upsell or new product offer to an existing lead? Simply provide the Product ID and Quantity. The node appends the new offer while keeping previous products and automatically recalculates the total opportunity value.
- 🎯 **Simplified Product Attachment**: No need to manually construct nested payloads with floating-point decimals (`224.0000`). Specify just the **Product ID** and **Quantity** — the node looks up and populates the official name and unit price directly from your CRM catalog.
- 🔍 **Smart Lookup by SKU or Offer Code**: If your sales platforms (Hotmart, Stripe, Shopify, Eduzz, Kiwify, etc.) send alphanumeric offer codes, the node locates the product by numeric ID, exact SKU, or catalog search without crashing your workflow on 404 errors.
- 🧩 **Custom & Extra Attributes**: Easily pass any custom fields defined in your CRM (e.g., `hotmart_status`, `transaction_id`, `utm_source`, `coupon`) structured via the UI or as raw JSON without rigid schema restrictions.
- 🔄 **Direct Pipeline & Stage Filtering**: Query and filter stages by name or code to dynamically route leads across sales pipelines.
- 🔑 **Reliable Login-Based Authentication**: Robust support for direct Login authentication (Email & Password) with automated in-memory token caching and periodic refresh.

---

## 📚 Features & Operations Guide

This node supports all core Krayin CRM resources:

### 1. 💼 Leads & Opportunities
- **Create Lead (`create`)**:
  - Title, opportunity value, linked contact (`person_id`), pipeline, and initial stage.
  - **Lead Products**: Add one or multiple products specifying just `Product ID` and `Quantity`. If the lead value is left as 0, it is automatically calculated from the products sum.
  - **Custom Attributes**: Add custom attributes via `Code` and `Value` pairs or advanced JSON.
- **Get Lead (`get`)**: Fetch comprehensive lead details by ID, including attached products and contacts.
- **Get Many Leads (`getAll`)**: Filter leads by pipeline (`pipeline_id`), stage (`stage_id`), or assigned user (`user_id`), with automatic pagination.
- **Update Lead (`update`)**:
  - **Stage Transitions**: Change the `Stage ID` — all existing products are preserved automatically.
  - **Product Update Mode**: Choose between `Preserve Existing and Add New (Default)`, `Replace All (Overwrite)`, or `Clear All Products`.
  - **Deal Status**: Switch between *Open*, *Won*, or *Lost*.
- **Delete Lead (`delete`)**: Remove the lead opportunity from CRM.

### 2. 📦 Products & Services
- **Get Product (`get`)**:
  - Accepts **numeric ID** (e.g. `12`) or **alphanumeric code / SKU** (e.g. `9t67pevq`).
  - Standardized top-level response for clean n8n mapping (`$json.id`, `$json.price`, `$json.name`).
- **Get Many Products (`getAll`)**: Filter products by SKU or name with automatic pagination.
- **Create Product (`create`)**: Register new products with name, SKU, price, and description.
- **Update & Delete Products**: Keep your product catalog synchronized.

### 3. 👤 Contacts (Persons)
- **Create Contact (`create`)**: Add contacts with email, phone numbers, job title, and organization link.
- **Get Contact (`get`)**: Retrieve contact details by ID.
- **Get Many Contacts (`getAll`)**: Search by name or email, or list all contacts.
- **Update & Delete Contacts**.

### 4. 🏢 Organizations (Companies)
- **Create Organization (`create`)**: Add company profiles with full address information.
- **Get & Get Many Organizations**: View companies associated with your contacts and opportunities.
- **Update & Delete Organizations**.

### 5. 📅 Activities (Tasks & Calendar)
- **Create Activity (`create`)**: Schedule calls, meetings, lunches, or notes with start/end timestamps linked to a lead.
- **Get Many Activities (`getAll`)**: Track pending and completed activities.
- **Update Activity (`update`)**: Mark as completed (`is_done`) or update notes.
- **Delete Activity (`delete`)**.

### 6. 📊 Sales Pipelines & Stages
- **Pipeline (`pipeline`)**: List all sales pipelines configured in your CRM.
- **Stage (`stage`)**: Retrieve pipeline stages with filters by `Pipeline ID`, `Stage Name`, or `Stage Code` (e.g. `won`, `lost`).

---

## 🔐 Credential Setup

In n8n, navigate to **Credentials > Add Credential** and search for **Krayin CRM API**.

### 🌟 Option 1: API Token (Personal Access Token) — Recommended for High Concurrency
This is the fastest, zero-latency, and most robust method for production workflows handling simultaneous webhooks.

To enable Personal Access Tokens visually in your Krayin CRM, install the official [**expertsa/krayin-api-keys**](https://github.com/expertsa/krayin-api-keys) plugin:

```bash
# In your Krayin CRM root directory:
composer require expertsa/krayin-api-keys
php artisan optimize:clear
```

**How to get your API Token:**
1. In your Krayin CRM panel, go to **Settings > API Keys** (`/admin/settings/api-keys`).
2. Click **"+ Create API Key"** and give it a label (e.g. `n8n Production`).
3. Copy the generated Personal Access Token.
4. In n8n, select **Authentication Type:** `API Token (Personal Access Token) - Recommended for High Concurrency`.
5. Enter your **Base URL** and paste the token into **API Token**.

---

### 🔑 Option 2: Login (Email & Password)
Authenticates directly via the Krayin REST API using administrator credentials:
1. In **Authentication Type**, select: `Login (Email & Password)`.
2. Fill in:
   - **Base URL**: Your Krayin instance URL (e.g. `https://crm.yourdomain.com`).
   - **Email**: Administrator/user email in Krayin CRM.
   - **Password**: User password.
3. The node logs in via API and automatically shares cached Bearer tokens across parallel n8n workers with auto-renewal.

---

## 🛠️ Installation

### In n8n (Community Node)
1. In your n8n instance, go to **Settings** > **Community Nodes**.
2. Click **Install a community node**.
3. In the **npm Package Name** field, enter:
```bash
n8n-nodes-expertsa-4-krayin
```
4. Accept the risk agreement and click **Install**.

### Local Development & Build
```bash
# 1. Install dependencies
npm install

# 2. Build TypeScript and copy assets
npm run build

# 3. Spin up local n8n via Docker
docker-compose up -d
```

---

## 💡 Example Workflow

To accelerate your integration, a **ready-to-import reference workflow** is provided in this repository:

📁 **Example file:** [`examples/Krayin CRM pipeline.json`](./examples/Krayin%20CRM%20pipeline.json)

### What this example workflow demonstrates:
- **Discovery & Normalization:** Retrieves pipelines, stages, and products from Krayin CRM.
- **Contact Verification:** Checks if the contact person exists in CRM and creates it if not.
- **Smart Lead Routing:** Identifies existing open deals for the contact or creates a new lead.
- **Stage Transition with Product Preservation:** Moves the lead through stages (e.g. checkout to approved sale) while retaining existing products and attaching new offers.

> 📥 **How to import in your n8n:**
> 1. Download [`Krayin CRM pipeline.json`](./examples/Krayin%20CRM%20pipeline.json).
> 2. In your n8n workflow canvas, open the top-right menu > **Import from File...**
> 3. Select the file and link your Krayin CRM credentials!

---

## 🚀 Also check out: Expertsa Groups

Managing WhatsApp groups for launches, cohorts, and student communities?

Check out **Expertsa Groups** — an advanced WhatsApp group management and automation platform built for digital operators to scale with peace of mind.

> 📲 Learn more at [expertsa.com.br](https://expertsa.com.br).

---

## ☕ Support the Project

This node is actively maintained to solve real operational bottlenecks. If it saved you development hours or streamlined your automations, consider supporting:

**Pix key:** `expertsa.oficial@gmail.com`

---

## 📄 License

Distributed under the **MIT** License. Built with ❤️ by [Expertsa](https://expertsa.com.br).
