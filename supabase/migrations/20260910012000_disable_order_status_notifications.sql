-- Status de pedido continua visível no pedido e no histórico do pedido,
-- mas não deve ocupar o sino nem gerar notificações automáticas.
DROP TRIGGER IF EXISTS notify_order_status_trg ON public.orders;
DELETE FROM public.notifications WHERE kind = 'order';
