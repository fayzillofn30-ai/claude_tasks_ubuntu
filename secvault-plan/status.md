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
9. Seed/parol kiritishda `getpass` (yashirin kiritish) olib tashlandi —
   foydalanuvchi terayotganda ko'rmasa, xato terganini bilolmasligi
   muammo bo'lgan.
10. Git tarixi tekshirilganda (`git log`) email/username commit xabarida
    ochiq chiqib qolgani aniqlandi (`mask_email` faqat `@` bor stringlarni
    maskalaydi) — bu sabab bilan ham, ham "push xato bersa tizim
    chalkashadi" muammosi sababli, **avtomatik push butunlay olib
    tashlandi**. Endi `add/edit/delete` faqat lokal faylni yangilaydi,
    GitHub'ga yuborish alohida, qo'lda tanlanadigan menyu bandi
    ("8. Push") orqali, umumiy `"update: <sana>"` xabari bilan bajariladi
    (email endi commit xabariga yozilmaydi).
11. `pass` (Unix Password Store) kabi tayyor yechimlar bor-yo'qligi
    so'ralib tekshirildi — mavjudligi tasdiqlandi (GPG + git + Android
    ilova), lekin foydalanuvchi ataylab o'z, moslashtirilgan tizimida
    qolishga qaror qildi (sabab: faqat git+terminal+python kifoya, hamma
    joyda tez ishga tushadi).
12. To'liq listni ochiq (shifrlanmagan) `result.json`ga eksport qilish
    qo'shildi (9-band) — TTL bilan (2 daqiqadan keyin avtomatik o'chadi)
    va dasturdan chiqishda (`0` yoki `Ctrl+C`) ham darhol o'chiriladi;
    `.gitignore`ga qo'shilgan, GitHub'ga hech qachon tushmaydi.
13. `Ctrl+C` bosilganda xunuk traceback chiqayotgani aniqlandi — butun
    `main()` tsikli `try/except KeyboardInterrupt/finally` bilan o'raldi,
    endi toza "Bekor qilindi. Xayr!" xabari chiqadi va `result.json`
    tozalanadi.
14. Quvvat/jarayon kutilmaganda o'chib qolishidan himoya qo'shildi:
    - **Atomic yozish** — barcha fayllar avval `.tmp`ga yoziladi, so'ng
      `os.replace` bilan bir zumda almashtiriladi, shuning uchun yozish
      paytida uzilib qolsa ham asl fayl buzilmaydi.
    - **`current_step_status.json`** (lokal, git'ga tushmaydi) — har bir
      `init/add/edit/delete` boshida yozilib, tugagach o'chiriladi;
      dastur o'rtada to'xtab qolsa, keyingi ishga tushirishda "oxirgi
      safar X amali tugallanmasdan to'xtagan" deb ogohlantiradi.

## Texnik arxitektura (joriy holat)

- Shifrlash: `cryptography.fernet.Fernet` (AES asosida), kalit PBKDF2HMAC
  (SHA256, 390000 iteratsiya) orqali Seed/tiklash-javobidan hosil qilinadi.
- Fayllar: `vault.meta.json` (wrap qilingan DEK + tiklash savoli, parolsiz),
  `accounts.enc` (shifrlangan JSON-lug'at) — ikkalasi ham git'ga tushadi va
  faqat qo'lda (8-band) push qilinadi.
- `result.json` (ochiq, TTL=2 daqiqa) va `current_step_status.json` (holat
  kuzatuvi) — ikkalasi ham lokal, `.gitignore`da, git'ga tushmaydi.

## Holat

✅ Kod yozildi, funksional test qilindi (add/edit/delete/list — barcha
rejimlar, seed bilan qayta ochish, eksport+TTL, Ctrl+C, atomic-write
himoyasi) — scratchpadda muvaffaqiyatli o'tdi.
✅ `~/Desktop/secvault` → `github.com/fayzillo95/secvault`ga muntazam push
qilib borilmoqda, README to'liq hujjatlashtirilgan.
✅ Foydalanuvchi real muhitda ham sinab ko'rgan (o'zi qo'shgan/o'chirgan
test akkaunt git tarixida ko'ringan).
⏳ Termux'da (Android) haqiqiy sinovdan o'tkazish hali qilinmagan.
⏳ Kelajakda: til-agnostik vault format (boshqa tillarda ham decode qilish
imkoni) — [[project_secvault]] xotirasida qayd etilgan.
