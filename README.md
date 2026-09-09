# LynkoMarketplace

Marketplace de produtos digitais com autenticação, catálogo, conversas, pedidos e notificações usando **Supabase** como backend.

## Requisitos

- Node.js 20 ou superior
- Um projeto Supabase

## Configuração

1. Copie `.env.example` para `.env`.
2. Preencha `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` e `SUPABASE_SERVICE_ROLE_KEY` com as credenciais do seu projeto Supabase.
3. Preencha também `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` e `VITE_SITE_URL`.
4. Execute as migrações em `supabase/migrations/` no projeto Supabase, em ordem cronológica. O schema inclui RLS, triggers e funções necessárias para autenticação e domínio.
5. No Supabase, configure os provedores de autenticação e as URLs de redirect para `${VITE_SITE_URL}/auth/callback` quando aplicável.

A chave `SUPABASE_SERVICE_ROLE_KEY` é usada apenas no servidor para operações administrativas. Nunca a publique no frontend nem a comite no repositório.

## Desenvolvimento

```bash
npm install
npm run dev
```

A aplicação fica disponível em `http://localhost:3000`.

## Verificação

```bash
npm run lint
npm run build
```

O cliente browser usa o storage padrão do Supabase para persistir a sessão, e o middleware server-side valida os tokens Bearer diretamente com o Supabase Auth.
