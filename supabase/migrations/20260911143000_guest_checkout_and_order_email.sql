-- Compras de visitantes: o e-mail identifica o comprador e recebe a entrega.
ALTER TABLE public.orders
  ALTER COLUMN buyer_id DROP NOT NULL;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS buyer_email text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'orders_buyer_email_format'
      AND conrelid = 'public.orders'::regclass
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_buyer_email_format CHECK (
        buyer_email IS NULL OR buyer_email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
      );
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS orders_buyer_email_idx ON public.orders (lower(buyer_email));
