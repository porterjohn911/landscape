#!/usr/bin/env bash
# Regenerates FULL_SOURCE.md by concatenating every source file in the repo
# into a single scrollable Markdown document. Invoked from the
# "Update FULL_SOURCE.md" GitHub Actions workflow and runnable locally.
set -euo pipefail

cd "$(dirname "$0")/.."

files=(
  README.md
  DESIGN.md
  package.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  tailwind.config.js
  postcss.config.js
  index.html
  .gitignore
  shared/types.ts
  electron/main.ts
  electron/preload.ts
  electron/store.ts
  electron/ipc/config.ts
  electron/ipc/projects.ts
  electron/ipc/ai.ts
  electron/ipc/satellite.ts
  src/main.tsx
  src/App.tsx
  src/styles.css
  src/lib/api.ts
  src/lib/store.ts
  src/routes/ProjectList.tsx
  src/routes/Editor.tsx
  src/routes/Settings.tsx
  src/modules/ai-photo/AIPhotoStudio.tsx
  src/modules/ai-photo/BeforeAfter.tsx
  src/modules/plan-2d/PlanCanvas.tsx
  src/modules/plan-2d/palette.ts
  src/modules/scene-3d/SceneViewer.tsx
  src/modules/scene-3d/PlantModel.tsx
  src/modules/scene-3d/models.ts
  web-demo/index.html
  scripts/build-bundle.sh
  .github/workflows/build.yml
  .github/workflows/pages.yml
  .github/workflows/bundle.yml
)

anchor() {
  echo "$1" | tr '/.' '--' | tr -d '_'
}

lang_for() {
  case "${1##*.}" in
    ts|tsx)   echo typescript ;;
    js|jsx)   echo javascript ;;
    json)     echo json ;;
    yml|yaml) echo yaml ;;
    html)     echo html ;;
    css)      echo css ;;
    md)       echo markdown ;;
    sh)       echo bash ;;
    *)        echo "" ;;
  esac
}

OUT=FULL_SOURCE.md

{
  echo "# Landscape Studio — Full source bundle"
  echo ""
  echo "Every source file in the repository concatenated into one place. Useful for code review or LLM ingestion. To actually **run** the app you still need the repository's directory structure — see the repo home page."
  echo ""
  echo "Regenerated automatically on every push to \`main\` by [\`scripts/build-bundle.sh\`](./scripts/build-bundle.sh)."
  echo ""
  echo "Generated from commit \`$(git rev-parse --short HEAD)\` on $(date -u +%Y-%m-%d)."
  echo ""
  echo "## Files included"
  echo ""

  for f in "${files[@]}"; do
    if [ -f "$f" ]; then
      lines=$(wc -l < "$f" | tr -d ' ')
      echo "- [\`$f\`](#$(anchor "$f")) — $lines lines"
    fi
  done

  echo ""

  for f in "${files[@]}"; do
    [ -f "$f" ] || continue
    echo ""
    echo "---"
    echo ""
    echo "<a id=\"$(anchor "$f")\"></a>"
    echo "## \`$f\`"
    echo ""
    echo '````'"$(lang_for "$f")"
    cat "$f"
    echo '````'
  done
} > "$OUT"

echo "Wrote $OUT ($(wc -l < "$OUT" | tr -d ' ') lines)"
