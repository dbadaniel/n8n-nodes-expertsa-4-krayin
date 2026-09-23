# Diretrizes de Commit e Publicação do Projeto

Sempre que o usuário solicitar para **comitar**, **subir para o git**, **fazer commit** ou **replicar/publicar alteração**:

1. **Validação prévia**:
   - Rodar `npm run lint` e garantir que passe com 0 erros.
   - Rodar `npm run build` para compilar o TypeScript e gerar os ícones no diretório `dist/`.

2. **Versionamento**:
   - Garantir que a versão no `package.json` esteja incrementada adequadamente (ex: de `1.0.10` para `1.0.11`).

3. **Commit e Tag**:
   - Adicionar os arquivos modificados: `git add <arquivos>`
   - Fazer o commit com mensagem descritiva no padrão conventional commits indicando a versão:
     ```bash
     git commit -m "feat/fix: <descrição da mudança> (vX.Y.Z)"
     ```
   - Criar a tag Git correspondente:
     ```bash
     git tag vX.Y.Z
     ```

4. **Publicação com Provenance**:
   - Enviar a branch e as tags para o repositório remoto:
     ```bash
     git push origin master --tags
     ```
   - **IMPORTANTE:** O envio da tag `v*` dispara automaticamente o fluxo do GitHub Actions (`.github/workflows/publish.yml`), que realiza o build e a publicação do pacote no npm com atestado oficial de **Provenance** (`--provenance`).
   - Monitorar a execução do GitHub Actions (`gh run list --limit 1`) para confirmar a publicação com sucesso.
