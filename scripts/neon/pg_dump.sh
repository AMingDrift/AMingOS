
BIN_NEON_PATH=$(dirname $(readlink -f $0))

DB_NAME="amingos"

docker exec -t blissful_sammet pg_dump -U postgres \
  -d "$DB_NAME" \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  -f /tmp/neon_backup_clean.sql

# 拷贝出来
docker cp blissful_sammet:/tmp/neon_backup_clean.sql $BIN_NEON_PATH