# 3. Taklif qilingan yechim

**Holat: TAKLIF — hali `~/.gemini/GEMINI.md`ga yozilmagan, Foydalanuvchi
tasdig'ini kutmoqda.**

Yechim ikki mustaqil qatlamdan iborat — biri xatti-harakatni (Muammo 1), biri
ohangni (Muammo 2) tuzatadi. Ikkalasi ham [2-bo'limda](./02-topilgan-mexanizmlar.md)
topilgan rasmiy mexanizmlarga tayanadi, qo'shimcha LLM chaqiruvi (demak
xarajat) talab qilmaydi.

## 3.1 Xatti-harakat qatlami — Muammo 1 uchun

**❌ QISMAN RAD ETILDI (2026-08-08, real testlar bilan) — pastga qarang.**

Boshlang'ich taklif uchta sozlamani birga qo'llash edi:
1. ~~Execution mode = `request-review`~~
2. ~~Xato logi berilganda har doim `/plan` prefiksi bilan yuborish~~
3. ~~Artifact Review = `Request Review`~~

Bu taklif **interaktiv UI** uchun mo'ljallangan rasmiy hujjatlarga
asoslangan edi. Lekin [`06-test-natijalari.md`](./06-test-natijalari.md)da
7 ta real test o'tkazildi (`agy -p` orqali, xuddi `orcestor`ning o'zi
ishlatadigan headless chaqiruv uslubida) va natija boshqacha chiqdi:

- `--mode plan` bayrog'i headless (`-p`) rejimda tahrirni **to'xtatmadi**
  (Test 3).
- Loyihaviy qoidalar fayli (`AGENT.md`, xuddi shu "avval tashxis qo'y"
  qoidasi bilan) headless bitta-martalik chaqiruvda **ishlamadi** (Test 5).
- **Yagona ishonchli lever** — promptning o'ziga yozilgan aniq matnli
  ko'rsatma bo'lib chiqdi (Test 4): `"MUHIM QOIDA: hech qanday faylni
  o'zgartirma, faqat tashxis qo'y..."` — bu ishladi, boshqa hech narsa
  ishonchli ishlamadi.

