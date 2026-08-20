---
name: agy-ui-analizer
description: Loyihaning frontend/UI qismini avtomatik screenshot + Gemini Vision API orqali tahlil qilib, topilgan vizual bug'larni Executer_Agent (agy) orqali tuzatadi. "UI review qil", "frontendni tekshir", "screenshot orqali bug top", "agy-ui-analizer ishga tush" kabi so'rovlarda ishlatiladi. FAQAT agy-align va orcestor-start allaqachon o'rnatilgan/ishga tushirilgan bo'lsa to'liq ishlaydi — 0-bosqichga qarang.
---

# agy-ui-analizer — Avtomatik UI/vizual review skill

Bu skill uchta bosqichli zanjirning **uchinchi va oxirgi bo'g'ini**:

```
agy-align  →  orcestor-start  →  agy-ui-analizer
(Agy'ning     (loyiha darajasida    (frontend/UI
global xatti-  Orcestor/Executer     review va fix
harakati)      pipeline'i)           avtomatlashtirish)
```

Har bir bosqich oldingisiga tayanadi — tartib **majburiy**, chunki:
- `agy-ui-analizer` topilgan bug'larni tuzatish uchun `agy -p ...` chaqiradi
  — bu chaqiruv ishonchli bo'lishi uchun `agy-align`ning global
  `~/.gemini/GEMINI.md` qoidalari (xato-tuzatish protokoli, tushunishni
  tasdiqlash, tekshirilgan/tekshirilmagan da'vo farqi) allaqachon
  o'rnatilgan bo'lishi shart (asos: `docs/design-rationale.md#3`
  — bu qoidalarsiz headless `agy -p` chaqiruvlar ishonchsiz).
- `agy-ui-analizer` `orcestor-start` o'rnatgan `WORKSPACE_PATH` va
  `Executer_Agent` konvensiyasidan foydalanadi (1.1-bandidagi
  "noto'g'ri workspace'da ishlash" xavfidan himoyalanish uchun) va
  natijalarni `orcestor/sub_tasks/` jurnaliga yozadi.

## 0-bosqich — Majburiy old-shart tekshiruvi (HAR DOIM birinchi)

Skill chaqirilgan ZAHOTI, boshqa hech narsadan oldin, ikkalasini tekshiring:

1. **`agy-align` o'rnatilganmi?** `~/.gemini/GEMINI.md` faylini o'qing,
   `<!-- agy-align:vN start -->` markeri bor-yo'qligini tekshiring.
   - **Yo'q bo'lsa**: Supervisor_User'ga ANIQ ayting: "`agy-align` hali
     o'rnatilmagan — bu Agy'ning barcha `-p` chaqiruvlarini ishonchli
     qiladigan global qoidalar. Avval shuni ishga tushiramizmi
     ('agy-align o'rnat' deb yozing)?" va **davom etmang**, tasdiq kuting.
2. **`orcestor-start` shu loyihada ishga tushirilganmi?** Loyiha ildizida
   `orcestor/orcestor.config.env` faylini qidiring.
   - **Yo'q bo'lsa**: Supervisor_User'ga ayting: "Bu loyihada `orcestor-start`
     hali ishga tushirilmagan — u `WORKSPACE_PATH`, `Executer_Agent`
     identifikatsiyasi va xavfsiz workspace-izolyatsiyasini beradi.
     Avval shuni ishga tushiramizmi ('orkestratsiya boshla' deb yozing)?
     Yoki agar bilib turib standalone (orcestor'siz) davom etishni
     xohlasangiz, aniq shunday deb tasdiqlang — bu holda 4-bosqichdagi
     fix-dispatch WORKSPACE_PATH himoyasisiz ishlaydi, xavf sal yuqoriroq."
   - **Bor bo'lsa**: `orcestor.config.env`ni o'qing, `WORKSPACE_PATH` va
     `EXECUTER_AGENT` qiymatlarini oling — quyidagi bosqichlarda shular
     ishlatiladi.

Ikkalasi ham tayyor bo'lgach (yoki Supervisor_User standalone rejimni
aniq tasdiqlagach), 1-bosqichga o'ting.

> Quyida "asos: `docs/design-rationale.md#N`" ko'rinishidagi izohlar
> uchraydi — bu skill papkasi ichidagi
> [`docs/design-rationale.md`](./docs/design-rationale.md) fayliga
> ishora, real sinovlar orqali qabul qilingan qarorlarning to'liq
> asosini tushuntiradi. Skill o'z-o'zidan yetarli (izolyatsiyalangan) —
> tashqi/shaxsiy manbalarga bog'liq emas.

## 1-bosqich — Talablarni tekshirish (bir martalik, loyiha-darajasida)

- **Node.js + Puppeteer**: loyiha ichida (masalan `<loyiha>/.agy-ui-analizer/`
  papkasida) `npm install puppeteer` bajarilganmi, tekshiring. Yo'q bo'lsa
  o'rnating (sandbox muhitida `--no-sandbox` flag kerak bo'lishi mumkin —
  qarang `scripts/review_pages.js` ichidagi launch argumentlari).
- **Python 3 + google-genai**: alohida `venv` yaratib (`python3 -m venv venv`),
  ichiga `pip install google-genai` qiling — tizim Python'iga
  `--break-system-packages` bilan o'rnatishdan saqlaning (PEP 668,
  "externally-managed-environment" xatoligi — venv xavfsizroq alternativa,
  asos: `docs/design-rationale.md#5`).
