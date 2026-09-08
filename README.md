<div align="center">
  <img src="./Exsa-azul.png" alt="Expertsa" width="280"/>
  <h1>n8n-nodes-expertsa-4-krayin</h1>
  <p><strong>Integração Completa e Inteligente com o Krayin CRM para n8n</strong></p>
</div>

Desenvolvido a partir das dores e necessidades reais de quem gerencia operações digitais no dia a dia. Totalmente preparado para o Krayin CRM.

---

## 🚀 Por que este node é diferente?

Aqui você encontra coisas que fazem parte do meu dia a dia de infoprodutor e sei que pode servir para outros. A maioria das integrações são básicas, mas este node foi construído com problemas e necessidades do mundo real em mente:

- 🛡️ **Preservação Inteligente de Produtos no Lead**: No Krayin CRM padrão, qualquer atualização no lead via API apaga todos os produtos já vinculados se você não reenviar o catálogo completo. Nosso node resolve isso automaticamente: quando você apenas move o lead de estágio (ex: de checkout abandonado para compra aprovada), ele consulta os produtos existentes e os preserva 100% intactos — sem você precisar de nenhum código manual ou expressões de `flatMap`, `reduce` e `JSON.stringify`.
- ➕ **Mesclagem e Adição de Ofertas sem Atrito**: Precisa adicionar uma nova oferta ou upsell a um lead existente? Basta adicionar o produto informando o ID e a quantidade. O nó anexa a nova oferta mantendo os produtos anteriores e recalculando automaticamente o valor total da oportunidade.
- 🎯 **Vínculo Simplificado de Produtos**: Chega de ter que montar estruturas aninhadas com nomes e preços decimais manuais (`224.0000`). Você informa apenas o **ID do Produto** e a **Quantidade** — o node busca e preenche o nome e o preço oficial cadastrados diretamente no catálogo do CRM.
- 🔍 **Busca Inteligente por SKU ou Código de Oferta**: Se você recebe códigos alfanuméricos de plataformas de vendas (Hotmart, Eduzz, Kiwify, etc.), o nó localiza o produto por ID numérico, SKU exato ou busca em catálogo, sem quebrar sua automação com erros 404.
- 🧩 **Atributos Extras e Customizados Genéricos**: Adicione livremente qualquer campo customizado do seu CRM (ex: `hotmart_status`, `hotmart_transaction_id`, `utm_source`, `cupom`) de forma estruturada pela interface ou via JSON, sem ficar preso a regras engessadas.
- 🔄 **Consulta Direta de Estágios e Funis**: Busque e filtre estágios por nome ou código para direcionar leads de forma dinâmica entre funis e etapas de venda.
- 🔑 **Dupla Modalidade de Autenticação**: Suporte nativo tanto para **API Token (Laravel Sanctum)** quanto para **Login direto (E-mail e Senha)** com renovação automática de token em cache na memória.

---

## 📚 Manual de Uso & Recursos

O nó oferece suporte a todas as entidades principais do Krayin CRM:

### 1. 💼 Leads & Oportunidades
- **Criar Lead (`create`)**:
  - Título, valor da oportunidade, contato vinculado (`person_id`), funil e estágio inicial.
  - **Produtos do Lead**: Adicione um ou múltiplos produtos informando apenas `ID do Produto` e `Quantidade`. Se o valor do lead for deixado zerado, ele calcula automaticamente pela soma dos produtos.
  - **Atributos Extras**: Adicione campos customizados através de pares `Código` e `Valor`.
- **Obter Lead (`get`)**: Consulta todos os detalhes do lead pelo ID, incluindo produtos vinculados e contatos.
- **Listar Leads (`getAll`)**: Suporta filtros por funil (`pipeline_id`), estágio (`stage_id`) ou vendedor (`user_id`), com paginação automática.
- **Atualizar Lead (`update`)**:
  - **Mudar apenas de Estágio**: Altere o campo `ID da Fase (Stage)` — todos os produtos existentes são preservados sem esforço.
  - **Modo de Atualização de Produtos**: Escolha entre `Preservar Existentes e Mesclar Novos (Padrão)`, `Substituir Todos` ou `Remover Todos`.
  - **Status da Negociação**: Altere entre *Aberto*, *Ganho (Won)* ou *Perdido (Lost)*.
- **Excluir Lead (`delete`)**: Remove a oportunidade do CRM.

### 2. 📦 Produtos & Serviços
- **Obter um Produto (`get`)**:
  - Aceita **ID numérico** (ex: `12`) ou **código alfanumérico / SKU** (ex: `9t67pevq`).
  - Retorno limpo e padronizado diretamente no primeiro nível do JSON para fácil mapeamento (`$json.id`, `$json.price`, `$json.name`).
