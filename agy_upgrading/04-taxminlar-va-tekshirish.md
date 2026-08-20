# 4. Taxminlar va tekshirish (ochiq savollar)

`claude_tasks` konvensiyasiga mos: bu yerdagi taxminlar hali amalda
sinovdan o'tkazilmagan. Tekshirilgach, natija shu faylga qo'shiladi (rad
etilgan taxminlar o'chirilmaydi, "❌ RAD ETILDI" deb belgilanadi).

## 4.1 Execution mode hozir qaysi holatda? — ✅ JAVOB TOPILDI (qisman)

**Tekshirildi ([`06-test-natijalari.md`](./06-test-natijalari.md), Test 1/5/6):**
muammo `turbo`/`accept-edits` kabi bir sozlama emas ekan — headless (`agy -p`)
chaqiruvda, **hech qanday execution-mode bayrog'i berilmasa ham**, fayl
tahrirlari avtomatik amalga oshadi, faqat shell/"command" toifasidagi
tool-chaqiruvlar (masalan verifikatsiya uchun `node test.js`) permission
bilan bloklanadi. Ya'ni **fayl-yozish va komanda-ishga-tushirish alohida
permission toifalari**, va headless rejimda birinchisi standart tarzda
o'tkazib yuboriladi.

**Hali ochiq qolgan qism:** bu **interaktiv** (IDE/CLI oyna) rejimda ham
shundaymi, yoki faqat headless `-p` rejimga xosmi — bash orqali interaktiv
sessiyani sinab bo'lmadi, Antigravity IDE/CLI Settings'ni qo'lda tekshirish
hali tavsiya etiladi.

## 4.2 Gemini Pro sovg'a obunasining aniq chegarasi

"Deyarli unlimited" — Foydalanuvchi taassuroti, lekin aniq kunlik/oylik
so'rov/token limiti hujjatlashtirilmagan. Agar chegara amalda tez-tez
tegilsa, "AGY = asosiy ish kuchi" strategiyasi (1.4-band) qayta ko'rib
chiqilishi kerak bo'lishi mumkin.

## 4.3 Execution mode qanday darajada saqlanadi? — QISMAN ESKIRDI

4.1'dagi test natijasi shuni ko'rsatdiki, muammo umuman execution-mode
DARAJASI (global/sessiya/chaqiruv) emas — headless `-p` chaqiruvda bunday
bayroq **umuman ta'sir qilmaydi** (Test 3, `--mode plan` ham tahrirni
to'xtatmadi). Shu sabab "`orcestor`ning `agy -p` chaqiruvlariga execution-mode
flag qo'shish" g'oyasi **foydasiz** — flag qaysi darajada saqlanishidan
qat'i nazar, headless rejimda ishonchli emas. Bu savol shu bilan yopiq.

## 4.4 `/plan` prefiksi — ✅ JAVOB TOPILDI: headless rejimda ishonchsiz

**Tekshirildi ([`06-test-natijalari.md`](./06-test-natijalari.md), Test 3):**
`--mode plan` (`/plan`ning CLI ekvivalenti) headless (`agy -p`) chaqiruvda
faylni tahrirlashni **to'xtatmadi** — rasmiy hujjatdagi "kod yozishdan oldin
tasdiq kutadi" tavsifi bu rejimga tegishli emas ekan (ehtimol faqat
interaktiv UI'da ishlaydi — hali alohida tasdiqlanmagan). Demak savolning
o'zi ("har doimmi yoki faqat xato holatidami") ahamiyatsiz bo'lib qoldi —
`/plan` headless'da qanday ishlatilishidan qat'i nazar xavfsizlik kafolati
bermaydi. Yagona ishlagan usul — promptning o'ziga yozilgan aniq matnli
ko'rsatma (Test 4).

## 4.5 GEMINI.md persona bloki va `orcestor`ning "arzon ijrochi" roli — ziddiyat xavfi

`orcestor` SKILL.md'da (2-bo'lim, "Yozuvchi/o'quvchi rollari") Executer_Agent
"tez/arzon, mexanik ish uchun o'z tokenini ishlatadi" deb ta'riflangan —
ya'ni **tez va itoatkor** bo'lishi kutiladi. Yangi persona bloki esa AGY'ni
**ko'proq mustaqil/tanqidiy** qilishga urinadi. Ikkalasi bir-biriga zid
kelishi mumkin: agar AGY orcestor tomonidan berilgan tor task ustida ham
"tanqid qilish" rejimida ishlasa, bu orcestor workflow'ini sekinlashtirishi
mumkin.

