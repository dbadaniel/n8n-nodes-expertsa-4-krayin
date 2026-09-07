# n8n-nodes-expertsa-4-krayin

Pacote comunitário do **n8n** desenvolvido pela **Expertsa** para integração completa com o **Krayin CRM** via REST API (Laravel Sanctum).

---

## 🚀 Funcionalidades

Este nó permite automatizar operações no Krayin CRM diretamente em fluxos do n8n:

### 1. 💼 Leads & Oportunidades
- **Criar Lead**: Cadastre novas oportunidades no funil com valor monetário, contato vinculado, fase do funil e vendedor responsável.
- **Obter Lead**: Busque dados completos de um lead pelo ID.
- **Listar Leads**: Liste oportunidades com paginação automática e filtros por funil, fase ou vendedor.
- **Atualizar Lead**: Altere títulos, valores, mova entre fases do pipeline ou atualize o status para *Ganho (Won)* ou *Perdido (Lost)*.
- **Excluir Lead**: Remova leads do CRM.

### 2. 👤 Contatos (Persons)
- **Criar Contato**: Cadastre novas pessoas com e-mails, telefones, vínculo à empresa e cargo.
- **Obter Contato**: Obtenha dados de contato por ID.
- **Listar Contatos**: Consulte a base de contatos com suporte a paginação.
- **Atualizar Contato**: Atualize dados de contato cadastrados.
- **Excluir Contato**: Exclua contatos obsoletos.

### 3. 🏢 Empresas (Organizations)
- **Criar Organização**: Cadastre empresas/clientes PJ com endereço completo.
- **Obter & Listar Organizações**: Consulte empresas vinculadas aos seus contatos e oportunidades.
- **Atualizar & Excluir Organizações**.

### 4. 📅 Atividades & Tarefas
- **Criar Atividade**: Agende compromissos (*Ligação, Reunião, Almoço, Anotação*) com data de início e fim, vinculados a um lead.
- **Listar Atividades**: Acompanhe o histórico de atividades pendentes e concluídas.
- **Atualizar Atividade**: Marque como concluída (`is_done`) ou edite detalhes.
- **Excluir Atividade**.

### 5. 📦 Produtos & Serviços
- **Criar, Obter, Listar, Atualizar e Excluir Produtos**: Gerencie o catálogo de produtos e serviços cadastrados no CRM.

### 6. 📊 Funis de Vendas (Pipelines)
- **Listar e Consultar Funis**: Obtenha os IDs de funis e suas fases para uso dinâmico em fluxos.

---

## 🔐 Configuração de Credenciais

1. No n8n, crie uma nova credencial do tipo **Krayin CRM API**.
2. Preencha:
   - **URL Base da Instância**: A URL da sua instalação do Krayin (ex: `https://crm.suaempresa.com.br`).
   - **API Token (Laravel Sanctum)**: O Bearer Token de API gerado no Krayin CRM.
3. Clique em **Test Connection** para validar a autenticação.

---

## 🛠️ Instalação e Desenvolvimento

### Para Usuários (Instalação no n8n)
No n8n, vá em **Settings > Community Nodes > Install** e digite:
```bash
n8n-nodes-expertsa-4-krayin
```

### Para Desenvolvedores (Build Local)
```bash
# Instalar dependências
npm install

# Compilar TypeScript e copiar ícones
npm run build

# Iniciar o ambiente de testes n8n local
docker-compose up -d
```

---

## 📄 Licença

Distribuído sob a licença **MIT**. Desenvolvido com ❤️ pela **Expertsa**.
