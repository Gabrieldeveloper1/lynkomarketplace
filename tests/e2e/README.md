# Testes ponta a ponta

Testes de navegador (Playwright) que percorrem os fluxos críticos do site com uma
conta real, para evitar regressões.

Como rodar (com o site local no ar em `http://localhost:8080`):

```bash
python3 tests/e2e/run_all.py
```

Cobertura:

- `chat_test.py` — abre o perfil de um vendedor, clica em "Mensagem", envia uma
  mensagem e confirma que ela aparece na conversa.
- `checkout_test.py` — abre o checkout de um produto, preenche os dados e gera o
  código Pix, confirmando que o pedido é criado.

Variáveis opcionais:

- `E2E_BASE_URL` (padrão `http://localhost:8080`)
- `E2E_SELLER` — username do vendedor usado no teste de chat
- `E2E_PRODUCT` — slug do produto usado no checkout
- `E2E_VARIANT` — id da variação (opcional)

A sessão autenticada é lida das variáveis `LOVABLE_BROWSER_SUPABASE_*` quando
existirem.
