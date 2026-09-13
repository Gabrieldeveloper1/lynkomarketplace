#!/usr/bin/env bash
set -Eeuo pipefail

# Load local values when present; CI supplies the same variables through secrets.
if [[ -f ".env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source ".env"
  set +a
fi

readonly SUPABASE_CLI_VERSION="2.117.0"
readonly DEFAULT_PROJECT_REF="tocirlbklcrevongolro"
readonly PROJECT_REF="${SUPABASE_PROJECT_REF:-$DEFAULT_PROJECT_REF}"
export CI=1

if [[ -n "${SUPABASE_DB_URL:-}" ]]; then
  exec npx --yes "supabase@${SUPABASE_CLI_VERSION}" db push \
    --db-url "$SUPABASE_DB_URL" \
    --include-all \
    --yes \
    "$@"
fi

if [[ -z "${SUPABASE_DB_PASSWORD:-}" ]]; then
  cat >&2 <<'EOF'
Não foi possível aplicar as migrations automaticamente.
Defina SUPABASE_DB_URL (URL PostgreSQL direta) ou SUPABASE_DB_PASSWORD
(senha do banco no Supabase Dashboard) antes de executar este comando.
A SUPABASE_SECRET_KEY é uma chave da API e não substitui a senha do Postgres.
EOF
  exit 1
fi

exec npx --yes "supabase@${SUPABASE_CLI_VERSION}" db push \
  --project-ref "$PROJECT_REF" \
  --password "$SUPABASE_DB_PASSWORD" \
  --include-all \
  --yes \
  "$@"
