# LynkoMarketplace

Marketplace de produtos digitais com autenticação, catálogo, conversas, pedidos e notificações usando o projeto Supabase configurado em `https://tocirlbklcrevongolro.supabase.co`.

## Requisitos

- Node.js 20 ou superior
- A CLI do Supabase é executada via `npx` pelos scripts de banco
- Acesso ao projeto Supabase `tocirlbklcrevongolro`

## Configuração

1. Copie `.env.example` para `.env`.
2. Preencha `SUPABASE_SECRET_KEY` apenas no ambiente do servidor. Nunca publique essa chave no frontend nem a versione.
3. As variáveis `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` já apontam para o projeto Supabase deste marketplace.
4. Configure `VITE_SITE_URL` com a URL pública da aplicação.
5. No Supabase, configure os provedores de autenticação e as URLs de redirect para `${VITE_SITE_URL}/auth/callback` quando aplicável.

A aplicação usa a chave publicável no browser e a chave secreta somente em operações server-side administrativas. A separação entre esses dois contextos é obrigatória.

## Imagens

Avatares, banners, imagens de categorias e fotos de produtos são enviados ao bucket público `media` do seu próprio Supabase. A migration `20260909152000_create_public_media_bucket.sql` cria o bucket automaticamente, permite até 50 MB por arquivo, aceita PNG, JPG, WEBP, AVIF, SVG, BMP e TIFF, e bloqueia GIFs. As URLs públicas ficam persistidas no banco e não são removidas pelo aplicativo.

## Migrations

As migrations versionadas estão em `supabase/migrations/` e o projeto está vinculado pelo `supabase/config.toml` ao ref `tocirlbklcrevongolro`.

Para conferir quais migrations seriam aplicadas sem alterar o banco:

```bash
cp .env.example .env
# Preencha SUPABASE_DB_URL ou SUPABASE_DB_PASSWORD no ambiente
npm run db:push:dry-run
```

Para aplicar todas as migrations pendentes, em ordem cronológica:

```bash
npm run db:push
```

Na Vercel, o comando `build` aplica automaticamente as migrations pendentes antes de executar o build da aplicação. Para habilitar esse passo no projeto Vercel, configure `SUPABASE_DB_URL` (preferencial, usando a connection string de pooler do Supabase) ou `SUPABASE_DB_PASSWORD` e `SUPABASE_PROJECT_REF` nas variáveis de ambiente dos ambientes **Production** e **Preview**. Se essas variáveis não estiverem configuradas, o deploy falhará de propósito em vez de publicar o frontend com o banco desatualizado.

O script aceita uma URL PostgreSQL direta em `SUPABASE_DB_URL` ou a senha do banco em `SUPABASE_DB_PASSWORD`. Em CI, configure também `SUPABASE_ACCESS_TOKEN` ou autentique a CLI do Supabase. A chave `SUPABASE_SECRET_KEY` não é uma senha de banco e não permite, sozinha, executar DDL/migrations.

Não aplique alterações estruturais diretamente pelo SQL Editor depois que o fluxo de migrations estiver ativo; crie uma nova migration e execute `npm run db:push`.

## Resend e e-mails de autenticação

O endereço remetente configurado para o domínio Resend é `noreply@naoresponda.lynkomarketplace.online`. Para confirmação de cadastro, recuperação de senha e alteração de e-mail, configure o SMTP personalizado em **Supabase → Authentication → SMTP Settings** com `smtp.resend.com`, usuário `resend`, a API key do Resend como senha e porta `465` ou `587`. A API key deve permanecer somente no painel do Supabase ou em uma variável server-side; nunca deve ser enviada ao browser, ao GitHub ou incluída em um ZIP público.

No Resend, o domínio `naoresponda.lynkomarketplace.online` precisa estar verificado com os registros DNS exibidos no painel do Resend. No modelo `.env.example`, `RESEND_FROM_EMAIL` já está preenchido e `RESEND_API_KEY` permanece vazio propositalmente.

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
