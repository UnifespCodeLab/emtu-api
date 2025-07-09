#!/bin/sh

# Aguarda o Postgres iniciar
echo "Aguardando o postgres..."
while ! nc -z postgres 5432; do
  sleep 0.1
done
echo "PostgreSQL iniciado"

# Executa as migrações e o seed
npx prisma migrate deploy
sh prisma/seed.sh

# Inicia a aplicação
npm start
