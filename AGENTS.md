# Instruções de manutenção

- Preserve a separação entre código browser e código server-side.
- Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` em código cliente, variáveis `VITE_*` ou arquivos versionados.
- Mantenha as migrações em `supabase/migrations/` em ordem cronológica.
- Antes de entregar alterações, execute `npm run lint` e `npm run build`.
