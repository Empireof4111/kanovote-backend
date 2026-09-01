#!/bin/sh
set -e

echo "[entrypoint] checking for required CLI binaries in node_modules/.bin..."
MISSING=0
for BIN in nest ts-node typeorm-ts-node-commonjs; do
  if [ ! -f "node_modules/.bin/$BIN" ]; then
    echo "[entrypoint] missing binary: $BIN"
    MISSING=1
  fi
done

if [ "${MISSING}" -ne 0 ]; then
  echo "[entrypoint] one or more required CLI binaries missing — installing dependencies"
  npm install --legacy-peer-deps
else
  echo "[entrypoint] all required binaries present"
fi

exec "$@"
