#!/usr/bin/env bash
# install.sh — bootstrap the marketing project.
#
# Usage:
#   curl -fsSL <raw-url>/install.sh | bash
#   ./install.sh [--prefix DIR] [--ref BRANCH_OR_TAG]

set -euo pipefail

REPO_URL="${MARKETING_REPO_URL:-https://github.com/leojose18/marketing.git}"
INSTALL_PREFIX="${MARKETING_PREFIX:-$HOME/.marketing}"
GIT_REF="${MARKETING_REF:-main}"

log()  { printf '\033[1;34m[install]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[warn]\033[0m %s\n' "$*" >&2; }
err()  { printf '\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

while [ $# -gt 0 ]; do
    case "$1" in
        --prefix) INSTALL_PREFIX="$2"; shift 2 ;;
        --ref)    GIT_REF="$2"; shift 2 ;;
        --repo)   REPO_URL="$2"; shift 2 ;;
        -h|--help)
            sed -n '2,8p' "$0" | sed 's/^# \{0,1\}//'
            exit 0 ;;
        *) err "unknown argument: $1" ;;
    esac
done

require() {
    command -v "$1" >/dev/null 2>&1 || err "missing required tool: $1"
}

log "checking prerequisites"
require git
require curl

log "installing into $INSTALL_PREFIX (ref: $GIT_REF)"
if [ -d "$INSTALL_PREFIX/.git" ]; then
    log "existing checkout found — updating"
    git -C "$INSTALL_PREFIX" fetch --depth 1 origin "$GIT_REF"
    git -C "$INSTALL_PREFIX" checkout -B "$GIT_REF" "origin/$GIT_REF" 2>/dev/null \
        || git -C "$INSTALL_PREFIX" checkout "$GIT_REF"
else
    mkdir -p "$(dirname "$INSTALL_PREFIX")"
    git clone --depth 1 --branch "$GIT_REF" "$REPO_URL" "$INSTALL_PREFIX"
fi

cd "$INSTALL_PREFIX"

if [ -f package.json ]; then
    log "installing Node dependencies"
    if command -v pnpm >/dev/null 2>&1; then pnpm install
    elif command -v yarn >/dev/null 2>&1; then yarn install
    else require npm && npm install
    fi
fi

if [ -f requirements.txt ]; then
    log "installing Python dependencies"
    require python3
    python3 -m pip install --user -r requirements.txt
fi

if [ -f pyproject.toml ] && command -v pip >/dev/null 2>&1; then
    log "installing project (pyproject.toml)"
    pip install --user .
fi

log "done — project installed at $INSTALL_PREFIX"