- **Listar Produtos (`getAll`)**: Filtre produtos por SKU ou nome com paginação automática.
- **Criar Produto (`create`)**: Cadastre novos itens com nome, SKU, preço e descrição.
- **Atualizar & Excluir Produtos**: Mantenha seu catálogo sempre sincronizado.

### 3. 👤 Contatos (Pessoas)
- **Criar Contato (`create`)**: Cadastre novas pessoas com e-mails, telefones, cargo e vínculo à empresa.
- **Obter Contato (`get`)**: Obtenha dados de contato por ID.
- **Listar Contatos (`getAll`)**: Filtre por nome ou liste todos os contatos.
- **Atualizar & Excluir Contatos**.

### 4. 🏢 Empresas (Organizações)
- **Criar Organização (`create`)**: Cadastre empresas/clientes PJ com endereço completo.
- **Obter & Listar Organizações**: Consulte empresas vinculadas aos seus contatos e oportunidades.
- **Atualizar & Excluir Organizações**.

### 5. 📅 Atividades & Compromissos
- **Criar Atividade (`create`)**: Agende tarefas (*Ligação, Reunião, Almoço, Anotação*) com data de início e fim, associadas ao lead.
- **Listar Atividades (`getAll`)**: Acompanhe o histórico de atividades pendentes ou concluídas.
- **Atualizar Atividade (`update`)**: Marque como concluída (`is_done`) ou edite notas.
- **Excluir Atividade (`delete`)**.

### 6. 📊 Funis de Vendas & Estágios (Pipelines & Stages)
- **Funil (`pipeline`)**: Liste todos os funis de vendas cadastrados no CRM.
- **Estágio (`stage`)**: Consulte estágios com filtros por `ID do Funil`, `Nome do Estágio` ou `Código do Estágio` (ex: `won`, `lost`).

---

## 🔐 Configuração de Credenciais

No n8n, acesse **Credentials > Add Credential** e procure por **Krayin CRM API**.

Você pode autenticar de duas maneiras:

### Opção A: API Token (Recomendado para produção)
1. No seu Krayin CRM, gere um Bearer Token em **Settings > Users > API Tokens** (Laravel Sanctum).
2. Na credencial do n8n:
   - **Tipo de Autenticação**: `API Token (Bearer / Laravel Sanctum)`
   - **URL Base**: Ex: `https://crm.suaempresa.com.br`
   - **API Token**: Cole o token gerado.

### Opção B: Login e Senha (E-mail + Senha)
1. Na credencial do n8n:
   - **Tipo de Autenticação**: `Login (E-mail e Senha)`
   - **URL Base**: Ex: `https://crm.suaempresa.com.br`
   - **E-mail**: Seu e-mail de administrador/usuário do Krayin.
   - **Senha**: Sua senha de acesso.
   - O nó gerencia o token em memória com renovação automática quando expirar.

---

## 🛠️ Instalação

### Instalação no n8n (Community Node)
1. No seu n8n, vá em **Settings** > **Community Nodes**.
2. Clique em **Install a community node**.
3. No campo **npm Package Name**, digite:
```bash
n8n-nodes-expertsa-4-krayin
```
4. Aceite os termos de risco e clique em **Install**.

### Build Local e Desenvolvimento
```bash
# 1. Clonar o repositório e instalar dependências
npm install

# 2. Compilar TypeScript e ativos
npm run build

# 3. Subir o ambiente local do n8n via Docker
docker-compose up -d
```

---

## 🚀 Conheça também: Expertsa Groups

Você gerencia grupos de WhatsApp para seus lançamentos, turmas e comunidades de alunos?

Conheça o **Expertsa Groups** — o sistema definitivo de gerenciamento e automação de grupos de WhatsApp, desenvolvido de expert para expert para escalar a sua operação de infoprodutos com tranquilidade e controle total.

> 📲 Quer saber mais e otimizar a gestão dos seus grupos? Acesse [expertsa.com.br](https://expertsa.com.br).

---

## ☕ Apoie o Projeto

Este node é mantido com dedicação por quem vive os desafios reais de grandes operações digitais. Se ele economizou horas do seu trabalho ou permitiu que você ganhasse dinheiro automatizando processos, considere apoiar:

**Chave Pix:** `expertsa.oficial@gmail.com`

Qualquer valor ajuda a manter as atualizações constantes e a paridade com a API oficial da Hotmart! 💜

---

## 📄 Licença

Distribuído sob a licença **MIT**. Desenvolvido com ❤️ pela [Expertsa](https://expertsa.com.br).
