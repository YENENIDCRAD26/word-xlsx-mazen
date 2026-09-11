#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$DIR/android/gradlew" ]; then
  cd "$DIR/android" && ./gradlew "$@"
else
  echo "Error: android/gradlew not found" >&2
  exit 1
fi
