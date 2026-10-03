-- CATEGORIES: image support
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS display_mode text NOT NULL DEFAULT 'icon';

-- PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price_cents bigint NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  position integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_variants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_variants TO authenticated;
GRANT ALL ON public.product_variants TO service_role;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "variants public read" ON public.product_variants FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.status = 'active'));
CREATE POLICY "owner manages variants" ON public.product_variants FOR ALL TO authenticated
  USING (seller_id = auth.uid() OR public.is_staff(auth.uid()))
  WITH CHECK (seller_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE INDEX IF NOT EXISTS product_variants_product_idx ON public.product_variants(product_id);

CREATE TRIGGER product_variants_set_updated_at BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- DELIVERY ITEMS can belong to a variant
ALTER TABLE public.delivery_items
  ADD COLUMN IF NOT EXISTS variant_id uuid REFERENCES public.product_variants(id) ON DELETE CASCADE;

-- ORDERS: variant + base price for receipts
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS variant_name text,
  ADD COLUMN IF NOT EXISTS base_price_cents bigint NOT NULL DEFAULT 0;

-- ORDER EVENTS (tracking timeline)
CREATE TABLE IF NOT EXISTS public.order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  label text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.order_events TO authenticated;
GRANT ALL ON public.order_events TO service_role;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parties read order events" ON public.order_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id
    AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid() OR public.is_staff(auth.uid()))));

CREATE INDEX IF NOT EXISTS order_events_order_idx ON public.order_events(order_id, created_at);

CREATE OR REPLACE FUNCTION public.log_order_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.order_events (order_id, status, label) VALUES (NEW.id, NEW.status, 'Pedido criado');
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_events (order_id, status, label) VALUES (NEW.id, NEW.status, 'Estado atualizado');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER orders_log_status AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.log_order_status();

-- SITE PAGES (terms / policies, admin editable)
CREATE TABLE IF NOT EXISTS public.site_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_pages TO authenticated;
GRANT ALL ON public.site_pages TO service_role;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site pages public read" ON public.site_pages FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admins manage site pages" ON public.site_pages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_pages_set_updated_at BEFORE UPDATE ON public.site_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_pages (slug, title, summary, content, position) VALUES
('termos', 'Termos de Uso', 'Regras de utilização da LynkoMarketplace.', E'## 1. Aceitação\nAo utilizar a LynkoMarketplace concorda com estes termos.\n\n## 2. Contas\nCada utilizador é responsável pela segurança da sua conta e pelos anúncios que publica.\n\n## 3. Anúncios\nÉ proibido publicar produtos ilegais, roubados ou que violem direitos de terceiros.\n\n## 4. Pagamentos\nOs pagamentos são processados via Efí Bank e ficam em custódia até à confirmação da entrega.\n\n## 5. Taxas\nA plataforma cobra 8% ao vendedor e uma taxa de proteção ao comprador, escolhida no checkout.', 1),
('privacidade', 'Política de Privacidade', 'Como tratamos os seus dados pessoais.', E'## Dados recolhidos\nRecolhemos email, nome de utilizador e dados de verificação de identidade quando submetidos.\n\n## Utilização\nOs dados são usados para operar a plataforma, prevenir fraude e cumprir obrigações legais.\n\n## Partilha\nNão vendemos dados. Partilhamos apenas com processadores de pagamento e autoridades quando exigido.\n\n## Direitos\nPode pedir acesso, correção ou eliminação dos seus dados através do suporte.', 2),
('reembolsos', 'Política de Reembolsos', 'Quando e como pode ser reembolsado.', E'## Cobertura\nO reembolso depende do nível de proteção escolhido no checkout.\n\n## Prazos\nDisputas devem ser abertas em até 24h após a entrega.\n\n## Processo\nA equipa Lynko analisa as provas de ambas as partes e decide em até 72h.', 3),
('taxas', 'Taxas e Proteção', 'Detalhe completo das taxas cobradas.', E'## Taxa do vendedor\n8% sobre o valor do produto, descontada no saque.\n\n## Taxa de proteção do comprador\n- Básica: R$ 0,10\n- Média: R$ 0,50\n- Máxima: R$ 2,00\n\nO valor é fixo, independentemente do preço do produto.', 4)
ON CONFLICT (slug) DO NOTHING;