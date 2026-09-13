-- Mensagens notificadas devem abrir a conversa exata.
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _target uuid; _sender text;
BEGIN
  SELECT CASE WHEN c.buyer_id = NEW.sender_id THEN c.seller_id ELSE c.buyer_id END
    INTO _target FROM public.conversations c WHERE c.id = NEW.conversation_id;
  IF _target IS NULL OR _target = NEW.sender_id THEN RETURN NEW; END IF;
  SELECT COALESCE(NULLIF(display_name,''), username)
    INTO _sender FROM public.profiles WHERE id = NEW.sender_id;
  PERFORM public.notify_user(
    _target,
    'message',
    'Nova mensagem de ' || COALESCE(_sender, 'um usuário'),
    left(NEW.body, 120),
    '/mensagens?c=' || NEW.conversation_id::text
  );
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS notify_new_message_trg ON public.messages;
CREATE TRIGGER notify_new_message_trg AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_message();