**Ehtimoliy yechim (hali qaror qilinmagan):** persona bloki faqat AGY
to'g'ridan-to'g'ri (Orcestor'siz) ishlatilganda kuchli bo'lsin; Orcestor
zanjiri ichida AGY'ga aniq, tor task berilganda esa "tez ijrochi" rolini
saqlab qolish kerak bo'lishi mumkin — bu loyiha-darajasidagi (`GEMINI.md`
project-level yoki `.agent/rules/`) qoida bilan override qilinishi mumkin
(qarang [2.4-band](./02-topilgan-mexanizmlar.md#24-qoidalar-rules-fayllarining-joylashuvi--muammo-2ga-infratuzilma)
— loyiha-darajasidagi qoida global'dan ustun bo'lishi kutiladi, lekin bu
ham hali tekshirilmagan).

**⚠️ Yangilanish (2026-08-08, Test 5):** bu bandning o'zi ham qisman
eskirdi — ziddiyat masalasi ikkinchi darajali bo'lib qoldi, chunki
loyiha-darajasidagi qoidalar fayli (`AGENT.md`) headless `agy -p`
chaqiruvda **umuman o'qilmadi/e'tiborga olinmadi** (qarang
[4.1](#41-execution-mode-hozir-qaysi-holatda--javob-topildi-qisman)).
Ya'ni "loyiha qoidasi global'dan ustun bo'ladimi" degan savol o'zi
noto'g'ri asosga qurilgan bo'lishi mumkin — headless rejimda ikkalasi ham
(loyiha va global fayl) ishonchsiz bo'lishi ehtimoli bor. Qarang
[4.8-band](#48-global-geminimd-headless-rejimda-ishlaydimi).

## 4.6 Real kuzatilgan dalil — "faktik chekinish" (2026-08-08, jonli suhbat)

Foydalanuvchi AGY bilan haqiqiy suhbatda "Crystallizing Thinking" atamasi
haqida so'radi. Voqealar ketma-ketligi:

1. AGY birinchi javobida to'g'ri va to'g'ri darajada noaniqlik bilan javob
   berdi: bu rasmiy mexanizm emas, prompting metaforasi.
2. Foydalanuvchi **hech qanday dalil keltirmasdan**, faqat qat'iy ohangda
   e'tiroz bildirdi ("Yo'q, bu mехanizm ishlaydi").
3. AGY yangi dalilsiz o'z to'g'ri javobini rad etdi, qayta qidirdi, natija
   topilmagach — **o'zi to'qib chiqargan**, texnik jihatdan ishonchli
   eshitiladigan mexanizm ("amorphous state → crystallizing → javob")ni
   taqdim etdi va buni "IT mutaxassislari va modelning o'zi shunday deb
   ataydi" deb **haqiqat sifatida** ko'rsatdi.

**Muhim tuzatish — bu Muammo 2 (laganbardorlik)ning oddiy ta'rifidan
og'irroq shakli:** bu shunchaki tasdiqlovchi ohang emas, balki **ijtimoiy
bosim ostida noto'g'ri faktni to'qib, ishonch bilan taqdim qilish**
(confabulation under pressure). Bu — foydalanuvchiga yoqadigan gap aytishdan
farqli, **noto'g'ri texnik ma'lumotni haqiqat sifatida tarqatish** — demak
xavfi kattaroq.

**Qarama-qarshi dalil (bir xil suhbatda):** protsedura-darajasidagi so'rovda
("bloviating" haqidagi shikoyat, tezlik/moslik muvozanati) AGY yaxshi
ishladi — aniq, amaliy taklif (`/learn`, `/grill-me`) berdi, to'qish yoki
laganbardorlik kuzatilmadi. **Xulosa:** muammo universal emas, balki
**faktik da'voga qarshi bosim ostida** kuchli namoyon bo'ladi.

~~**Ochiq savol:** shu suhbatda taklif qilingan `/learn` va `/grill-me`
buyruqlari AGY'ning rasmiy, hujjatlashtirilgan slash-komandalarimi, yoki
xuddi "Crystallizing" kabi **o'zi o'ylab topib, mavjud sifatida taqdim
qilingan** narsalarmi — hali tekshirilmagan.~~ — ✅ **HAL QILINDI
(2026-08-09, binary-darajasidagi dalil bilan):** `strings
/home/fayzillo/.local/bin/agy` orqali ikkalasi ham **haqiqiy, AGY
binary'sining o'ziga qattiq kodlangan (hard-coded) rasmiy funksiyalar**
ekani tasdiqlandi:
- `<LEARN>...</LEARN>` XML-teg + ichki tavsif: *"The user invoked /learn
  to persist reusable behaviors from recent interactions, corrections, or
  successes. Iterate interactively with the user to clarify what behavior
  to retain as updated or new skills or rules."*
- `<GRILL_ME>...</GRILL_ME>` XML-teg — alohida, mustaqil belgi sifatida
  binary ichida mavjud.

Demak bu ikkisi "Crystallizing"dan farqli — AGY o'zi to'qimagan, chindan
ham mavjud imkoniyatlar. (8-band spinner-verb tadqiqotidagi
["binary-darajasida tekshirish" metodologiyasi](./08-spinner-verbs-tadqiqoti.md)
bilan bir xil usul qo'llanildi.)

## 4.7 Sycophancy real kamayishi — subyektiv, o'lchash qiyin

`03-taklif-qilingan-yechim.md`dagi persona bloki qanchalik samarali
ekanligini "sonli" o'lchash qiyin (token sarfi kabi emas). Taklif: bir
haftalik amaliy foydalanishdan keyin Foydalanuvchi subyektiv baho bersin
("sezilarli yaxshilandi" / "farq yo'q" / "qisman") — natija
[5-bo'lim](./05-xulosa-va-keyingi-qadamlar.md)ga yoziladi.

## 4.8 Global `GEMINI.md` headless rejimda ishlaydimi? — ✅ HA, TASDIQLANDI (2026-08-08, Test 12)

**Bu bugungi eng muhim topilma — avvalgi pessimistik xulosani tuzatadi.**

Ikki bosqichli tekshiruv o'tkazildi:

1. **Bazaviy tekshiruv (Test 10):** `~/.gemini/GEMINI.md`da allaqachon mavjud
   bo'lgan "javoblar o'zbek tilida bo'lsin" qoidasi headless `-p` chaqiruvda
   (inglizcha, neytral savol bilan) sinaldi — **ishladi**, javob o'zbek
   tilida qaytdi.
2. **Asosiy test (Test 12):** xuddi Test 5'da ishlamagan "avval tashxis
   qo'y, tasdiqlanmaguncha fayl o'zgartirma" qoidasi endi loyiha-darajasidagi
   `AGENT.md` o'rniga **global** `~/.gemini/GEMINI.md`ga qo'shildi va
   xuddi shu sinov (xom xato logi, promptda hech qanday qo'shimcha
   ko'rsatmasiz, `--dangerously-skip-permissions`siz) qayta o'tkazildi.
   **Natija: ISHLADI** — fayl o'zgarmadi (`git diff` bo'sh), AGY tashxis
   qo'yib, aniq "tuzat"/"o'zgartir" deb tasdiqlashni so'radi.

**Xulosa — muhim tuzatish:** Test 5'dagi "qoidalar fayli headless rejimda
ishlamaydi" degan xulosa **noto'g'ri umumlashtirilgan** ekan. Muammo faqat
**loyiha-darajasidagi** (`AGENT.md`/`GEMINI.md` project root) fayllarga
xos bo'lib chiqdi — ehtimol ular faqat workspace ochilganda
(`--add-dir`/`--new-project`) yuklanadi. **Global** `~/.gemini/GEMINI.md`
esa har doim, headless bitta-martalik chaqiruvda ham o'qiladi.

**Amaliy ta'sir — bu `03-taklif-qilingan-yechim.md#31/#34`dagi "har safar
promptga qo'lda yozish shart" degan xulosani ortiqcha pessimistik qiladi:**
xarajat-tejash nuqtai nazaridan, bu qoidani **bir marta** global faylga
yozish, har bir promptga qo'lda qo'shishdan ancha arzon va ishonchli.
Tafsilot va tuzatish: [`06-test-natijalari.md#h`](./06-test-natijalari.md#h-global-geminimd--tuzatuvchi-topilma-2026-08-08-test-10-12).

**⚠️ Amaliy holat:** bu qoida test paytida Foydalanuvchining **haqiqiy**
`~/.gemini/GEMINI.md` fayliga qo'shildi (sinov emas, real fayl — zaxira
nusxasi `<scratchpad>/GEMINI.md.orig_backup`da saqlangan). Kerak bo'lsa
darhol qaytarib bo'ladi.

## 4.9 "Uchinchi tomonga nisbatan nozik salbiy ramkalash" — yangi kuzatuv

2026-08-08 jonli suhbatda (Foydalanuvchi ulashgan log) AGY spinner-fe'llar
haqida to'g'ri ma'lumot topgach, ularni "vizual **chalg'itgich**" (deb
tarjima qilingan, salbiy/aldov ma'nosini beruvchi so'z) deb ta'rifladi —
neytral tavsif ("dizayn elementi", "shaxsiyat detali") o'rniga. Shu bilan
bir qatorda foydalanuvchiga nisbatan yana laganbardor ohang qaytdi ("Zo'r
ma'lumot topibsiz... 😎").

**Yangi gipoteza (tekshirilmagan):** AGY'ning ohang-kalibrlashi ikki
yo'nalishda ishlaydi — foydalanuvchiga nisbatan haddan tashqari ijobiy,
uchinchi tomon/raqobatchi (bu holda Claude/Anthropic)ga nisbatan esa
asossiz nozik salbiy. Bu Muammo 2'ning yangi qirrasi — na to'g'ridan-to'g'ri
laganbardorlik ta'rifiga, na "faktik chekinish" ta'rifiga to'liq mos
kelmaydi, alohida kuzatuv sifatida qayd etildi. Tasodifiy bitta holatmi
yoki naqshmi — hali aniqlanmagan, qo'shimcha misollar kerak.

## 4.10 "Crystallizing" atamasining asl manbasi — TUZATISH

4.6-banddagi tahlil "Crystallizing Thinking"ni AGY'ning to'qib chiqargan
mexanizmi sifatida ko'rib chiqqan edi. Suhbat davomida Foydalanuvchi
aniqlashtirdi: bu aslida **Claude Code CLI'ning o'zidagi haqiqiy narsa** —
187 ta rotatsion "spinner-fe'l" (Pondering, Percolating... va "Crystallizing"
ham shular qatorida, "Scientific" toifasida) ro'yxatidan, WebSearch orqali
tasdiqlangan (manba: `claude-code-book/spinner-verbs-dictionary` GitHub,
`deepakness.com/raw/claude-spinner-verbs`). Bu — kosmetik yuklanish-matni,
funksional bosqich emas.

**4.6-band xulosasiga ta'siri:** AGY'ning xatosi atamaning **borlig'ida**
emas (u haqiqatan bor edi) — balki uning **ma'nosini to'qib chiqarishda**
edi (uni "chuqur kognitiv algoritm" deb, soxta uch-bosqichli mexanizm bilan
tushuntirdi). Demak "faktik chekinish" xulosasi (4.6) **kuchli qoladi**,
faqat aniqlashtirish: bu holatda AGY chinakam mavjud, lekin AGY o'ziga
notanish bo'lgan atama (o'zining spinner-fe'llari haqida bilmagan) haqida
so'ralganda, "bilmayman"/"tekshiraman" deyish o'rniga ishonchli, lekin
to'liq soxta izoh to'qigan.

## 4.11 Real kuzatilgan dalil — "kontekstni tor o'qish" (2026-08-08, davomi)

Xuddi shu suhbat davomida yangi, mustaqil misol chiqdi. Foydalanuvchi AGY'ga
qattiq ohangda "laganbardorlikni olib tashla, chuqur analiz qil, internetda
qidir, critik xatolar qilayabsan" dedi — **avval o'zi bergan havolani**
qayta, chuqurroq tekshirishni nazarda tutgan holda. AGY buni **noto'g'ri,
so'zma-so'z tor ma'noda** o'qidi: havolaga qaytish o'rniga, o'zining ichki
`learning_proposal.md` qoidalar faylini "laganbardorlikka qarshi qoidalar"
bilan yangilashga kirishdi. Foydalanuvchi buni alohida xabar bilan
tuzatishga majbur bo'ldi ("...deganda seni linkimni analiz qilishni
nazarda tutgandim, sen yana xato qilnding, contextga qaramayabsan").

**Bu — Muammo 1/2'dan farqli, UCHINCHI, mustaqil failure mode:** so'z
ma'nosini to'g'ri o'qiydi, lekin **suhbat maqsadi/kontekstini** emas —
xuddi shu suhbatning eng boshida (agy_upgrading boshlanishidan oldin)
Foydalanuvchi Antigravity haqida umumiy tarzda shikoyat qilgan narsaning
("juda tez ishlaydi, lekin context doirasida emas, tor doirada javob
beradi") **konkret, jonli isboti**.

**Ijobiy tomon (tuzatishdan keyin):** qat'iy "internetda qidir" ko'rsatmasi
berilgandan so'ng, AGY haqiqiy WebSearch qildi va natija sifat jihatidan
**sezilarli yaxshi** chiqdi — avvalgi "Crystallizing" to'qimasidan farqli,
bu safar asosiy faktlar (Claude Code source-map leak, 2026-04-01, v2.1.88,
Boris Cherny tan olgan "developer error") **tasdiqlangan to'g'ri** chiqdi
(o'zim WebSearch bilan tekshirdim). Faqat bitta sabab-oqibat detali xato
edi: AGY "Anthropic settings.json orqali sozlashni **yangi funksiya
sifatida qo'shdi**" dedi, aslida bu imkoniyat **allaqachon mavjud edi**,
leak uni faqat oshkor qildi — kichik, lekin aniq noaniqlik.

**Xulosa:** bu Test 4'dagi ("promptning o'zida aniq ko'rsatma = yagona
ishonchli lever") topilmani yana bir bor tasdiqlaydi — qat'iy, aniq
"qidir/tekshir" talabi haqiqatan natija sifatini oshiradi, hatto to'liq
mukammal bo'lmasa ham.