**Tuzatilgan xulosa:** headless/orcestor-uslubidagi (`agy -p ...`)
chaqiruvlarda Muammo 1'ni sozlama (CLI flag yoki qoidalar fayli) orqali
YECHIB BO'LMAYDI — faqat **har safar tor, aniq, matnli task** (aynan
`orcestor` SKILL.md'ning qilayotgan ishi) ishonchli natija beradi. Demak bu
band `agy_upgrading`ning "Orcestor'siz, sozlama orqali ishonchli qilish"
degan boshlang'ich maqsadini qisman inkor etadi — batafsil:
[`06-test-natijalari.md#d`](./06-test-natijalari.md#d-yagona-ishonchli-lever--prompt-matnining-ozi).

**Interaktiv rejim uchun eslatma:** yuqoridagi uchta sozlama (`request-review`,
`/plan`, Artifact Review) **interaktiv** foydalanishda (siz to'g'ridan-to'g'ri
Antigravity oynasida yozganingizda) hali ham foydali bo'lishi mumkin — bu
hali sinovdan o'tkazilmagan (bash orqali interaktiv sessiyani test qilib
bo'lmadi). Faqat headless/`agy -p` chaqiruvlar uchun bu band rad etildi.

**✅ YANGILANDI (2026-08-08, Test 10/12) — "faqat prompt ishlaydi" xulosasi
qisman ortiqcha pessimistik edi.** Test 5 loyiha-darajasidagi `AGENT.md`ni
sinagan edi. **Global** `~/.gemini/GEMINI.md`ga xuddi shu "avval tashxis
qo'y" matni qo'shilganda — headless `-p`da, promptda hech qanday
qo'shimchasiz **ISHLADI** (tafsilot: [`06-test-natijalari.md#h`](./06-test-natijalari.md#h-global-geminimd--tuzatuvchi-topilma-2026-08-08-test-10-12)).

**Amaliy natija:** eng arzon va ishonchli yechim — bu qoidani **bir marta**
`~/.gemini/GEMINI.md`ga yozish, promptga har safar qo'lda qo'shishdan ko'ra.
**Foydalanuvchi tasdig'i (2026-08-08):** bu qoida doimiy saqlab qolinsin
deb qaror qilindi — endi Foydalanuvchining global faylida **doimiy**
turibdi (asl holat zaxirasi: `<scratchpad>/GEMINI.md.orig_backup`).

## 3.2 Ohang/fikrlash qatlami — Muammo 2 uchun

`~/.gemini/GEMINI.md` (global, barcha loyihalarga tegishli — `orcestor`dagi
loyihaga-xos qoidalar bilan ARALASHTIRILMAYDI) fayliga qo'shiladigan blok:

```markdown
## Muloqot uslubi va fikrlash tarzi (barcha loyihalar uchun majburiy)

1. **Laganbardorlik taqiqlanadi.** "Ajoyib savol!", "Zo'r fikr!", "Juda to'g'ri!"
   kabi bo'sh tasdiqlovchi iboralar ishlatilmasin. Fikr to'g'ri bo'lsa ham,
   sabab ko'rsatilmasdan faqat maqtash — foydasiz.

2. **Muvozanatli tanqid majburiy.** Foydalanuvchi yechim yoki kod taklif
   qilsa, avval uning zaif tomoni/xavfi bormi tekshirilsin va ochiq
   aytilsin — keyin rozi bo'linsin yoki rozi bo'linmasin. "Rozi bo'lish
   uchun rozi bo'lish" yo'q.

3. **Kontekst sintezi majburiy.** Har javobdan oldin joriy sessiyadagi
   OLDINGI xabarlar, tanlangan yechimlar va cheklovlar hisobga olinsin —
   faqat oxirgi xabar doirasida emas.

4. **Noaniqlik ochiq aytilsin.** Agar biror faktda ishonch past bo'lsa,
   "menimcha", "tasdiqlanmagan", "tekshirish kerak" kabi belgilar bilan
   ko'rsatilsin — ishonchli ohangda noto'g'ri taxmin qilishdan ko'ra
   yaxshi.

5. **Qisqa va londa.** Keraksiz kirish so'zlar, xulosa takrorlash,
   "umid qilamanki foydali bo'ldi" kabi yopuvchi jumlalar yo'q. To'g'ridan
   -to'g'ri javob, kerak bo'lsa struktura (bullet/raqam) bilan.

6. **Ijro emas — avval tashxis.** Xato/log berilganda, ANIQ so'ralmaguncha
   fayl o'zgartirilmasin — avval sabab, ta'sir doirasi va taklif qilingan
   yechim bayon qilinsin (bu qoida `/plan` rejimi bilan birga ishlaydi,
   qarang [3.1](#31-xatti-harakat-qatlami--muammo-1-uchun)).
```

**Halol ogohlantirish (Foydalanuvchiga shu suhbatda aytilgan):** bu blok
sycophancy'ni sezilarli kamaytiradi, lekin **butunlay yo'q qilmaydi** —
laganbardorlik ko'p jihatdan modelning o'zi (RLHF darajasida) o'rgatilgan
xususiyat, prompt buni faqat bostiradi. To'liq Claude-darajasidagi muvozanatni
kutish noto'g'ri kutish bo'lardi.

**⚠️ Tuzatish (2026-08-08, Test 5 asosida) — bu blok headless (`agy -p`)
chaqiruvlarda ISHLAMASLIGI MUMKIN.** Test 5 loyiha-darajasidagi `AGENT.md`
qoida faylini sinadi (xuddi shu turdagi "avval tashxis qo'y" ko'rsatmasi
bilan) — u bitta-martalik `-p` chaqiruvda e'tiborga olinmadi (6-band, "Ijro
emas — avval tashxis" qoidasi buzildi). **Global `~/.gemini/GEMINI.md` hali
alohida sinovdan o'tkazilmagan** — ehtimol global config boshqacha
yuklanish yo'liga ega (masalan interaktiv sessiyada ishlashi mumkin), lekin
bu hozircha tasdiqlanmagan taxmin. Shu sabab bu blokni yozishdan oldin
alohida test o'tkazish tavsiya etiladi (qarang
[4.8-band](./04-taxminlar-va-tekshirish.md#48-global-geminimd-headless-rejimda-ishlaydimi)).
Ohang-qatlami (laganbardorlik) interaktiv sessiyalarda foydali bo'lishi
mumkin, lekin `orcestor`ning headless `agy -p` chaqiruvlariga bu orqali
tayanib bo'lmaydi.

## 3.3 Xarajat-nazorati — triage strategiyasi

**❌ QISMAN RAD ETILDI (2026-08-08, real testlar bilan).**

Boshlang'ich taklif — bir-fayllik ishlarni to'g'ridan-to'g'ri AGY'ga
(`/plan` prefiksi bilan, Orcestor zanjirisiz) yo'naltirish edi. Lekin
[`06-test-natijalari.md`](./06-test-natijalari.md) Test 3 shuni ko'rsatdiki,
`/plan`/`--mode plan` headless rejimda tahrirni **to'xtatmaydi** — demak bu
"tezkor yo'l" xavfsiz emas edi, chunki hech qanday haqiqiy to'siq
bermaydi.

**Tuzatilgan strategiya:** triage mezoni o'zgarmaydi (bir-fayllik vs
ko'p-fayllik), lekin "tezkor yo'l" endi boshqacha ta'riflanadi — Orcestor
zanjirisiz to'g'ridan-to'g'ri AGY'ga murojaat qilinganda ham, **promptning
o'ziga** (Test 4'da tasdiqlangan yagona ishonchli usul) aniq "avval tashxis
qo'y, tasdiqlanmaguncha fayl o'zgartirma" ko'rsatmasi qo'lda qo'shilishi
SHART. Bu aslida Orcestor'ning qisqartirilgan, bir martalik versiyasi —
to'liq task-fayl/tracking bosqichisiz, lekin xavfsizlik toifasi (matnli
ko'rsatma) saqlangan holda:

| Ish turi | Yo'nalish |
|---|---|
| Bir-fayllik/oddiy (build error, lint, typo, import xatosi) | To'g'ridan-to'g'ri AGY, lekin promptda **majburiy** "avval tashxis, keyin tasdiq" matni bilan, Orcestor task-tracking'isiz |
| Ko'p-fayllik/arxitektura darajasida | To'liq Orcestor zanjiri (Claude tashxis → task fayl → AGY ijro) |

`zdes_frontend/orcestor/standing_rules.json`ga taklif qilingan yangi qator
(hali qo'shilmagan, tuzatilgan matn bilan):

```json
{
  "topic": "error-triage-cost-control",
  "rule": "Bir-fayllik/oddiy build yoki lint xatolarida to'liq Orcestor task-tracking pipeline ishlatilmaydi, lekin xato logi Executer_Agent'ga HECH QACHON xom holda yuborilmaydi — promptga har doim aniq matnli qoida qo'shiladi: 'avval tashxis qo'y va yechim taklif qil, aniq tasdiqlanmaguncha fayl o'zgartirma'. CLI bayroqlari (--mode plan) yoki qoidalar fayllari (AGENT.md) bunga headless rejimda ishonchli almashtiruvchi EMAS (tasdiqlangan: 06-test-natijalari.md). Faqat ko'p-fayllik yoki arxitektura darajasidagi ishlar uchun to'liq Orcestor zanjiri ishlatiladi."
}
```

## 3.4 "Tushunganini qisqa ayt / noaniq bo'lsa so'ra" — Foydalanuvchi taklifi (2026-08-08, test bilan tasdiqlangan)

**Holat: ✅ TASDIQLANGAN ([`06-test-natijalari.md#g`](./06-test-natijalari.md#g-tushunganini-aytishnoaniq-bolsa-sorash--foydalanuvchi-taklifi-tasdiqlangan-2026-08-08), Test 8-9) — amalga oshirish uchun tayyor.**

Foydalanuvchi taklifi: har bir task matniga standart qoida sifatida
qo'shiladigan qism — AGY ish boshlashdan oldin nimani tushungani va nimani
noaniq deb hisoblab taxmin qilib boshlamoqchi ekanini **qisqa (10-15 so'z)**
aytsin; muhim narsa noaniq bo'lsa, ishni **boshlamasdan** aniq savol
bersin. Mantiq: bu — butun kontekstni qayta yuklashdan (qimmat) arzonroq,
tor-doira xatolarining oldini oluvchi vosita.

**Test natijasi:** ikkala test holatida ham (noaniq va aniq vazifa) ishladi
— AGY yo to'g'ri savol berdi, yo qisqa tushuncha-preambulasi bilan davom
etdi, fayl hech qachon so'ralmagan holda o'zgarmadi. **Ikkita cheklov
bilan:** (1) "10-15 so'z" qat'iy sonli chegara sifatida ushlanmadi — AGY
"qisqa" tushunchasini tushunadi, lekin aniq son emas; (2) "tekshirdim"
degan da'volar hamon mustaqil tasdiqlashsiz qoladi (bog'liq: 3.1-band,
band E).

**Qo'shiladigan standart shablon** (Orcestor_Agent har bir `agy -p` task
matniga qo'shadi — 3.1-banddagi "avval tashxis" qoidasi bilan birlashtirilib):

```
QOIDA: Ish boshlashdan oldin, nimani tushunganingizni va nimani aniq
bilmay taxmin qilib boshlamoqchi ekaningizni qisqa (bir-ikki qisqa gap)
o'zbek tilida ayting. Agar muhim tafsilot noaniq bo'lsa, ishni
BOSHLAMASDAN aniq savol bering, taxmin qilmang.
```

(So'z-chegarasi "10-15 so'z" emas, "bir-ikki qisqa gap" deb yumshatildi —
test natijasiga ko'ra qat'iy sonli chegara baribir ushlanmaydi, aniqroq
va real kutish shu.)

**✅ YANGILANDI (2026-08-08, Test 13, Foydalanuvchi tasdiqlagan):** bu qoida
ham global `~/.gemini/GEMINI.md`ga qo'shilib sinaldi (3.1-banddagi "avval
tashxis" qoidasi bilan bir qatorda) — **ishladi**, promptda hech qanday
takrorlashsiz, va Foydalanuvchi buni doimiy saqlab qolishni tanladi. Demak
bu ikkala qoida ("avval tashxis" + "tushunganini qisqa ayt")
**Orcestor_Agent tomonidan har task matniga qo'lda qo'shilishi shart
EMAS** — ikkalasi ham global faylda **doimiy** turibdi, barcha `agy -p`
chaqiruvlarda (Orcestor orqali ham, to'g'ridan-to'g'ri ham) avtomatik amal
qiladi. Bu — eng arzon, bir martalik yechim, hozir amalda.

`standing_rules.json`dagi `error-triage-cost-control` qoidasiga shu shablon
ham qo'shilishi kerak (hali qo'shilmagan, Foydalanuvchi tasdig'ini kutmoqda).
