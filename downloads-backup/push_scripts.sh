#!/usr/bin/env bash
# ~/Downloads ni fayzillofn30-ai/downloads-backup (private repo) ga push qilish.
#
# Nega kerak: bu account'da SSH kalit yo'q, va global git config'dagi
#   url.git@github.com:.insteadof=https://github.com/
# qoidasi oddiy "https://github.com/..." URL'ni SSH'ga aylantirib yuboradi.
# Shu sababdan har doim token-embedded URL ishlatiladi (origin orqali emas).
#
# Ishlatish:
#   bash ~/Desktop/claude_tasks/downloads-backup/push_scripts.sh

set -euo pipefail

DOWNLOADS_DIR="$HOME/Downloads"
REPO="fayzillofn30-ai/downloads-backup"

cd "$DOWNLOADS_DIR"

if ! command -v gh >/dev/null 2>&1; then
  echo "XATO: 'gh' (GitHub CLI) topilmadi. O'rnatilganini tekshiring." >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "XATO: gh CLI login qilinmagan. Avval ishga tushiring: gh auth login" >&2
  exit 1
fi

ACTIVE_ACCOUNT=$(gh api user --jq '.login' 2>/dev/null || echo "")
if [ "$ACTIVE_ACCOUNT" != "fayzillofn30-ai" ]; then
  echo "OGOHLANTIRISH: hozirgi gh account '$ACTIVE_ACCOUNT', 'fayzillofn30-ai' emas." >&2
  echo "Kerak bo'lsa: gh auth switch --user fayzillofn30-ai" >&2
fi

if [ ! -d .git ]; then
  echo "XATO: $DOWNLOADS_DIR da .git yo'q. Avval 'git init' qilinishi kerak." >&2
  exit 1
fi

echo "== o'zgarishlarni tekshirish =="
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  COMMIT_MSG="Downloads backup snapshot $(date +%Y-%m-%d_%H-%M)"
  git commit -m "$COMMIT_MSG"
  echo "Yangi commit qilindi: $COMMIT_MSG"
else
  echo "O'zgarish yo'q, mavjud commit push qilinadi."
fi

BRANCH=$(git branch --show-current)
TOKEN=$(gh auth token)

echo "== push qilinmoqda ($BRANCH -> $REPO) =="
git push "https://x-access-token:${TOKEN}@github.com/${REPO}.git" "$BRANCH"

echo "== tasdiqlash =="
git ls-remote "https://x-access-token:${TOKEN}@github.com/${REPO}.git" "$BRANCH"
echo "Push muvaffaqiyatli tugadi: https://github.com/${REPO}"
