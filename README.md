# Brandifier

Sistema de gerenciamento de materiais de marca e identidade visual.

## Funcionalidades

- Autenticação de usuários (Admin e Cliente)
- Dashboard com estatísticas de solicitações
- Formulário de solicitação de materiais
- Guia da marca personalizado
- Upload e gerenciamento de materiais editáveis
- Chat integrado entre cliente e admin

## Tecnologias

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase (Autenticação e Banco de Dados)
- Chart.js
- React Hook Form
- Zod

## Configuração do Projeto

1. Clone o repositório:
```bash
git clone https://seu-repositorio/brandifier.git
cd brandifier
```

2. Instale as dependências:
```bash
npm install
npm install -D tailwindcss postcss autoprefixer
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto e adicione:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Configure o banco de dados Supabase:
- Crie um novo projeto no Supabase
- Execute as seguintes queries SQL para criar as tabelas necessárias:

```sql
-- Tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  company_name TEXT,
  PRIMARY KEY (id)
);

-- Trigger para atualizar o updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

-- Tabela de solicitações de material
CREATE TABLE material_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  material_type TEXT NOT NULL,
  service_value NUMERIC NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  observations TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed'))
);

-- Tabela de guia da marca
CREATE TABLE brand_guides (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  fonts TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  logo_url TEXT,
  additional_files TEXT[] DEFAULT '{}'
);

-- Tabela de mensagens do chat
CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL
);

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para perfis
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis"
  ON profiles FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Políticas para solicitações
CREATE POLICY "Usuários podem ver suas próprias solicitações"
  ON material_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas as solicitações"
  ON material_requests FOR ALL
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY "Usuários podem criar solicitações"
  ON material_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Políticas para guia da marca
CREATE POLICY "Usuários podem gerenciar seu guia da marca"
  ON brand_guides FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os guias"
  ON brand_guides FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Políticas para chat
CREATE POLICY "Usuários podem ver suas próprias mensagens"
  ON chat_messages FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = admin_id);

CREATE POLICY "Usuários podem enviar mensagens"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() = admin_id);
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
brandifier/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── requests/
│   │   ├── brand-guide/
│   │   ├── materials/
│   │   └── chat/
│   ├── components/
│   │   ├── layout/
│   │   ├── auth/
│   │   └── ui/
│   ├── lib/
│   │   └── supabase.ts
│   └── types/
│       └── supabase.ts
├── public/
└── package.json
```

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.
