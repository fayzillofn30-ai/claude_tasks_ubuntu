# RESUMER — Small Context Checkpoint

**O'qish tartibi:** Bu faylni o'qiganingdan keyin boshqa hech qanday eski suhbat tarixini so'rama — shu fayl + pastda ko'rsatilgan fayllar yetarli.

## Vazifa qisqacha
`repo_analiz/repos/` ichidagi loyihalarni **agy --print** orqali fayl-fayl chuqur tahlil qilib, Fayzillo yozgan **noodatiy/custom** yechimlarni (umumiy framework patternlari emas — ular `reports_agy/principles.md`da bor) topib, `reports_agy/fulldeep_NN_*.md` fayllariga yozish. Metodologiya: FACT → OBSERVATION → NEGA ODATIY EMAS, aniq fayl:qator bilan.

## Joriy holat
To'liq holat jadvali: **`orcestor/status.md`** ("🔬 2-BOSQICH: FULLDEEP TAHLIL" bo'limi) — u yerda qaysi `FULLDEEP-XX` tasklar ✅ Bajarildi, qaysilari ⏳ Navbatda ekani bor. Shuni o'qi va birinchi ⏳ Navbatda qatorni top.

**LOYIHA TO'LIQ YAKUNLANDI (2026-08-04).** Barcha `FULLDEEP-01`..`FULLDEEP-11` (11 ta loyiha, 101 ta noodatiy yechim) va `SYNTHESIS` bosqichi (`tasks/07_step_unusual_solutions_synthesis.md` — 9 ta takrorlanuvchi + 15 ta noyob yechim, statistika bilan) ✅ Bajarildi. `status.md`da barcha qatorlar tasdiqlangan. Keyingi safar bu faylni ochsang, qo'shimcha ish yo'q — faqat natijalarni ko'rib chiqish yoki yangi bosqich (masalan yana bir repo qo'shish) kerak bo'lsa davom ettiriladi.

**Yangi ish rejimi (Fayzillo tasdiqlagan, 2026-08-04):** agy'da 1 yillik Pro obuna (sovg'a, marjinal narxsiz) bor, shuning uchun tasklar navbat bilan emas — **doim 2 tasi parallel fon rejimida (`run_in_background:true`)** ishlaydi. Bittasi tugab, hisoboti sifat bo'yicha tasdiqlangach, navbatdagi bitta task darhol fonga tashlanadi (juftlik kutilmaydi) — shu tariqa 2 slot doim to'liq turadi. `status.md`ga concurrent yozish xavfi bor (ikkita agy jarayoni bir vaqtda faylni tahrirlashi mumkin) — shuning uchun har safar tugagan taskdan keyin `status.md` qo'lda tekshiriladi, mos yozuv yo'q bo'lsa qo'lda tuzatiladi.

**Muhim texnik tuzatish:** Original skriptdagi outer `timeout 300` (5 daqiqa) hardcoded edi — bu 40+ fayllik tasklar uchun (8-12 daqiqa kerak) muddatidan oldin o'ldirib qo'yardi. Endi outer timeout har task uchun dinamik hisoblanadi: TIMEOUT (agy --print-timeout) + ~2 daqiqa buffer, sekundlarda (`<40 fayl→240s/300s outer`, `40-100→480s/600s outer`, `100+→720s/840s outer`).

Sifat nazorati: FULLDEEP-01..10 barchasida matn tozalandi — takrorlanuvchi xato turi: agy ba'zan "to'g'ridan-to'g'ri" so'zi o'rniga uydirma so'z qo'shib yuboradi (masalan "to'g'ridan-to mezon", "to'g'ridan-to'g me'yorida", "bo'laklarga bo mezon", "bo me'yorida" — FULLDEEP-03,05,08,10'da uchradi). Har hisobotni o'qib, shunga o'xshash nuqsonlarga ko'z yugurtir va qo'lda tuzat.

**MUHIM — klon xatosi topildi va tuzatildi (2026-08-03):** `FULLDEEP-03` birinchi urinishda `repos/6_oy_imtihon/` papkasi butunlay 0 baytli (909 ta bo'sh fayl, buzilgan `.git`) ekanini aniqladi — bu chala/uzilib qolgan klon edi. Shundan keyin `fulldeep_prompt_template.txt` ga **0-QADAM** qo'shildi: endi agy har taskda avval loyihaning klon holatini tekshiradi, buzilgan bo'lsa avtomatik ravishda `.git/config`dagi URL orqali qayta klon qiladi (eski papkani `*.broken_<vaqt>` deb saqlab, o'chirmasdan). Bu allaqachon shablon ichida — keyingi tasklarda alohida eslatishga hojat yo'q. Eski buzilgan nusxa `repos/6_oy_imtihon.broken_20260803_2344/` da saqlanmoqda (18MB) — kerak bo'lmasa keyinroq o'chirish mumkin, hozircha tegilmadi.

**Model fallback qo'shildi:** Ijro buyrug'i endi bir nechta modelni (default → `claude-sonnet-4-6` → `claude-opus-4-6-thinking` → `gemini-3.1-pro-high` → `gemini-3.6-flash-high`) navbat bilan sinaydi — agar chiqishda `quota`/`rate limit`/`429`/`resource exhausted` so'zlari uchrasa, avtomatik keyingi modelga o'tadi.

