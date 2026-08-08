---
name: agy-align
description: AGY (Antigravity CLI)ning global xatti-harakat qoidalarini (~/.gemini/GEMINI.md) o'rnatadi yoki mavjudini eng so'nggi versiyaga yangilaydi — tashxissiz fayl tahririni oldini oladi va tushunishni tasdiqlash odatini joriy qiladi. "agy-align o'rnat", "agy-align ishga tush", "AGY qoidalarini yangila/sinxronla", "install agy-align" kabi so'rovlarda ishlatiladi.
---

# agy-align — AGY global xatti-harakat sozlovchisi

Bu skill AGY'ning o'zi (Executer_Agent) tomonidan bajariladi — Claude yoki
boshqa Orcestor_Agent emas. Maqsad: real testlar bilan tasdiqlangan
xatti-harakat qoidalarini global `~/.gemini/GEMINI.md` fayliga
o'rnatish/yangilash — bir marta bajarilsa, barcha keyingi loyihalar va
headless (`agy -p`) chaqiruvlarda avtomatik amal qiladi. To'liq dalil va
metodologiya uchun qarang: shu skill papkasidagi
[`REPORT.md`](./REPORT.md) — mustaqil hujjat, tashqi papkaga bog'liq emas.

## Bajarish qadamlari

**Muhim tartib:** avval nishon faylni O'QING (1-2-qadam), keyingina
qaror qabul qiling (3-4-qadam) — teskari tartibda emas, aks holda hali
fayl holati noma'lum bo'lganda savol berish/bermaslikka noto'g'ri qaror
qilish xavfi bor.

1. **Nishon faylni aniqla va o'qi:** `~/.gemini/GEMINI.md` (`~` — joriy
   foydalanuvchi uy papkasi, aniq mutlaq yo'lga kengaytiring). Fayl mavjud
   bo'lsa, to'liq o'qing va quyidagilarni aniqlang: (a) `<!-- agy-align:vN
   start -->` markeri bor-yo'qligi va versiya raqami `N`, (b) agar bor
   bo'lsa, marker ichida `optional-start`/`optional-end` bo'limi ham
   borligi (bu — oldingi o'rnatishda 3-4-band tanlangani-tanlanmaganining
   dalili).

2. **Payload'ni o'qi:** shu skill papkasidagi
   [`rules/global-rules.md`](./rules/global-rules.md) faylini o'qing.

3. **Ixtiyoriy bandlar haqida qaror:**
   - **Yangilash (1-qadamda marker allaqachon topilgan bo'lsa):** savol
     berilmaydi — 1-qadamda aniqlangan oldingi tanlov (optional bo'lim
     bor/yo'q) avtomatik saqlanadi.
   - **Yangi o'rnatish (marker topilmagan) VA interaktiv/davom
     ettiriladigan sessiya (`--continue` bilan javob kutish mumkin):**
     foydalanuvchidan so'rang: "Asosiy 2 qoidadan tashqari, tajribaviy
     qoidalarni ham (qadam-narratsiya + muvozanatli ohang) qo'shaymi?"
   - **Yangi o'rnatish VA bitta-martalik headless chaqiruv (`agy -p`,
     davom ettirish imkoni yo'q yoki noaniq):** SAVOL BERMANG — bu holda
     kutish javobsiz qolib, hech narsa o'rnatilmay qolish xavfi bor.
     Standart bo'yicha FAQAT asosiy 1-2 bandlarni o'rnating, va
     xulosangizda aniq ayting: "Tajribaviy qoidalar (qadam-narratsiya,
     muvozanatli ohang) o'rnatilmadi — xohlasangiz alohida so'rang."

4. **Nishon faylni yozing/yangilang:**
   - **Fayl yo'q bo'lsa:** yarating, payload'ni (3-qadamda qaror
     qilingan bandlar bilan) yozing.
   - **Fayl bor, marker yo'q:** mavjud tarkibni SAQLAB, faylning oxiriga
     payload'ni qo'shing (append, hech narsani o'chirmang — masalan
     mavjud "Default Language" qoidasi kabi boshqa qoidalar bo'lishi
     mumkin).
   - **Marker bor, versiyasi bir xil:** hech narsa o'zgartirmang,
     foydalanuvchiga "allaqachon o'rnatilgan, o'zgarish yo'q" deb qisqa
     xabar bering.
   - **Marker bor, versiyasi eski:** ALMASHTIRISHDAN OLDIN, marker
     ichidagi mavjud matnni yangi payload bilan solishtiring. Agar farq
     faqat versiya-darajasidagi (kutilgan) bo'lsa — almashtiring. Agar
     marker ichida kutilmagan qo'shimcha/o'zgartirilgan matn bo'lsa
     (masalan foydalanuvchi qo'lda tahrirlagan/tarjima qilgan bo'lishi
     mumkin) — DARHOL ALMASHTIRMANG, buni foydalanuvchiga ko'rsating va
     tasdiq so'rang.

5. **Hech qachon jim bajarmang:** amal qilingandan keyin, aniq nima
   qo'shilgani/o'zgargani haqida qisqa (3-5 qator) xulosa bering — fayl
   nomi, qaysi bandlar o'rnatilgani, va agar tajribaviy bandlar
   o'rnatilmagan bo'lsa buni alohida ayting.

6. **Tekshiruv (majburiy, to'liq):** yozgandan keyin faylni QAYTA O'QIB
   (faqat "borligini taxmin qilish" emas), quyidagilarni tasdiqlang:
   (a) `<!-- agy-align:vN start -->` markeri **aynan bitta marta**
   uchraydi (dublikat yo'q), (b) mos `<!-- agy-align:vN end -->` marker
   ham mavjud, (c) marker ichidagi matn payload bilan mos keladi. Har
   qanday nomuvofiqlik — xato deb hisoblang, qayta urinib ko'ring va
   foydalanuvchiga aniq nima noto'g'ri ekanini ayting (shunchaki
   "tekshirdim" deb da'vo qilmang — natijani ko'rsating).

## Keyingi safar nomi bilan chaqirilishi uchun

Agar bu skill hozir vaqtinchalik yo'l orqali (masalan foydalanuvchi to'liq
papka yo'lini bergan holda) ishga tushirilayotgan bo'lsa:

- **`~/.gemini/antigravity-cli/builtin/skills/agy-align/` mavjud emas:**
  shu skill papkasini (`SKILL.md`, `REPORT.md`, `rules/`) o'sha papkaga
  nusxalashni foydalanuvchiga taklif qiling (masalan:
  `cp -r <shu-papka> ~/.gemini/antigravity-cli/builtin/skills/agy-align`).
- **Mavjud, lekin eski versiya (`SKILL.md`dagi `rules/global-rules.md`
  ichidagi marker versiyasini solishtiring):** yangilashni taklif qiling
  (eskisini almashtirish), lekin AVVAL foydalanuvchidan tasdiq so'rang —
  shu papka ustida qo'lda o'zgartirish qilingan bo'lishi mumkin.
- **Mavjud va bir xil versiya:** hech narsa qilmang, "allaqachon
  o'rnatilgan" deb xabar bering.

Nusxalangandan keyin bu skill istalgan loyihada, faqat nomi
("agy-align") yoki tavsifidagi trigger so'zlar bilan chaqirilishi mumkin
bo'ladi — to'liq yo'l qayta berilishi shart emas.
