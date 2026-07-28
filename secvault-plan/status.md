# SecVault — Gmail/parol vault loyihasi (2026-07-28)

Maqsad: Gmail va parollarni shifrlab saqlaydigan, Termux'da ham ishlaydigan
terminal dasturi, GitHub orqali qurilmalar o'rtasida sinxronlanadi.

**Loyihaning o'zi (kod, git tarixi) shu papkada emas** — alohida, mustaqil
repo sifatida `~/Desktop/secvault` papkasida, GitHub'da
`github.com/fayzillo95/secvault` manzilida joylashgan. Bu yerda faqat qaror
va reja tarixi yozib boriladi.

## Yo'l bosib o'tish (qarorlar tarixi)

1. Boshlang'ich g'oya — C tilida oddiy XOR shifrlash bilan `accounts.enc`
   fayliga yozadigan CLI dastur (struct-based, append-only).
2. XOR bitta baytli kalit bilan zaif ekanligi aniqlandi (256 variant,
   brute-force oson) — muhokama qilindi: repeating-key XOR, so'ng
   `libsodium`/haqiqiy kriptografiya variantlari taklif qilindi.
3. Talab o'zgardi: front/bot emas, **Termux'da ishlaydigan Python CLI**,
   GitHub'ga har yangi ma'lumotda avtomatik push qilinadigan qilib.
   Python tanlandi (Termux'da kompilyatsiya kerak emas, `cryptography`
   kutubxonasi orqali haqiqiy AES-darajasidagi shifrlash oson qo'shiladi).
4. Tahrirlash/o'chirish extraqi qo'shildi — ma'lumot formati
   append-only struct'dan JSON-lug'atga (`{gmail: parol}`) o'zgardi, chunki
   tahrirlash uchun butun faylni qayta yozish kerak.
5. "Reset password" g'oyasi — Seedni unutib qo'yish muammosi uchun
   **ikkilamchi kalit (dual-key recovery)** arxitekturasi qo'shildi: bitta
   tasodifiy DEK (data encryption key) ikki marta "o'raladi" — biri Seed
   bilan, biri tiklash savoli/javobi bilan. Ikkalasidan qay biri bilan ham
   ochish mumkin.
6. `list` uch rejimga bo'lindi: to'liq (parollar bilan), faqat emaillar,
   masked (`use...il@gmail.com` + parol o'rniga uzunlikka mos `***`).
7. Interfeys argparse subkomandalardan **raqamli interaktiv menyuga**
   o'zgartirildi (1-7, 0-chiqish) — Termux'da ishlatish qulayroq bo'lishi
   uchun.
8. Loyiha avval `claude_tasks/secvault/` ichida yaratilgan edi, lekin
   `claude_tasks` allaqachon boshqa GitHub repo'ga (`claude_tasks_ubuntu`)
   ulangani esdan chiqqani sababli chalkashlik yuzaga kelgan — loyiha
   `~/Desktop/secvault`ga mustaqil papka sifatida ko'chirildi va o'z
   GitHub repo'siga (`fayzillo95/secvault`, SSH orqali) ulandi.

## Texnik arxitektura (qisqacha)

- Shifrlash: `cryptography.fernet.Fernet` (AES asosida), kalit PBKDF2HMAC
  (SHA256, 390000 iteratsiya) orqali Seed/tiklash-javobidan hosil qilinadi.
- Fayllar: `vault.meta.json` (wrap qilingan DEK + tiklash savoli, parolsiz),
  `accounts.enc` (shifrlangan JSON-lug'at) — ikkalasi ham git'ga tushadi.
- Har bir `add/edit/delete`dan keyin avtomatik `git add + commit + push`.

## Holat

✅ Kod yozildi, funksional test qilindi (add/edit/delete/list — barcha
rejimlar, seed bilan qayta ochish) — scratchpadda muvaffaqiyatli o'tdi.
✅ `~/Desktop/secvault` sifatida GitHub'ga push qilindi (ilk commit +
`.gitignore`).
⏳ Termux'da haqiqiy sinovdan o'tkazish hali qilinmagan.
