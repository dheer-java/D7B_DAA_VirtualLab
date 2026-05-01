#!/bin/bash
# ============================================================
#  build.sh — Compile and Run the String Matcher Visualizer
# ============================================================
#  Usage:
#    chmod +x build.sh
#    ./build.sh          # compile + run
#    ./build.sh compile  # compile only
#    ./build.sh jar      # compile + create runnable JAR
# ============================================================

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="$PROJECT_ROOT/src"
OUT_DIR="$PROJECT_ROOT/out"
JAR_NAME="StringMatcherVisualizer.jar"
MAIN_CLASS="main.Main"

echo "========================================"
echo "  String Matching Algorithm Visualizer  "
echo "========================================"

# ── Step 1: Create output directory ──────────────────────────
mkdir -p "$OUT_DIR"

# ── Step 2: Find all .java files ─────────────────────────────
SOURCES=$(find "$SRC_DIR" -name "*.java")

# ── Step 3: Compile ───────────────────────────────────────────
echo "[1/2] Compiling Java sources..."
javac -d "$OUT_DIR" -sourcepath "$SRC_DIR" $SOURCES

if [ $? -ne 0 ]; then
  echo ""
  echo "✗  Compilation failed. Check errors above."
  exit 1
fi
echo "      ✓ Compilation successful"

# ── Step 4: Run or JAR ───────────────────────────────────────
if [ "$1" = "jar" ]; then
  echo "[2/2] Creating runnable JAR..."
  cd "$OUT_DIR"
  echo "Main-Class: $MAIN_CLASS" > manifest.txt
  jar cfm "$PROJECT_ROOT/$JAR_NAME" manifest.txt .
  rm manifest.txt
  echo "      ✓ JAR created: $JAR_NAME"
  echo ""
  echo "Run with:  java -jar $JAR_NAME"
elif [ "$1" != "compile" ]; then
  echo "[2/2] Launching application..."
  echo ""
  java -cp "$OUT_DIR" "$MAIN_CLASS"
fi
