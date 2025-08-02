# 🔑 Configuração da API OpenAI

## Como obter sua chave da API OpenAI

### 1. Criar conta na OpenAI
1. Acesse: https://platform.openai.com/
2. Clique em "Sign up" para criar uma conta
3. Confirme seu email e complete o cadastro

### 2. Gerar chave da API
1. Faça login em https://platform.openai.com/
2. Acesse "API Keys" no menu lateral
3. Clique em "Create new secret key"
4. Dê um nome para a chave (ex: "Assistente Marketing")
5. Copie a chave gerada (ela será mostrada apenas uma vez!)

### 3. Configurar no projeto
Edite o arquivo `.env` na raiz do projeto:
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **IMPORTANTE**: 
- Substitua `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` pela sua chave real
- Nunca compartilhe sua chave da API
- Mantenha o arquivo `.env` no `.gitignore`

## Custos da API

### Modelo usado: GPT-3.5-turbo
- **Custo**: ~$0.002 por 1K tokens
- **Estimativa por geração**: $0.005 - $0.01 (muito baixo)
- **Tokens por requisição**: ~1000-1500 tokens

### Exemplo de uso mensal:
- 100 gerações de conteúdo = ~$1.00
- 500 gerações de conteúdo = ~$5.00
- 1000 gerações de conteúdo = ~$10.00

## Limites da API

### Conta gratuita (Trial):
- $5.00 em créditos gratuitos
- Expira em 3 meses
- Suficiente para ~500-1000 gerações

### Conta paga:
- Limites muito maiores
- Pay-as-you-use (paga conforme usa)
- Sem expiração dos créditos

## Verificar se está funcionando

1. Inicie o servidor: `npm start`
2. Faça login como cliente (cliente@teste.com / cliente123)
3. Crie um formulário
4. Clique em "Gerar Conteúdo"
5. Se aparecer conteúdo personalizado, está funcionando!

## Troubleshooting

### Erro: "invalid_api_key"
- Verifique se a chave está correta no arquivo `.env`
- Confirme que copiou a chave completa
- Reinicie o servidor após alterar o `.env`

### Erro: "insufficient_quota"
- Seus créditos gratuitos acabaram
- Adicione um método de pagamento na conta OpenAI
- Ou aguarde reset mensal dos limites

### Erro: "rate_limit_exceeded"
- Muitas requisições em pouco tempo
- Aguarde alguns segundos e tente novamente
- Implemente delays entre requisições se necessário

## Alternativas para testes

Se não quiser usar a API OpenAI imediatamente, você pode:

1. **Usar dados mockados**: Edite `routes/ai.js` para retornar dados estáticos
2. **Usar outro modelo**: Substitua por Anthropic Claude, Google Bard, etc.
3. **Implementar gradualmente**: Comece com funcionalidades básicas

## Monitoramento de uso

- Acesse https://platform.openai.com/usage
- Monitore seus gastos em tempo real
- Configure alertas de limite de gastos
- Revise uso mensalmente

---

**Lembre-se**: A OpenAI API é paga, mas muito acessível para projetos pequenos e médios!