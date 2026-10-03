INSERT INTO public.categories (slug, name, icon, position)
VALUES ('assinaturas', 'Assinaturas', 'repeat', 9)
ON CONFLICT (slug) DO NOTHING;
