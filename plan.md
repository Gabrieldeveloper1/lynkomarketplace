# Redesign LynkoMarketplace

## Direção visual

- **Movimento:** dark premium / neo-brutalism refinado com camadas de glassmorphism discreto e detalhes de interface de produto SaaS.
- **Princípios:** hierarquia editorial forte, contraste roxo/preto/branco, superfícies modulares com bordas luminosas e microinterações rápidas.
- **Filosofia de cor:** preto quase absoluto para criar foco e sensação de confiança; branco suave para leitura; roxo elétrico como cor proprietária para ação, estado e reconhecimento da marca.
- **Layout:** composição assimétrica com trilhas horizontais, grids técnicos e painéis laterais; evitar blocos genéricos centralizados.
- **Elementos assinatura:** glow roxo controlado, grid pontilhado/técnico e marca Lynko em monograma `L/`.
- **Interação:** ações primárias sempre têm feedback visual evidente; filtros e navegação usam chips, estados ativos e transições curtas.
- **Animação:** entrada vertical suave de 180–260ms, hover com elevação mínima, brilho lento apenas em elementos hero; respeitar `prefers-reduced-motion`.
- **Tipografia:** Inter em todo o produto; títulos com peso 700/800, métricas com 800/900 e labels em 10–12px com tracking aumentado.
- **Essência:** marketplace de produtos digitais para comprar e vender com velocidade, proteção e reputação verificável. Personalidade: confiável, ousada, direta.
- **Voz:** CTAs claros e confiantes. Exemplos: “Encontre o que acelera seu próximo passo.” / “Publique hoje. Venda no automático.”
- **Wordmark:** `lynko/market` em lowercase, acompanhado do monograma angular `L/` em um quadrado roxo.
- **Cor de marca:** `#8B5CF6` (violet electric).

## Implementação

- Substituir o sistema global de tokens e utilitários em `src/styles.css`.
- Recriar header e footer como superfícies de navegação premium, mantendo links, busca, tema, autenticação e páginas legais.
- Recriar a landing page com hero editorial, categorias, ofertas, confiança e CTA para vender.
- Recriar login/registro em dois painéis com benefícios e formulário funcional via Supabase.
- Atualizar listagem de produtos, ofertas e cartão de produto para a nova composição.
- Envelopar dashboard e mensageria existentes com a nova linguagem global sem remover integrações, queries ou fluxos.
- Manter rota dinâmica do produto e do vendedor compatíveis com dados atuais, aplicando superfícies, bordas e estados por tokens globais.
- Criar `public/manus-routes.json` com o mapa completo das páginas existentes.

## Estrutura principal

- `src/styles.css`: design system, tokens, efeitos e responsividade.
- `src/components/site-header.tsx`: navegação global, busca e menus de conta.
- `src/components/site-footer.tsx`: rodapé institucional e trust layer.
- `src/components/product-card.tsx`: unidade de produto no marketplace.
- `src/routes/index.tsx`: landing page.
- `src/routes/auth.tsx`: login, cadastro e recuperação.
- `src/routes/produtos.tsx` e `src/routes/ofertas.tsx`: descoberta e campanhas.
- `src/routes/_authenticated/dashboard.tsx`: painel operacional preservando integrações.
- `src/routes/_authenticated/mensagens.tsx`: inbox e chat preservando tempo real.
