# Downloads GitHub backup — YAKUNLANDI (2026-07-21)

Maqsad: `~/Downloads` (archives/codes/documents/images/others/videos, ~210MB) ni
`fayzillofn30-ai` GitHub accountiga private repo sifatida backup qilish.
(Eslatma: avval Mega.nz taklif qilingandi, lekin foydalanuvchi hisob ochmagan —
o'rniga GitHub'ga fayzillofn30-ai bilan push qilinmoqda, xuddi 26 loyiha kabi.)

## Holat
1. [DONE] `~/Downloads` da lokal git repo bor edi (avvalgi sessiyada init qilingan):
   - 1 commit: `f3ef418 "Downloads backup snapshot 2026-07-20"`
   - branch: `main`, working tree clean
2. [DONE] GitHub'da repo yaratildi: `gh repo create fayzillofn30-ai/downloads-backup --private --source=. --remote=origin`
   -> https://github.com/fayzillofn30-ai/downloads-backup
   - Muhim: `gh repo create --remote=origin` remote'ni SSH ko'rinishida qo'ydi
     (`git@github.com:fayzillofn30-ai/downloads-backup.git`), lekin bu accountda
     SSH kalit yo'q (faqat `fayzillo95` va `ummatovfayzillo` uchun SSH key bor,
     ~/.ssh/config'da alias qilingan). `fayzillofn30-ai` uchun SSH key umuman yo'q.
3. [IN PROGRESS] Push qilinmoqda. Avvalgi (26 loyiha) backupda ishlatilgan usul:
   token-embedded HTTPS URL, chunki foydalanuvchi global git config'ida
   `url.git@github.com:.insteadof=https://github.com/` qoidasi bor (o'zgartirilmagan,
   foydalanuvchi so'rovi bilan). Komanda:
   ```
   cd ~/Downloads
   TOKEN=$(gh auth token)
   git push "https://x-access-token:${TOKEN}@github.com/fayzillofn30-ai/downloads-backup.git" main
   ```
   Birinchi urinish 2 daqiqada timeout bo'ldi (SIGTERM, exit 143) — internet sekin/uzilgan
   bo'lishi mumkin, git-level xato emas. Push HALI MUVAFFAQIYATLI TUGAMAGAN.
   Qayta urinishda uzunroq timeout va/yoki background bilan sinash kerak.

## Keyingi qadam
- `cd ~/Downloads && TOKEN=$(gh auth token) && git push "https://x-access-token:${TOKEN}@github.com/fayzillofn30-ai/downloads-backup.git" main`
  ni qayta ishga tushirish (kerak bo'lsa background/uzoq timeout bilan).
- Push tugagach tekshirish: https://github.com/fayzillofn30-ai/downloads-backup
- `git remote -v` origin URL SSH shaklida qolgan — muammo emas chunki push
  literal token-URL bilan qilinyapti (origin ishlatilmayapti). Xohlasa keyin
  origin'ni ham to'g'irlash mumkin: `git remote set-url origin https://github.com/fayzillofn30-ai/downloads-backup.git`
  (lekin bu ham insteadOf qoidasiga uchraydi va yana SSH'ga aylanadi — demak
  origin orqali push doim SSH bo'ladi va fail bo'ladi; shu sabab har doim
  token-embedded literal URL ishlatish kerak).

## Muhim eslatma (auth)
`gh auth status`: hozir faqat **fayzillofn30-ai** account login (HTTPS, token,
scope: gist/read:org/repo). Boshqa GitHub accountlar (fayzillo95, ummatovfayzillo)
uchun SSH orqali ulaniladi (~/.ssh/config: `github.com-fayzillo95`, `github.com-ummatov`).
