module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'n8n-nodes-base'],
    extends: ['plugin:n8n-nodes-base/community'],
    ignorePatterns: ['dist/**', 'node_modules/**'],
    overrides: [
        {
            files: ['credentials/**/*.ts'],
            extends: ['plugin:n8n-nodes-base/credentials'],
            rules: {
                'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
                'n8n-nodes-base/cred-class-field-type-options-password-missing': 'off',
            },
        },
        {
            files: ['nodes/**/*.ts'],
            extends: ['plugin:n8n-nodes-base/nodes'],
            rules: {
                'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'off',
                'n8n-nodes-base/node-class-description-outputs-wrong': 'off',
                'n8n-nodes-base/node-param-type-options-max-value-present': 'off',
            },
        },
    ],
};
