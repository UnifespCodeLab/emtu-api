#!/bin/sh
set -e

# Função de await para o postgres
wait_for_postgres() {
    echo "Aguardando o postgres..."
    retries=0
    max_retries=30

    while ! nc -z postgres 5432; do
        retries=$((retries + 1))
        if [ "$retries" -gt "$max_retries" ]; then
            echo "Timeout aguardando PostgreSQL"
            exit 1
        fi
        echo "Tentativa $retries/$max_retries - PostgreSQL não está pronto..."
        sleep 2
    done
    echo "PostgreSQL iniciado"
}

wait_for_postgres

echo "Gerando cliente Prisma..."
npx prisma generate

echo "Executando migrações..."
npx prisma migrate deploy

# Seed apenas na 1ª inicialização ou quando forçado
SEED_MARKER="${SEED_MARKER_PATH:-/data/.seeded}"
FORCE_SEED="${FORCE_SEED:-false}"

# Verifica se deve executar o seed (primeira vez ou forçado)
if [ ! -f "$SEED_MARKER" ] || [ "$FORCE_SEED" = "true" ]; then
  if [ "$FORCE_SEED" = "true" ]; then
    echo "Executando seed (forçado via FORCE_SEED=true)..."
  else
    echo "Executando seed (primeira inicialização)..."
  fi
  # Garante diretório do marcador (persistente via volume)
  mkdir -p "$(dirname "$SEED_MARKER")"

  # Normaliza CRLF/BOM do seed antes de rodar
  command -v dos2unix >/dev/null 2>&1 && dos2unix prisma/seed.sh >/dev/null 2>&1 || sed -i 's/\r$//' prisma/seed.sh 2>/dev/null || true
  sed -i '1s/^\xEF\xBB\xBF//' prisma/seed.sh 2>/dev/null || true

  # Cria URL libpq (sem ?schema=...) para o psql
  if [ -n "${DATABASE_URL:-}" ]; then
    DB_URL="$(node -e "const u=new URL(process.env.DATABASE_URL); u.searchParams.delete('schema'); console.log(u.toString())")"
  else
    echo "DATABASE_URL não definido" >&2
    exit 1
  fi

  # Passa DB_URL para o seed
  if [ -f "prisma/seed.sh" ]; then
    DB_URL="$DB_URL" sh prisma/seed.sh
  elif [ -f "prisma/seed.sql" ]; then
    psql "$DB_URL" -v ON_ERROR_STOP=1 -f "prisma/seed.sql"
  else
    echo "Nenhum arquivo de seed encontrado (prisma/seed.sh ou prisma/seed.sql). Pulando."
  fi

  # Marca que o seed foi executado
  touch "$SEED_MARKER"
  echo "Seed concluído. Marcador criado em $SEED_MARKER"
else
  echo "Seed já executado anteriormente, pulando. Para rodar novamente, remova $SEED_MARKER ou o volume."
fi

echo "Compilando TypeScript..."
npx tsc

echo "Iniciando aplicação..."
npm start