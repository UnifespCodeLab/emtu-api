#!/usr/bin/env sh
set -e

# Normaliza CRLF/BOM (idempotente)
command -v dos2unix >/dev/null 2>&1 && dos2unix "$0" >/dev/null 2>&1 || true
sed -i '1s/^\xEF\xBB\xBF//' "$0" 2>/dev/null || true

# Preferir DB_URL passada pelo entrypoint; fallback para DATABASE_URL (sem ?schema)
if [ -n "${DB_URL:-}" ]; then
  URL="$DB_URL"
elif [ -n "${DATABASE_URL:-}" ]; then
  URL="$(node -e "const u=new URL(process.env.DATABASE_URL); u.searchParams.delete('schema'); console.log(u.toString())")"
else
  echo "DATABASE_URL/DB_URL não definido" >&2
  exit 1
fi

# Caminhos absolutos dos arquivos de seed (a partir da raiz do emtu-api)
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
ROOT_DIR="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"

FILES="
$ROOT_DIR/scripts/city/cidade.sql
$ROOT_DIR/scripts/cids/cids_202212242142.sql
$ROOT_DIR/scripts/group/group__202212251022.sql
$ROOT_DIR/scripts/routes/routes.sql
$ROOT_DIR/scripts/vehicles/vehicles_insert.sql
"

for f in $FILES; do
  if [ -f "$f" ]; then
    echo "→ Aplicando seed: $(basename "$f")"
    psql "$URL" -v ON_ERROR_STOP=1 -a -f "$f"
  else
    echo "Arquivo não encontrado, pulando: $f"
  fi
done

echo "Seed concluído."