- **`GEMINI_API_KEY`**: loyiha `.env`sida yoki muhit o'zgaruvchisida
  mavjudligini tekshiring (`GEMINI_API_KEY`/`API_KEY`/`GOOGLE_API_KEY`,
  katta/kichik harf farqsiz).

## 2-bosqich — Sahifalarni aniqlash va screenshot+konsol yig'ish

```bash
node scripts/review_pages.js <BASE_URL> <OUTPUT_DIR> [MAX_PAGES]
```

- `<BASE_URL>` — tekshiriladigan sayt manzili (`http://localhost:PORT`
  dev-server, yoki `file:///.../index.html` statik sahifa uchun).
- Skript avtomatik crawling orqali (`<a href>` linklarni kuzatib) barcha
  bir-xil-origin sahifalarni topadi (asos: `docs/design-rationale.md#1`,
  framework-agnostik yondashuv — Angular/React/oddiy HTML barchasida bir
  xil ishlaydi). Faqat qo'lda ro'yxat kerak bo'lsa, `pages.json`ni
  ishga tushirishdan oldin qo'lda tahrirlash orqali cheklash mumkin.
- Har bir sahifa uchun `OUTPUT_DIR/<slug>/screenshot.png` va
  `console.log` yaratiladi.

**Konsol xatolarini DARHOL ko'rib chiqing** (Gemini'ga yuborilmasdan
oldin) — bu matn-darajasidagi xatolar (masalan tarmoq xatosi, JS
exception) alohida, tezroq va aniqroq aniqlanadi, screenshot orqali emas
(arxitektura qarori — Gemini faqat vizual/UI tahlil uchun, matn-darajasidagi
xatolarni tekshirish undan tezroq va aniqroq).

## 3-bosqich — Gemini Vision tahlili

```bash
venv/bin/python scripts/analyze_pages.py <OUTPUT_DIR> templates/prompt.md [.env yo'li]
```

