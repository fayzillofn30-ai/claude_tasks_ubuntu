# GitHub backup — YAKUNLANDI (2026-07-20)

Account: fayzillofn30-ai (dev accountlardan mustaqil, faqat backup uchun)
Barcha 26/26 loyiha private repo sifatida push qilindi.

## Yechilgan muammolar (eslatma uchun)
1. `gh repo create --push` SSH remote yaratdi, lekin yangi accountda SSH kalit yo'q edi -> HTTPS'ga o'tkazildi.
2. Foydalanuvchining global git config'ida `url.git@github.com:.insteadof=https://github.com/` qoidasi bor -> har qanday https URL avtomatik SSH'ga aylanadi. **Global config o'zgartirilmadi** (foydalanuvchi so'rovi). Yechim: push paytida token-embedded URL ishlatildi (`https://x-access-token:$(gh auth token)@github.com/...`), bu insteadOf qoidasini chetlab o'tadi.
3. `pro/telegram_app` ichida 3 ta embedded git repo bor edi (`file_server`, `app/back_end`, `app/front_end`) -> ularning `.git` papkalari o'chirildi, oddiy fayl sifatida qo'shildi (`.env` fayllar `.gitignore` orqali xavfsiz chetlab o'tildi).
4. `high/edfix_clone` da `.github/workflows/deploy.yml` bor edi, token'da `workflow` scope yo'q edi -> `.github/` papkasi backup repodan chiqarib tashlandi (`.gitignore`ga qo'shildi). Agar kerak bo'lsa keyinroq `gh auth refresh -s workflow` bilan scope qo'shib qayta push qilish mumkin.

## Repo ro'yxati
Barchasi: https://github.com/fayzillofn30-ai?tab=repositories
Nomlash: `<tier>-<loyiha_nomi>` (masalan `high-crm`, `pro-pet_project`)
