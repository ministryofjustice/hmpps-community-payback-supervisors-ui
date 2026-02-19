#!/usr/bin/env bash
set -e
# shellcheck disable=SC3040
set -o pipefail

# Resolve Secrets
#
# Will replace entries in a given template file in the format ${SECRET_NAME}
# with secret values derived from the given k8s secret in the given k8s namespace
#
# If an entry's name ends with 'B64' the value will be left in Base64
#
# $1 source template file to update
# $2 where to write the resulting file
# $3 kubernetes namespace
# $4 kubernetes secret names (array)
resolve_secrets() {
  source="$1"
  shift
  target="$1"
  shift
  k8s_namespace="$1"
  shift
  secretNames=( "$@" )

  echo ""
  echo "==> Resolving secrets in template '$source' to '$target' in namespace '$k8s_namespace'"

  # shellcheck disable=SC3020
  if ! command -v jq &> /dev/null
  then
      echo "Cannot find 'jq'. Please install using 'brew install jq'"
      exit 1
  fi

  # run in a subshell to limit the script of environment variables
  (
    for secretName in "${secretNames[@]}"; do

      echo "Loading secrets for $secretName"

      secrets_json=$(kubectl get secrets "$secretName" --namespace "$k8s_namespace" -o json | jq ".data")

      secret_keys=$(echo "$secrets_json" | jq -r "to_entries[] | .key")
      for key in $secret_keys; do
        value=$(echo "$secrets_json" | jq -r "to_entries[] | select(.key == \"""${key}""\") | .value")

        if [[ "$key" == *B64 ]]
        then
          # shellcheck disable=SC2163
          export "$key=$value" || echo "Cannot export secret (see logged error above)"
        else
          decoded_value=$(echo $value | base64 -d)
          export "$key=$decoded_value" || echo "Cannot export secret (see logged error above)"
        fi

      done
    done

    rm -f "$target"
    # resolve 'variables' in source with env vars
    envsubst < "$source" > "$target"
    # remove comments from the resultant file
    # -i '' is required for mac os, see https://stackoverflow.com/questions/26081375
    sed -i '' '/^#/d' "$target"
  )
}
