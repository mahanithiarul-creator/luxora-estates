#!/usr/bin/env bash
set -e

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
MANIFEST="$ROOT_DIR/public/asset-manifest.json"

if [ ! -f "$MANIFEST" ]; then
  echo "asset-manifest.json not found in public/"
  exit 1
fi

echo "Reading asset manifest: $MANIFEST"

command -v curl >/dev/null 2>&1 || { echo >&2 "curl is required but not installed. Aborting."; exit 1; }

jq -c '.assets[]' "$MANIFEST" | while read -r asset; do
  id=$(echo "$asset" | jq -r '.id')
  path=$(echo "$asset" | jq -r '.path')
  url=$(echo "$asset" | jq -r '.recommended_url')
  if [ -z "$url" ] || [ "$url" = "" ] || [ "$url" = "null" ]; then
    echo "Skipping $id — no recommended_url specified in manifest. Open public/asset-manifest.json to add a URL."
    continue
  fi
  dest="$ROOT_DIR/public${path}"
  destdir=$(dirname "$dest")
  mkdir -p "$destdir"
  echo "Downloading $id from $url to $dest"
  curl -L "$url" -o "$dest"
done

echo "Download complete. Remember to add DRACO/Basis decoders to public/decoders if using compression."
