---
name: agy-align
description: AGY (Antigravity CLI)ning global xatti-harakat qoidalarini (~/.gemini/GEMINI.md) o'rnatadi yoki mavjudini eng so'nggi versiyaga yangilaydi — tashxissiz fayl tahririni oldini oladi va tushunishni tasdiqlash odatini joriy qiladi. "agy-align o'rnat", "agy-align ishga tush", "AGY qoidalarini yangila/sinxronla", "install agy-align" kabi so'rovlarda ishlatiladi.
---

# agy-align — AGY global xatti-harakat sozlovchisi

Bu skill AGY'ning o'zi (Executer_Agent) tomonidan bajariladi — Claude yoki
boshqa Orcestor_Agent emas. Maqsad: `claude_tasks/agy_upgrading/`da
tekshirilgan, real testlar bilan tasdiqlangan xatti-harakat qoidalarini
global `~/.gemini/GEMINI.md` fayliga o'rnatish/yangilash — bir marta
bajarilsa, barcha keyingi loyihalar va headless (`agy -p`) chaqiruvlarda
avtomatik amal qiladi (dalil: `agy_upgrading/06-test-natijalari.md`, Test
10/12/13).

## Bajarish qadamlari

1. **Nishon faylni aniqla:** `~/.gemini/GEMINI.md` (`~` — joriy foydalanuvchi
   uy papkasi, aniq mutlaq yo'lga kengaytiring).

2. **Payload'ni o'qi:** shu skill papkasidagi
   [`rules/global-rules.md`](./rules/global-rules.md) faylini o'qing. Unda
   `<!-- agy-align:v1 start -->` ... `<!-- agy-align:v1 end -->` markerlar
   orasida asosiy (1-2) va ixtiyoriy (3-4, `optional-start`/`optional-end`
   markerlari orasida) bo'limlar bor.

3. **Foydalanuvchidan bitta savol so'rang (faqat birinchi o'rnatishda):**
   "Asosiy 2 qoidadan (xato tuzatish, tushunishni tasdiqlash) tashqari,
   tajribaviy qoidalarni ham (qadam-narratsiya + muvozanatli ohang)
   qo'shaymi?" Yo'q desa yoki javob bermasa — faqat asosiy 1-2 bandlarni
   o'rnating (`optional-start`/`optional-end` orasidagi matnni olib
   tashlang). Yangilashda (marker allaqachon mavjud bo'lsa) bu savol qayta
   berilmaydi — oldingi tanlov saqlanadi (fayldagi mavjud holatni tekshirib
   bilib oling: agar eski blokda 3-4-band bor edi — yangilaganda ham
   saqlang, yo'q edi — qo'shmang).

4. **Nishon faylni tekshiring:**
   - **Fayl yo'q bo'lsa:** yarating, payload'ni yozing.
   - **Fayl bor, lekin `<!-- agy-align:v1 start -->` marker yo'q:** mavjud
     tarkibni SAQLAB, faylning oxiriga payload'ni qo'shing (append, hech
     narsani o'chirmang — masalan mavjud "Default Language" qoidasi kabi
     boshqa qoidalar bo'lishi mumkin).
   - **Marker bor, versiyasi bir xil (`v1`):** hech narsa o'zgartirmang,
     foydalanuvchiga "allaqachon o'rnatilgan, o'zgarish yo'q" deb qisqa
     xabar bering.
   - **Marker bor, versiyasi eski (masalan `v0`):** faqat marker orasidagi
     blokni yangi payload bilan ALMASHTIRING, faylning qolgan qismiga
     tegmang.

5. **Hech qachon jim bajarmang:** amal qilingandan keyin, aniq nima
   qo'shilgani/o'zgargani haqida qisqa (3-5 qator) xulosa bering — fayl
   nomi va qaysi bandlar o'rnatilgani bilan.

6. **Tekshiruv (majburiy):** yozgandan keyin faylni qayta o'qib,
   `<!-- agy-align:v1 start -->` markeri haqiqatan mavjudligini
   tasdiqlang. Topilmasa — xato deb hisoblang, qayta urinib ko'ring va
   foydalanuvchiga xabar bering.

## Keyingi safar nomi bilan chaqirilishi uchun

Agar bu skill hozir vaqtinchalik yo'l orqali (masalan foydalanuvchi to'liq
papka yo'lini bergan holda) ishga tushirilayotgan bo'lsa va u
`~/.gemini/antigravity-cli/builtin/skills/` (yoki `~/.gemini/antigravity/builtin/skills/`)
ichida hali yo'q bo'lsa — shu skill papkasini (`SKILL.md`, `rules/`) o'sha
papkaga `agy-align` nomi bilan nusxalashni foydalanuvchiga taklif qiling
(masalan: `cp -r <shu-papka> ~/.gemini/antigravity-cli/builtin/skills/agy-align`).
Shundan keyin bu skill istalgan loyihada, faqat nomi ("agy-align") yoki
tavsifidagi trigger so'zlar bilan chaqirilishi mumkin bo'ladi — to'liq
yo'l qayta berilishi shart emas.
