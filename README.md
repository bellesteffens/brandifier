# 🤖 Assistente de Marketing com IA

Um web app completo para gerar conteúdo personalizado para redes sociais usando Inteligência Artificial. Os usuários preenchem um formulário e recebem sugestões estratégicas de posts e recomendações de marketing digital.

## ✨ Funcionalidades

### 👥 Sistema de Usuários
- **Dois tipos de usuários**: Admin e Cliente
- Autenticação JWT segura
- Usuários de teste pré-configurados

### 📝 Formulário de Marketing (Clientes)
- Nicho de mercado
- Objetivo principal (vender, autoridade, seguidores, educar)
- Público-alvo detalhado
- Frequência de posts (3, 5 ou 7 por semana)
- Tom de voz (profissional, amigável, divertido, inspirador)

### 🤖 Geração de Conteúdo com IA
- **5 sugestões de posts** personalizados incluindo:
  - Título criativo
  - Legenda (até 300 caracteres)
  - Tipo de post (Reel, carrossel, imagem, vídeo)
  - Hashtags relevantes

### 🎯 Recomendações Inteligentes
- Melhores horários para postar
- Tipo de conteúdo mais indicado
- Frequência ideal recomendada
- Melhor CTA (call to action) para o nicho
- Dica estratégica de engajamento

### 👨‍💼 Painel Administrativo
- Dashboard com estatísticas do sistema
- Visualização de todos os formulários
- Gerenciamento de usuários
- Relatórios de atividade

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com Express.js
- **SQLite** para banco de dados
- **JWT** para autenticação
- **OpenAI API** (GPT-3.5-turbo)
- **bcryptjs** para hash de senhas

### Frontend
- **React** com TypeScript
- **Tailwind CSS** para design
- **React Router** para navegação
- **Axios** para chamadas HTTP
- **Context API** para gerenciamento de estado

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- Chave da API OpenAI

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd assistente-marketing-ia
```

### 2. Instale as dependências do backend
```bash
npm install
```

### 3. Instale as dependências do frontend
```bash
cd client
npm install
cd ..
```

### 4. Configure as variáveis de ambiente
Edite o arquivo `.env` na raiz do projeto:
```env
PORT=5000
JWT_SECRET=sua_chave_secreta_super_forte_aqui_123456789
OPENAI_API_KEY=sua_chave_openai_aqui
NODE_ENV=development
```

⚠️ **IMPORTANTE**: Substitua `sua_chave_openai_aqui` pela sua chave real da API OpenAI.

### 5. Execute o projeto

#### Modo desenvolvimento (backend + frontend separados)
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

#### Modo produção
```bash
# Build do frontend
npm run build

# Executar servidor
npm start
```

## 🧪 Contas de Teste

O sistema vem com usuários de teste pré-configurados:

### Admin
- **Email**: admin@teste.com
- **Senha**: admin123
- **Acesso**: Painel administrativo completo

### Cliente
- **Email**: cliente@teste.com
- **Senha**: cliente123
- **Acesso**: Criação de formulários e geração de conteúdo

## 🔄 Fluxo de Uso

### Para Clientes:
1. **Login** com as credenciais de cliente
2. **Preencher formulário** com informações do negócio
3. **Gerar conteúdo** com IA
4. **Visualizar resultados**:
   - 5 posts personalizados
   - Recomendações estratégicas
5. **Editar e salvar** o conteúdo conforme necessário

### Para Admins:
1. **Login** com as credenciais de admin
2. **Dashboard** com estatísticas do sistema
3. **Gerenciar usuários** (visualizar, editar, deletar)
4. **Monitorar formulários** e conteúdos gerados
5. **Acompanhar métricas** de uso do sistema

## 🌟 Principais Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário

### Formulários
- `GET /api/forms/my-forms` - Listar formulários do usuário
- `POST /api/forms` - Criar novo formulário
- `GET /api/forms/:id` - Buscar formulário específico

### IA
- `POST /api/ai/generate/:form_id` - Gerar conteúdo com IA
- `PUT /api/ai/posts/:post_id` - Editar post gerado

### Admin
- `GET /api/users` - Listar todos os usuários
- `GET /api/users/stats/overview` - Estatísticas do sistema

## 🎨 Design e UX

- **Design responsivo** com Tailwind CSS
- **Interface moderna** e intuitiva
- **Animações suaves** e feedback visual
- **Acessibilidade** considerada em todos os componentes
- **Loading states** e tratamento de erros

## 🛡️ Segurança

- **Autenticação JWT** com expiração de 24h
- **Senhas hasheadas** com bcrypt
- **Proteção de rotas** por tipo de usuário
- **Validação de dados** no frontend e backend
- **Rate limiting** (preparado para implementação)

## 📊 Banco de Dados

### Estrutura das tabelas:
- **users**: Usuários do sistema
- **marketing_forms**: Formulários de marketing
- **generated_posts**: Posts gerados pela IA
- **recommendations**: Recomendações personalizadas

## 🚀 Deploy

O projeto está preparado para deploy em plataformas como:
- **Heroku**
- **Vercel** (frontend)
- **Railway**
- **DigitalOcean**

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se encontrar algum problema:

1. Verifique se todas as dependências foram instaladas
2. Confirme se a chave da OpenAI está configurada corretamente
3. Verifique os logs do console para erros
4. Abra uma issue no repositório

---

**Desenvolvido com ❤️ para revolucionar o marketing digital com IA**