## Keyingi qadam — aynan shu buyruqni bajar

**Muhim eslatma (har safar):** Shablon (`fulldeep_prompt_template.txt`) ichida endi 0-QADAM bor — agy tahlildan oldin loyihaning git klon holatini (0 baytli/buzilgan fayllar) tekshiradi va kerak bo'lsa o'zi qayta klon qiladi. Buyruq alohida "ogohlantirish" qo'shishga hojat yo'q, shablon o'zi buni qamrab oladi — faqat shablonni o'zgartirmasdan ishlat.

**Model fallback (quota tugasa):** Quyidagi ro'yxatdagi modellarni navbat bilan sinab ko'r. Agar chiqishda `quota`, `rate limit`, `429`, `resource exhausted` kabi so'zlar (case-insensitive) uchrasa — o'sha model kvotasi tugagan, keyingi modelga o't va shu vazifani qayta boshidan ishga tushir.

```bash
cd /home/fayzillo/Desktop/testing/claude_tasks/repo_analiz
TPL=orcestor/fulldeep_prompt_template.txt
# status.md dagi keyingi ⏳ Navbatda qatordan PROJECT / REPORT_FILE / TASK_ID ni ol:
PROMPT=$(sed -e "s/__PROJECT__/<PROJECT_NOMI>/g" -e "s/__REPORT_FILE__/<REPORT_FAYL_NOMI>/g" -e "s/__TASK_ID__/<TASK_ID>/g" "$TPL")
# Fayl soniga qarab timeout tanla: <40 fayl -> 4m0s, 40-100 -> 8m0s, 100+ -> 12m0s
TIMEOUT=4m0s
MODELS=("" "claude-sonnet-4-6" "claude-opus-4-6-thinking" "gemini-3.1-pro-high" "gemini-3.6-flash-high")
for M in "${MODELS[@]}"; do
  if [ -z "$M" ]; then
    OUT=$(timeout 300 agy --print "$PROMPT" --print-timeout "$TIMEOUT" --dangerously-skip-permissions 2>&1)
  else
    echo ">>> Model: $M bilan sinalmoqda"
    OUT=$(timeout 300 agy --print "$PROMPT" --model "$M" --print-timeout "$TIMEOUT" --dangerously-skip-permissions 2>&1)
  fi
  echo "$OUT" | tail -80
  if echo "$OUT" | grep -qiE "quota|rate.?limit|429|resource.?exhausted"; then
    echo ">>> Kvota tugadi, keyingi modelga o'tilmoqda..."
    continue
  fi
  break
done
```

Bajargandan keyin:
1. Yozilgan `reports_agy/fulldeep_NN_*.md` faylini o'qi, sifatini tekshir (haqiqiy fayl:qator bor-yo'qligi, mazmunsiz so'z yo'qligi, klon-xatosi ogohlantirishi yo'qligi).
2. Agar hisobotda "OGOHLANTIRISH: ... klon xatosi tuzatilmadi" bo'lsa — bu taskni ⏳ holida qoldir (keyinroq qo'lda hal qilish kerak), keyingi navbatdagi taskka o'tma, foydalanuvchiga xabar ber.
3. `orcestor/status.md` avtomatik yangilangan bo'lishi kerak (agy o'zi yozadi) — tekshir, yangilanmagan bo'lsa qo'lda yangila.
4. Shu `resumer.md` faylini yangi holatga mos yangila (bajarilgan task ID'ni qo'shib, keyingi navbatdagi taskni ko'rsatib) — foydalanuvchi yana `/clear` qilib davom ettirishi mumkin.

## Navbat tartibi (status.md bilan bir xil, mos kelishi kerak)
FULLDEEP-03 `6_oy_imtihon` → FULLDEEP-04 `mini-erp` → FULLDEEP-05 `e-commerce` (frontend) → FULLDEEP-06 `e-commerce-backend` → FULLDEEP-07 `crm_frontend` → FULLDEEP-08 `crm_backend` → FULLDEEP-09 `telegram_app_front_end` → FULLDEEP-10 `telegram_app_backend` → FULLDEEP-11 `online-courses` → **SYNTHESIS**.

## SYNTHESIS bosqichi (barcha 11 ta FULLDEEP tugagach)
Barcha `reports_agy/fulldeep_*.md` fayllarni o'qib, `tasks/07_step_unusual_solutions_synthesis.md` yoz — `principles.md`dagi umumiy patternlarni takrorlamasdan, loyihalar kesimida qaytarilgan yoki eng noyob noodatiy yechimlarni sintez qil (mavjud `tasks/0X_step_*.md` fayllar formatiga mos, o'zbek tilida).

## Standing rules (qisqa eslatma — to'liqi Claude memory'da bor)
Fayzillo bilan: o'zbek tilida, lo'nda/tizimli javob, taxmin qilmasdan fayl o'qib ish qil, git status tekshirmasdan fayl o'chirma, RAM ~5.7GB cheklovini hisobga ol.
