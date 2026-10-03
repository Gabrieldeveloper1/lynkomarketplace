
GRANT EXECUTE ON FUNCTION public.is_banned(uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_conversation_member(uuid, uuid) TO authenticated, anon;

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'system',
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete own notifications" ON public.notifications
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS notifications_user_idx ON public.notifications (user_id, created_at DESC);

CREATE TRIGGER notifications_updated_at BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.notify_user(_user_id uuid, _kind text, _title text, _body text, _link text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.notifications (user_id, kind, title, body, link)
  VALUES (_user_id, _kind, _title, _body, _link)
$$;
REVOKE ALL ON FUNCTION public.notify_user(uuid, text, text, text, text) FROM PUBLIC, anon, authenticated;

-- new message -> notify the other participant
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _target uuid; _sender text;
BEGIN
  SELECT CASE WHEN c.buyer_id = NEW.sender_id THEN c.seller_id ELSE c.buyer_id END
    INTO _target FROM public.conversations c WHERE c.id = NEW.conversation_id;
  IF _target IS NULL OR _target = NEW.sender_id THEN RETURN NEW; END IF;
  SELECT COALESCE(NULLIF(display_name,''), username) INTO _sender FROM public.profiles WHERE id = NEW.sender_id;
  PERFORM public.notify_user(_target, 'message', 'Nova mensagem de ' || COALESCE(_sender,'um usuário'),
    left(NEW.body, 120), '/mensagens?c=' || NEW.conversation_id::text);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS notify_new_message_trg ON public.messages;
CREATE TRIGGER notify_new_message_trg AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_message();

-- order status -> notify buyer and seller
CREATE OR REPLACE FUNCTION public.notify_order_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS NOT DISTINCT FROM OLD.status THEN RETURN NEW; END IF;
  PERFORM public.notify_user(NEW.buyer_id, 'order', 'Pedido atualizado',
    'O status do seu pedido agora é: ' || NEW.status, '/pedido/' || NEW.id::text);
  PERFORM public.notify_user(NEW.seller_id, 'order', 'Venda atualizada',
    'O status de uma venda sua agora é: ' || NEW.status, '/pedido/' || NEW.id::text);
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS notify_order_status_trg ON public.orders;
CREATE TRIGGER notify_order_status_trg AFTER INSERT OR UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.notify_order_status();

-- verification result
CREATE OR REPLACE FUNCTION public.notify_verification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS NOT DISTINCT FROM OLD.status THEN RETURN NEW; END IF;
  IF NEW.status = 'approved' THEN
    PERFORM public.notify_user(NEW.user_id, 'verification', 'Verificação aprovada',
      'Seu nível de verificação agora é ' || COALESCE(NEW.level,'básico') || '.', '/verificacao');
  ELSIF NEW.status = 'rejected' THEN
    PERFORM public.notify_user(NEW.user_id, 'verification', 'Verificação recusada',
      COALESCE(NEW.note, 'Revise os dados enviados e tente novamente.'), '/verificacao');
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS notify_verification_trg ON public.verifications;
CREATE TRIGGER notify_verification_trg AFTER UPDATE ON public.verifications
  FOR EACH ROW EXECUTE FUNCTION public.notify_verification();

-- withdrawal result
CREATE OR REPLACE FUNCTION public.notify_withdrawal()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS NOT DISTINCT FROM OLD.status THEN RETURN NEW; END IF;
  PERFORM public.notify_user(NEW.seller_id, 'withdrawal', 'Saque: ' || NEW.status,
    COALESCE(NEW.reason, NEW.note, 'Acompanhe o status na sua carteira.'), '/dashboard');
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS notify_withdrawal_trg ON public.withdrawals;
CREATE TRIGGER notify_withdrawal_trg AFTER INSERT OR UPDATE OF status ON public.withdrawals
  FOR EACH ROW EXECUTE FUNCTION public.notify_withdrawal();

-- appeal / report replies
CREATE OR REPLACE FUNCTION public.notify_appeal()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS NOT DISTINCT FROM OLD.status AND NEW.staff_reply IS NOT DISTINCT FROM OLD.staff_reply THEN
    RETURN NEW;
  END IF;
  PERFORM public.notify_user(NEW.user_id, 'appeal', 'Resposta da equipe sobre sua apelação',
    COALESCE(NEW.staff_reply, 'Status: ' || NEW.status), '/dashboard');
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS notify_appeal_trg ON public.appeals;
CREATE TRIGGER notify_appeal_trg AFTER UPDATE ON public.appeals
  FOR EACH ROW EXECUTE FUNCTION public.notify_appeal();

CREATE OR REPLACE FUNCTION public.notify_report()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS NOT DISTINCT FROM OLD.status THEN RETURN NEW; END IF;
  PERFORM public.notify_user(NEW.reporter_id, 'report', 'Sua denúncia foi atualizada',
    COALESCE(NEW.resolution, 'Status: ' || NEW.status), '/dashboard');
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS notify_report_trg ON public.reports;
CREATE TRIGGER notify_report_trg AFTER UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.notify_report();

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
