#!/bin/sh
# -e Exit immediately when a command returns a non-zero status.
# -x Print commands before they are executed
set -ex
# Seeding command
psql -U <NOME_USUARIO_DA_ENV> -d <NOME_DB> -a -f  ../scripts/city/cidade.sql &&
psql -U <NOME_USUARIO_DA_ENV> -d <NOME_DB> -a -f  ../scripts/cids/cids_202212242142.sql &&
psql -U <NOME_USUARIO_DA_ENV> -d <NOME_DB> -a -f  ../scripts/group/group__202212251022.sql &&
psql -U <NOME_USUARIO_DA_ENV> -d <NOME_DB> -a -f  ../scripts/routes/routes.sql &&
psql -U <NOME_USUARIO_DA_ENV> -d <NOME_DB> -a -f  ../scripts/vehicles/vehicles_insert.sql