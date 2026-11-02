#!/usr/bin/env bash
# Regenerate CHANGELOG.md from the GitHub Releases (stable ones; semantic-release writes the notes).
# usage: scripts/changelog.sh   (needs `gh`, authenticated)
set -euo pipefail
cd "$(dirname "$0")/.."
{
  echo "# Changelog"
  echo
  echo "Generated from [GitHub Releases](https://github.com/snomiao/rime-snomiao/releases) by \`scripts/changelog.sh\`;"
  echo "pre-releases (alpha/beta) are omitted. Versions follow [semantic-release](https://semantic-release.gitbook.io/)."
  echo
  gh release list --limit 100 --exclude-pre-releases --json tagName -q '.[].tagName' | while read -r tag; do
    gh release view "$tag" --json body -q .body | sed -e 's/^# \[/## [/' -e 's/^# \([0-9]\)/## \1/' | cat -s
    echo
  done
} > CHANGELOG.md
