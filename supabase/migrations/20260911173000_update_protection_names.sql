-- Atualiza os nomes públicos das opções de proteção sem recriar a página.
UPDATE public.site_pages
SET
  title = 'Proteções e tarifas',
  summary = 'Conheça as opções atuais de proteção e as tarifas fixas por pedido.',
  content = E'## Taxa do vendedor\n8% sobre o valor do produto, descontada no saque.\n\n## Opções de proteção do comprador\n- Proteção Básica: R$ 0,10\n- Proteção Média: R$ 0,50\n- Proteção Máxima: R$ 2,00\n\nO valor é fixo por pedido, independentemente do preço do produto. A opção escolhida define a prioridade da mediação e a cobertura informada no checkout.',
  updated_at = now()
WHERE slug = 'taxas';
