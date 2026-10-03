-- Repoint user-referencing FKs to public.profiles so PostgREST can embed seller/buyer data
ALTER TABLE public.products DROP CONSTRAINT products_seller_id_fkey;
ALTER TABLE public.products ADD CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.delivery_items DROP CONSTRAINT delivery_items_seller_id_fkey;
ALTER TABLE public.delivery_items ADD CONSTRAINT delivery_items_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.orders DROP CONSTRAINT orders_buyer_id_fkey;
ALTER TABLE public.orders ADD CONSTRAINT orders_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.orders DROP CONSTRAINT orders_seller_id_fkey;
ALTER TABLE public.orders ADD CONSTRAINT orders_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.conversations DROP CONSTRAINT conversations_buyer_id_fkey;
ALTER TABLE public.conversations ADD CONSTRAINT conversations_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.conversations DROP CONSTRAINT conversations_seller_id_fkey;
ALTER TABLE public.conversations ADD CONSTRAINT conversations_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.messages DROP CONSTRAINT messages_sender_id_fkey;
ALTER TABLE public.messages ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.reports DROP CONSTRAINT reports_reporter_id_fkey;
ALTER TABLE public.reports ADD CONSTRAINT reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.reviews DROP CONSTRAINT reviews_seller_id_fkey;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.reviews DROP CONSTRAINT reviews_buyer_id_fkey;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.follows DROP CONSTRAINT follows_follower_id_fkey;
ALTER TABLE public.follows ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.follows DROP CONSTRAINT follows_seller_id_fkey;
ALTER TABLE public.follows ADD CONSTRAINT follows_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.withdrawals DROP CONSTRAINT withdrawals_seller_id_fkey;
ALTER TABLE public.withdrawals ADD CONSTRAINT withdrawals_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.verifications DROP CONSTRAINT verifications_user_id_fkey;
ALTER TABLE public.verifications ADD CONSTRAINT verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;