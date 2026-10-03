ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 1;
ALTER TABLE public.orders ADD CONSTRAINT orders_quantity_positive CHECK (quantity >= 1 AND quantity <= 20);