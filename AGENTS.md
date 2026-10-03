# Instruções de manutenção

- Preserve a separação entre código browser e código server-side.
- Nunca exponha `SUPABASE_SECRET_KEY` em código cliente, variáveis `VITE_*` ou arquivos versionados.
- Mantenha as migrações em `supabase/migrations/` em ordem cronológica.
- Use `npm run db:push` para aplicar migrations ao projeto configurado em `supabase/config.toml`.
- Antes de entregar alterações, execute `npm run lint` e `npm run build`.
