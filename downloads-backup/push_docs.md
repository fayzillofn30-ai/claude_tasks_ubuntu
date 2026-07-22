# ~/Downloads → GitHub push — qo'llanma

## Nima uchun
`~/Downloads` GitHub'da `fayzillofn30-ai/downloads-backup` private repo sifatida
backup qilinadi. Skript orqali istalgan vaqt qayta ishga tushirish mumkin —
yangi qo'shilgan/o'chirilgan fayllarni avtomatik commit qilib push qiladi.

## Ishlatish (copy-paste)
```
bash ~/Desktop/claude_tasks/downloads-backup/push_scripts.sh
```

To'liq (absolyut) path:
```
bash /home/fayzillo/Desktop/claude_tasks/downloads-backup/push_scripts.sh
```

## Skript nima qiladi
1. `~/Downloads`ga o'tadi.
2. `gh` CLI o'rnatilgan/login qilinganini tekshiradi (kerak bo'lsa
   `fayzillofn30-ai` accountga ulanganini ogohlantiradi).
3. O'zgarish bo'lsa: `git add -A` + `git commit -m "Downloads backup snapshot <sana>"`.
4. O'zgarish bo'lmasa: mavjud oxirgi commit'ni push qilishga urinadi
   (odatda "Everything up-to-date" chiqadi — bu normal).
5. Push token-embedded HTTPS URL orqali qilinadi:
   `https://x-access-token:$(gh auth token)@github.com/fayzillofn30-ai/downloads-backup.git`
   — **`origin` remote orqali emas**, chunki global git config'da
   `url.git@github.com:.insteadof=https://github.com/` qoidasi bor va u oddiy
   https URL'ni SSH'ga aylantirib yuboradi (bu accountda SSH kalit yo'q).
   Global config o'zgartirilmagan (foydalanuvchi so'rovi).
6. Push'dan keyin `git ls-remote` bilan branch haqiqatan GitHub'da borligini
   tasdiqlaydi.

## Talablar
- `gh` CLI o'rnatilgan va `fayzillofn30-ai` accountga login qilingan bo'lishi kerak
  (`gh auth status` bilan tekshiring; kerak bo'lsa `gh auth login`).
- Internet aloqasi barqaror bo'lishi kerak — sekin/uzilib turadigan tarmoqda
  (masalan zaif WiFi) katta hajmli push HTTP 408 (timeout) bilan tugashi mumkin.
  Bunday holatda LAN kabel ulash yoki tarmoq tezligini tekshirish tavsiya
  etiladi (`curl -o /dev/null -s -w "%{speed_download} bytes/sec\n" https://github.com`).

## Xatoliklarni bartaraf etish
- **"Repository not found" / SSH xatosi**: skript to'g'ri ishlasa bu chiqmasligi
  kerak (token-URL ishlatadi). Agar chiqsa — `gh auth status`ni tekshiring,
  ehtimol boshqa accountga almashgan.
- **HTTP 408 / "unexpected disconnect"**: tarmoq juda sekin. Tezlikni tekshirib,
  qayta urinib ko'ring (skriptni qayta ishga tushirsangiz bo'ldi, allaqachon
  commit qilingan narsa qayta commit qilinmaydi, faqat push qayta urinadi).
- **"nothing to commit" lekin push kerak**: muammo emas — skript avtomatik
  mavjud commit'ni push qilishga urinadi.

## Tasdiqlangan (2026-07-21)
Skript real test qilindi: fayl qo'shish → commit+push, fayl o'chirish →
commit+push, o'zgarishsiz holat → "Everything up-to-date". Uchalasi ham
muvaffaqiyatli ishladi. Joriy repo holati: https://github.com/fayzillofn30-ai/downloads-backup
