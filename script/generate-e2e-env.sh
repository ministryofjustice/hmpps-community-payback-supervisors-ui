#!/usr/bin/env bash

set -e
# shellcheck disable=SC3040
set -o pipefail

cd "$(dirname "$0")"
SCRIPT_DIR="$(pwd)"
# shellcheck source=script/utils/resolve_secrets.sh
. "$SCRIPT_DIR"/tools/resolve_secrets.sh

echo "==> Creating .e2e.env files and resolving secrets"

touch "$SCRIPT_DIR/../.e2e.env"

secret_names=("hmpps-community-payback-e2e-config")
resolve_secrets "$SCRIPT_DIR/../.e2e.env.template" \
                "$SCRIPT_DIR/../.e2e.env" \
                "hmpps-community-payback-dev" \
                "${secret_names[@]}"