Har bir sahifa uchun `OUTPUT_DIR/<slug>/gemini_response.md` yoziladi.
`templates/prompt.md` — standart shablon (soxta-pozitivlarga qarshi
ko'rsatmalar allaqachon kiritilgan, qarang pastda 3.1-band). Loyihaga
xos tekshiruv nuqtalari kerak bo'lsa, shu shablonni nusxalab
moslashtiring (masalan `prompt.<loyiha>.md`).

### 3.1 — Natijani QABUL QILISHDAN OLDIN filtrlash (MAJBURIY)

Real sinovda (asos: `docs/design-rationale.md#2`)
Gemini'ning o'zida soxta-pozitiv topilgan edi (masalan sana/vaqtga oid
noto'g'ri "xato" da'vosi — modelda joriy sana haqida ma'lumot yo'q).
Shuning uchun Orcestor_Agent HAR BIR `gemini_response.md`ni Agy'ga
uzatishdan OLDIN o'qib chiqishi va quyidagilarni filtrlashi SHART:
- Sana/vaqt "to'g'riligi"ga oid da'volar.
- Matn mazmuni/til sifatiga oid mulohazalar (vizual emas).
- Screenshot'da aniq ko'rinmaydigan, taxminiy/umumiy fikrlar.

Faqat **screenshot'da haqiqatan ko'rinadigan, aniq tavsiflangan** vizual
muammolar keyingi bosqichga o'tkaziladi.

## 4-bosqich — Fix-dispatch (Executer_Agent = agy)

Filtrlangan har bir haqiqiy muammo uchun **bitta, tor doiradagi** topshiriq
yozing va quyidagi qat'iy shablon bilan chaqiring (asos:
`docs/design-rationale.md#3` — headless `agy -p`ni ishonchli
boshqarishning yagona real sinalgan usuli, aynan promptning o'zidagi
aniq matn):

```bash
cd "<WORKSPACE_PATH>" && agy -p "/agy-align

VAZIFA (tasdiqlangan, darhol TUZAT — qo'shimcha tasdiq so'rash shart emas):

Fayl: <aniq_fayl_yoli>

<Gemini tahlilidan olingan, filtrlangan, aniq muammo tavsifi va
tuzatish yo'nalishi — 1 tadan bir nechtagacha, lekin FAQAT haqiqiy,
tasdiqlangan muammolar>

QAT'IY CHEKLOVLAR:
- FAQAT ko'rsatilgan faylni tahrirla, boshqasiga tegma.
- Hech qanday buyruq ishga tushirma — tekshiruvni Orcestor bajaradi.
- Tugagach, har bir o'zgarish uchun aniq before→after ro'yxat ber." --print-timeout 5m
```

**Nima uchun `--dangerously-skip-permissions` ishlatilmaydi bu yerda**:
faqat fayl-tahrirlash so'ralmoqda (bu headless rejimda ruxsatsiz ham
avtomatik ishlaydi), buyruq ishga tushirish esa so'ralmagan — shuning
uchun kengroq ruxsat kerak emas (eng kam imtiyoz tamoyili).

**`orcestor-start` bilan integratsiya** (agar 0-bosqichda faol bo'lsa):
- Har bir fix-dispatch `orcestor/sub_tasks/NN-ui-fix-<slug>.md` sifatida
  qayd etiladi (rasmiy `tasks/`/DB task-lifecycle emas — bu tezkor,
  audit-xarakteridagi ish, orcestor-start SKILL.md 3-bo'limidagi
  ta'rifga mos).
- `PROJECT_STATUS_UPDATE=every_task` bo'lsa, `orcestor/project_status/overview.md`
  ham yangilanadi.

## 5-bosqich — Qayta tekshiruv (majburiy, 3 usul — real sinovda tasdiqlangan)

Agy natijasini hech qachon so'zsiz qabul qilmang (asos:
`docs/design-rationale.md#4`, "men shaxsan tekshirdim" tamoyili):

1. **Faylni `Read` bilan shaxsan o'qing** — Agy aytgan o'zgarish
   haqiqatan kiritilganini tasdiqlang.
2. **`review_pages.js`ni faqat shu sahifa uchun qayta ishga tushiring**
   — screenshot va konsol logi yangilanganini tekshiring.
3. **(Ixtiyoriy, muhim topilmalar uchun) DOM geometriyasi** — agar
   muammo layout/overflow xarakterida bo'lsa, oddiy Puppeteer
   `getBoundingClientRect()` skripti bilan raqamli tasdiqlang (vizual
   taassurot yolg'iz yetarli emas — asos: `docs/design-rationale.md#4`).

## Bilingan chegara

Vizual anomaliyasi (rang/forma) qoldirmaydigan "kontekstsiz yo'qlik"
turidagi bug'lar (masalan hech qanday quti/chegara ichida bo'lmagan,
shunchaki fonga singib ketgan matn) Gemini Vision tomonidan topilmay
qolishi mumkin. Tafsilot va misol: `docs/design-rationale.md#7`.

## Limitlar va sozlamalar

Barcha limitlar (`config.env`) real Gemini API kvotasi asosida
tanlangan — sabab va raqamlar uchun `docs/design-rationale.md#6`.

## Xulosa hisoboti

Har bir ishga tushirishdan so'ng Supervisor_User'ga qisqa hisobot bering:
- Nechta sahifa tekshirildi, nechta haqiqiy bug topildi (filtrlashdan
  keyin), nechtasi tuzatildi va tasdiqlandi.
- Filtrlangan (rad etilgan) Gemini da'volari bo'lsa, ularni ham aytib
  o'ting (shaffoflik — soxta-pozitivlar yo'qolib ketmasin, keyingi safar
  prompt shablonini yaxshilash uchun foydali material).
