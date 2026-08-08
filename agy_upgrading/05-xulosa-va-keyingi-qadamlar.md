# 5. Umumiy xulosa va keyingi qadamlar

**2026-08-08 yangilandi: real testlar ([`06-test-natijalari.md`](./06-test-natijalari.md))
dastlabki taklifning bir qismini rad etdi va aniqroq, tasdiqlangan yechimga
olib keldi.**

## Xulosa

- Muammo ikkita, lekin bog'liq: (1) AGY xato berilganda tashxissiz darhol
  edit qiladi (Execution intizomsizligi), (2) AGY/Gemini ohangi haddan
  tashqari tasdiqlovchi, bosim ostida faktlarni to'qishga moyil
  (Laganbardorlik / faktik chekinish).
- Strategik sabab: Gemini Pro (AGY) deyarli cheksiz sovg'a obuna, Claude esa
  chegaralangan hamkasb obunasi — shu sabab Claude'ga o'tish emas, **AGY'ni
  Claude uslubiga yaqinlashtirish** tanlandi ([1.4-band](./01-muammo-va-kelib-chiqishi.md#14-strategik-kontekst--nega-agy-nega-claude-emas)).
- **Muammo 1 uchun test-tasdiqlangan xulosa (2026-08-08 kuni ichida ikki
  marta yangilandi):** CLI bayrog'i (`--mode plan`) headless (`agy -p`)
  chaqiruvda ishonchli ishlamadi (Test 3). Loyihaviy qoidalar fayli
  (`AGENT.md`) ham dastlab ishlamadi (Test 5) — lekin keyinroq aniqlandiki,
  bu **faqat loyiha-darajasidagi** fayllarga xos ekan: xuddi shu qoida
  **global** `~/.gemini/GEMINI.md`ga qo'shilganda ISHLADI (Test 12, Test 13,
  batafsil: [`06-test-natijalari.md#h`](./06-test-natijalari.md#h-global-geminimd--tuzatuvchi-topilma-2026-08-08-test-10-12)).
  **Yakuniy, eng arzon yechim:** ikkita qoidani ("avval tashxis qo'y" +
  "tushunganini qisqa ayt/noaniq bo'lsa so'ra") **bir marta** global
  `~/.gemini/GEMINI.md`ga yozish — bu Orcestor orqali ham, to'g'ridan-to'g'ri
  ham barcha `agy -p` chaqiruvlarga avtomatik ta'sir qiladi, promptga
  qo'lda qo'shish shart emas.
- **Muammo 2 uchun test-tasdiqlangan nuqta:** sycophancy/faktik chekinish
  universal emas — keng tarqalgan, kuchli asoslangan faktlarda kuzatilmadi
  (Test 7, React sanasi), lekin noaniq/kam hujjatlashtirilgan mavzularda va
  qidiruv natijasiz qolganda kuchli namoyon bo'ldi (jonli "Crystallizing"
  holati). Ohang-persona bloki (3.2-band) endi global faylga yozilishi
  mumkinligi tasdiqlandi (Test 10-13 xuddi shu mexanizmni ishlatadi), lekin
  bu ANIQ blokning o'zi hali alohida sinovdan o'tkazilmagan.
- Bu — [`new_fixing_orcestration_system`](../new_fixing_orcestration_system/README.md)ni
  BEKOR QILMAYDI, uni **kuchaytiradi va soddalashtiradi**: Orcestor
  arxitekturasi (Claude tashxis qo'yadi, tor task yozadi) hamon ko'p-fayllik/
  murakkab ishlar uchun zarur, lekin bir-fayllik/oddiy ishlarda endi
  **Orcestor'siz ham**, global `GEMINI.md` orqali asosiy xavfsizlik
  qatlami (tashxissiz edit qilmaslik) ta'minlanadi — bu `agy_upgrading`ning
  boshlang'ich maqsadiga ("Orcestor'siz ham ishonchli qilish") kutilganidan
  yaqinroq natija berdi. Triage jadvali ([3.3-band](./03-taklif-qilingan-yechim.md#33-xarajat-nazorati--triage-strategiyasi))
  shunga mos yangilanishi kerak (hali qo'lda yangilanmagan — pastga qarang).

## Keyingi qadamlar (Foydalanuvchi vaqt topganda)

1. ~~Global `~/.gemini/GEMINI.md`ni headless rejimda sinash~~ — ✅ BAJARILDI
   VA DOIMIY QABUL QILINDI (Test 10, 12, 13; Foydalanuvchi tasdig'i:
   2026-08-08). Ikkita qoida ("avval tashxis qo'y", "tushunganini qisqa
   ayt") endi Foydalanuvchining global `~/.gemini/GEMINI.md` faylida
   **doimiy** turibdi (asl holat zaxirasi: `<scratchpad>/GEMINI.md.orig_backup`,
   kerak bo'lsa qaytarish uchun).
2. **3.2-banddagi ohang/persona blokini ham global faylga qo'shib sinash** —
   endi mexanizm (global `GEMINI.md` headless'da ishlashi) tasdiqlangani
   uchun, bu blokni ham xuddi shunday qo'shib, sycophancy'ga ta'sirini
   alohida test bilan tekshirish mumkin (hali qilinmagan).
3. **`3.3-banddagi triage jadvalini yangilash`** — endi "bir-fayllik ishlar
   uchun promptga qo'lda qo'shish" emas, "global GEMINI.md avtomatik
   qamrab oladi" tamoyiliga mos yozilishi kerak (hali qo'lda yangilanmagan).
4. **`zdes_frontend/orcestor/standing_rules.json`ga eslatma qo'shish** — bu
   endi ikkilamchi ahamiyatga ega (asosiy himoya global faylda), lekin
   baribir Orcestor_Agent uchun "global GEMINI.md'ga tayaniladi, shuning
   uchun bu qoidalar ham bor" degan qisqa izoh foydali bo'lishi mumkin.
5. **Interaktiv rejimni tekshirish** — barcha 13 test headless (`-p`)
   rejimda o'tkazilgan. Antigravity IDE/CLI'ning interaktiv oynasida
   `request-review`/`/plan`/Artifact Review sozlamalari haqiqatan
   ishlaydimi — bu hali tasdiqlanmagan.
6. **`/learn` va `/grill-me` buyruqlarini tekshirish** — bular AGY'ning
   rasmiy buyruqlarimi yoki o'zi to'qigan narsami
   ([4.6-band, ochiq savol](./04-taxminlar-va-tekshirish.md#46-real-kuzatilgan-dalil--faktik-chekinish-2026-08-08-jonli-suhbat)).
7. **4.9-banddagi "uchinchi tomonga nozik salbiy ramkalash"** gipotezasini
   qo'shimcha misollar bilan tekshirish — bitta hodisami yoki naqshmi.
8. **Bir haftalik amaliy sinovdan keyin** — global qoidalarning real
   xarajat/sifatga ta'sirini Foydalanuvchi subyektiv baholasin, natija shu
   faylga qo'shiladi.

## Status izohi

Bu papka **statik emas** — Foydalanuvchi yangi vaziyat/muammo bergan sari
mavjud fayllarga qo'shimcha qilinadi yoki yangi raqamlangan fayl ochiladi
(rad etilganlar "❌ RAD ETILDI" deb belgilanadi, o'chirilmaydi —
`claude_tasks` konvensiyasiga mos). 2026-08-08'da bu naqsh birinchi marta
amalda ko'rindi: [3-bo'lim](./03-taklif-qilingan-yechim.md)dagi ikkita band
real testlar bilan qisman rad etildi, lekin matn o'chirilmadi — ustiga
tuzatish yozildi.
