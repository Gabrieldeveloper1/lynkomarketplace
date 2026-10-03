DROP POLICY "update own profile" ON public.profiles;
CREATE POLICY "update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_staff(auth.uid()))
  WITH CHECK (id = auth.uid() OR public.is_staff(auth.uid()));

DROP POLICY "owner updates products" ON public.products;
CREATE POLICY "owner updates products" ON public.products FOR UPDATE TO authenticated
  USING (seller_id = auth.uid() OR public.is_staff(auth.uid()))
  WITH CHECK (seller_id = auth.uid() OR public.is_staff(auth.uid()));

DROP POLICY "participants update conversation" ON public.conversations;
CREATE POLICY "participants update conversation" ON public.conversations FOR UPDATE TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid() OR seller_id = auth.uid());

DROP POLICY "staff moderate messages" ON public.messages;
CREATE POLICY "staff moderate messages" ON public.messages FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY "staff update reports" ON public.reports;
CREATE POLICY "staff update reports" ON public.reports FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY "own or staff update verification" ON public.verifications;
CREATE POLICY "own or staff update verification" ON public.verifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_staff(auth.uid()))
  WITH CHECK (user_id = auth.uid() OR public.is_staff(auth.uid()));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_conversation_member(uuid, uuid) FROM anon;