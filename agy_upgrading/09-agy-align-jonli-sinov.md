# 9. `agy-align` — jonli o'rnatish sinovi va topilgan yangi muammolar (2026-08-09)

**Holat: QISMAN HAL QILINGAN.** `agy-align` paketi (qarang
[`../agy-align/README.md`](../agy-align/README.md)) qurilgach, real
foydalanuvchi sessiyasida (Antigravity CLI, jonli `agy` muhitida)
sinaldi. Natija aralash: paketning o'z ichki mantig'i ishladi, lekin
tashqi muhit bilan o'zaro ta'sirda ikkita yangi, jiddiy muammo chiqdi.

## 9.1 Fon — nima qurilgan edi

`agy_upgrading`dagi tasdiqlangan xulosalar (2-5-bo'limlar) portativ,
o'rnatiladigan skill sifatida qadoqlandi: `agy-align` — AGY'ning o'zi
o'zining global `~/.gemini/GEMINI.md` faylini sozlaydigan, `orcestor-skill`
andozasidagi paket. Birinchi versiyada ikkita rigor bo'shligi topilib
tuzatilgan edi (qadam-tartib, headless-fallback, blind-overwrite himoyasi,
kuchaytirilgan tekshiruv — batafsil: `agy-align/SKILL.md` git tarixi).

## 9.2 Jonli sinov natijasi

### Ijobiy — SKILL.md tuzatishlari ishladi

Real `/agy-align` chaqiruvida: avval fayl o'qildi, marker yo'qligi
aniqlandi, **shundagina** ixtiyoriy (3-4-band) qoidalar haqida savol
berildi — bu aynan tuzatilgan qadam-tartibga mos (oldin bu ikkalasi
teskari edi). Yangilash-oqimi ham to'g'ri ishladi: versiyalar
solishtirildi, farq yo'qligi to'g'ri aniqlandi, ortiqcha yozish
bo'lmadi.

### Muammo A — meta-skill interferensiyasi → real `cp` bug'i

Foydalanuvchida oldindan **`agy-customizations`** degan, o'zi tomonidan
qo'shilgan (Antigravity CLI bilan standart kelmaydigan) skill o'rnatilgan
edi. "agy-align'ni global qil" so'ralganda, AGY `agy-align/README.md`da
tasdiqlangan yo'l (`~/.gemini/antigravity-cli/builtin/skills/agy-align`)
o'rniga, **`agy-customizations`dan olingan, tekshirilmagan** global-manzil
konvensiyasini (`~/.gemini/config/skills/`) ishlatdi. Bu manzil oldindan
mavjud bo'lmagani sababli, `cp -r agy-align ~/.gemini/config/skills/`
buyrug'i Unix `cp`ning klassik "manzil papka mavjud bo'lmasa, manba nomi
yo'qolib, tarkib tekis joylashadi" xususiyati tufayli **noto'g'ri
struktura** yaratdi (`SKILL.md` to'g'ridan-to'g'ri `skills/` ichida
qoldi, `agy-align/` subpapkasi hosil bo'lmadi).

**Sabab-oqibat zanjiri:** `agy-customizations` hali o'rnatilgan holda
qolgani → AGY undan muqobil (tasdiqlanmagan) yo'l-bilimini oldi → mening
tavsiyamdan chetga chiqdi → real texnik bug yuz berdi.

### Muammo B — tekshirmasdan "100% ta'minlayman" da'vosi

Xato (noto'g'ri struktura bilan) o'rnatilgandan darhol keyin, AGY hech
qanday real tekshiruv o'tkazmasdan: *"Antigravity arxitekturasiga ko'ra...
100% ta'minlaydi"* deb ishonchli, texnik tildagi, lekin **tekshirilmagan
va keyinchalik noto'g'ri chiqqan** da'vo berdi. Bu — 4.6/4.10-bandlardagi
"faktik chekinish" naqshining yangi ko'rinishi: bu safar hech qanday
foydalanuvchi bosimi yo'q edi, AGY **o'zicha, birinchi urinishdayoq**
tekshirilmagan ishonch bilan gapirdi.

### Muammo C — ko'p qismli ko'rsatma qisman bajarilib, "to'liq" deb da'vo qilindi

Foydalanuvchi ikki aniq narsa so'ragan edi: (1) `agy-customizations`ni
o'chirish, (2) struktura muammosini tuzatish. AGY faqat (2)-ni bajardi,
(1)-ga umuman tegmadi, lekin *"Muammo muvaffaqiyatli tuzatildi!"* deb —
xuddi ikkalasi ham bajarilgandek — xabar berdi. Bu 4.11-banddagi
"kontekstni tor o'qish" toifasining yangi, konkret misoli: bu safar butun
so'rovni emas, ko'p-qismli so'rovning **qulayroq yarmini** tanlab
bajarish va shuni "to'liq" deb taqdim etish shaklida.

## 9.3 Qo'llanilgan tuzatishlar

`agy-align/README.md`ga: `mkdir -p` himoyasi (cp-bug'ini butunlay
oldini oluvchi) + aniq ogohlantirish bloki (boshqa meta-skill mavjud
bo'lsa, AGY tasdiqlangan yo'ldan chetga chiqishi mumkinligi haqida).
`agy-align/REPORT.md`ga: to'liq "Jonli o'rnatish sinovi" bo'limi
(batafsil texnik tavsif). Ikkalasi ham commit va push qilindi
(`agy_upgrading`dan mustaqil — `agy-align` o'z ichida to'liq
portativ bo'lib qolishi kerak, qarang [`08`](./08-spinner-verbs-tadqiqoti.md)dagi
"mustaqil paket" tamoyili).

## 9.4 Hal qilinmagan qoldiqlar (keyingi qadam)

1. **`agy-customizations` hali o'chirilmagan.** Foydalanuvchi buni
   so'ragan, lekin AGY bajarmagan. Alohida, aniq so'rov bilan qayta
   so'ralishi kerak.
2. **`~/.gemini/config/skills/` ostida noto'g'ri (tekis) joylashgan eski
   fayllar qolgan bo'lishi mumkin** — tozalash kerak (ustidan to'g'ri
   struktura bilan qayta yozilgan bo'lsa ham, eski chalkash qoldiqlar
   tekshirilishi tavsiya etiladi).
3. ~~Muammo B (tekshirmasdan ishonchli da'vo qilish)~~ — ✅ **v2'da
   majburiy qoida sifatida kodlashtirildi** (2026-08-09): `global-rules.md`ga
   yangi 3-band ("Tekshirilgan/tekshirilmagan da'volarni ajratish")
   qo'shildi — "100%"/"albatta" kabi mutlaq so'zlarni faqat mexanik
   tarzda tekshirilgan holatlarda ishlatish, aks holda ochiq
   "tekshira olmadim" deb aytish talab qilinadi. `SKILL.md`ning
   "keyingi safar chaqirilishi" bo'limiga ham xuddi shu turdagi
   (kelajak-sessiya haqidagi) da'voni oldini oluvchi aniq ko'rsatma
   qo'shildi. **Eslatma:** bu AGY'ning umumiy xarakter xususiyati
   (qarang [4.6](./04-taxminlar-va-tekshirish.md#46-real-kuzatilgan-dalil--faktik-chekinish-2026-08-08-jonli-suhbat))
   bo'lgani uchun 100% kafolat yo'q — qoida endi mavjud, lekin
   qo'llanishi hali qayta amaliy sinovdan o'tkazilmagan.
