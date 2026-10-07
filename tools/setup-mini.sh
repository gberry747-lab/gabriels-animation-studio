#!/bin/zsh
# One-shot setup for the Mac Mini as the home of Gabriel's games.
# Run ON the Mini:  zsh ~/gabriels-animation-studio/tools/setup-mini.sh
# Safe to re-run; every step is skipped when already done.
set -e
REPO=~/gabriels-animation-studio

echo "== 1. repo"
if [ ! -d "$REPO/.git" ]; then
  git clone https://github.com/gberry747-lab/gabriels-animation-studio.git "$REPO"
fi
cd "$REPO"
git remote set-url origin git@github.com:gberry747-lab/gabriels-animation-studio.git
git status -sb | head -1

echo "== 2. GitHub key for pushing (deploy key on the repo)"
if [ ! -f ~/.ssh/mini_to_github ]; then
  ssh-keygen -q -t ed25519 -N "" -C "mini-gabriels-games" -f ~/.ssh/mini_to_github
fi
grep -q "Host github.com" ~/.ssh/config 2>/dev/null || printf "\nHost github.com\n  IdentityFile ~/.ssh/mini_to_github\n  IdentitiesOnly yes\n" >> ~/.ssh/config
echo "public key (add as a deploy key with write access if not done yet):"
cat ~/.ssh/mini_to_github.pub

echo "== 3. Node (for node test/run.js)"
if ! command -v node >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1 || [ -x /opt/homebrew/bin/brew ]; then
    BREW=$(command -v brew || echo /opt/homebrew/bin/brew)
    "$BREW" install node
  else
    echo "Node is missing and Homebrew is not installed."
    echo "Install Node from https://nodejs.org (LTS .pkg) or install Homebrew first, then re-run this script."
  fi
fi
command -v node >/dev/null 2>&1 && node --version

echo "== 4. tests"
if command -v node >/dev/null 2>&1; then node test/run.js | tail -1; fi

echo "== 5. push access check"
ssh -o BatchMode=yes -o ConnectTimeout=10 -T git@github.com 2>&1 | head -1 || true
echo "done"
