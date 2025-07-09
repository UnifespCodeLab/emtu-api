#!/bin/sh
# -e Exit immediately when a command returns a non-zero status.
# -x Print commands before they are executed
set -ex

# Set password for psql to connect to the database container
export PGPASSWORD=1234

# Seeding command
psql -h postgres -U postgres -d emtu -a -f  ../scripts/city/cidade.sql &&
psql -h postgres -U postgres -d emtu -a -f  ../scripts/cids/cids_202212242142.sql &&
psql -h postgres -U postgres -d emtu -a -f  ../scripts/group/group__202212251022.sql &&
psql -h postgres -U postgres -d emtu -a -f  ../scripts/routes/routes.sql &&
psql -h postgres -U postgres -d emtu -a -f  ../scripts/vehicles/vehicles_insert.sql
