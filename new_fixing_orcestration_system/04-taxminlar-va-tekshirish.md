# 4. Taxminlar va ochiq savollar

Bu reja hali sinalmagan. Quyidagilar — qurishdan oldin yoki qurish
jarayonida tekshirilishi kerak bo'lgan taxminlar. Har biri sinalgach,
natijaga qarab ✅/❌ bilan belgilanadi (o'chirilmaydi — `claude_tasks`
konvensiyasi).

## 4.1 5-promptlik chegara har doim yetarlimi?

Kichik tuzatishlar uchun ortiqcha bo'lishi mumkin, katta ko'p-fayl tahlili
(masalan orcestor'dagi Faza 1 — 17 modul) uchun yetmasligi mumkin.
**Tekshirish:** turli ish turlarida (bug-fix vs ko'p modulli tahlil) real
prompt sonini kuzatish, kerak bo'lsa chegarani ish turiga qarab moslashuvchan
qilish (qattiq "5" emas).

## 4.2 AGY checkpoint yozishda ishonchlimi? ✅ TASDIQLANDI — takrorlanuvchi pattern

`zdes/orcestor/requirements.MD`da allaqachon "AGY ishonchlilik saboqlari"
bo'limi bor edi — bu AGY xulosalarida oldin muammo bo'lganini ko'rsatgan.
2026-07-30da bu **taxmin emas, kuzatilgan, takrorlanuvchi pattern**
sifatida tasdiqlandi, ikkita mustaqil misol bilan:

1. **Demo dars materialida (Docker):** `resurs.txt`dagi eski, aniq misol
   (`docker pull mysql:alpine`) matnda umumiy shaklga (`mysql:versiya yoki
   tag`) tuzatilgan edi, lekin AGY shu eski, tuzatilmagan misol asosida
   illyustrativ rasm generatsiya qilgan
   (`demo_dars_docker/docker_full_slide_pictires/step04_mysql_pull_misoli.png`).
   Tekshirilganda `mysql:alpine` tag Docker Hub'da umuman mavjud emasligi
   aniqlandi (`docker manifest inspect` — "no such manifest"). Ya'ni AGY
   matn va rasm o'rtasidagi eskirgan/yangilangan holatni sinxronlamagan.
2. **Boshqa mavzu materialida (Hash Map):** AGY `key collision` va
   `property collision` tushunchalarini aralashtirib, noto'g'ri xulosa
   yozgan (Fayzillo, 2026-07-30).

**Pattern:** ikkala holatda ham AGY **bir-biriga yaqin/o'xshash, lekin
farqli texnik tushuncha yoki holatni** aralashtirgan — manbani chuqur
tekshirmasdan, eng "ishonchli ko'ringan" variantni tanlagan.

**Xulosa — endi tekshirish emas, qoida:** "Claude tekshiradi" bosqichi
pilotda ixtiyoriy emas, **majburiy** deb belgilanadi — ayniqsa AGY
tomonidan generatsiya qilingan texnik misollar (buyruqlar, tag'lar,
atama juftliklari) uchun, checkpoint matni bilan bir qatorda.

## 4.3 Ikki qatlam (checkpoint + standing rules) yetarlimi?

`backup-plan/overview.md` uslubida uchinchi qatlam ham bor edi:
**loyiha-darajasidagi umumiy holat** (masalan "12 bosqichdan 11 tasi
tugagan"), bu na sessiyaga, na doimiy qoidaga to'g'ri kelmaydi — o'rtacha
tezlikda o'zgaradi. **Ochiq savol:** shu uchinchi qatlam (`project_state`)
kerakmi, yoki `session_checkpoints`ning eng so'nggisi shu vazifani ham
bosishi mumkinmi?

## 4.4 DB qayerda turadi?

RAM 5.7GB, disk joyi cheklangan (`backup-plan/overview.md`da qayd etilgan).
**Taxmin:** local SQLite fayl sifatida yetarli (yozuv-o'qish hajmi kichik,
server-daraja DB ortiqcha bo'lishi mumkin). **Tekshirilmagan.**

## 4.5 Bitta DB barcha loyihalar uchunmi?

Hozir `orcestor` 4 ta loyihada mustaqil. Yagona DB (bitta fayl, `project`
ustuni bilan ajratilgan) — qidirish va standing-rules ulashish uchun
qulayroq bo'lishi mumkin, lekin loyihalar orasida tasodifiy aralashish
xavfini oshiradi (masalan bitta loyihaning standing rule'i boshqasiga
noto'g'ri qo'llanishi). **Ochiq savol, hal qilinmagan.**

## 4.6 status.md fayllaridan DB'ga o'tish — qanday?

Mavjud `status.md`larni (masalan `github-backup/status.md` + 3 ta `.err*`
fayl) qo'lda emas, balki bitta o'tish skripti bilan checkpoint formatiga
keltirish kerakmi, yoki ular tarixiy hujjat sifatida fayl holida qolib,
faqat **yangi** ishlar DB'ga yozilishi kerakmi? **Taxmin:** ikkinchisi —
eski fayllarga tegilmaydi, faqat yangi tizim bundan buyon ishlatiladi
(xuddi `backup-plan/overview.md`dagi "rad etilgan gipoteza o'chirilmaydi"
qoidasiga o'xshab, eski status fayllar ham arxiv sifatida qoladi).

## 4.7 Kvota tugaganda: model-switch birinchi, akkaunt-switch — so'nggi chora (tekshirilmagan, 2026-08-04 qo'shildi)

**Taxmin:** kvota/limit muammosi ikki bosqichli, ustuvorlik tartibli
yondashuv bilan yopiladi:

1. **Birinchi chora — model-switch.** Bitta AGY akkaunti ichida limit
   tugaganda avval boshqa modelga o'tish sinaladi.
2. **So'nggi, qo'shimcha chora — akkaunt-switch.** Model-switch ham
   yetmasa (shu akkauntdagi barcha modellar limitga tegsa), keyingi qadam
   — bir nechta AGY akkaunti orasida almashish. Shu maqsadda yana bir
   nechta AGY akkaunti qo'shish rejalashtirilmoqda.

**Holat: hali sinalmagan, hozir tajriba qilinmoqda.** Quyidagilar —
tekshirilishi kerak bo'lgan ochiq savollar, natija emas:

- Model-switch chindan ham akkaunt-switchgacha yetarli bufer beradimi, yoki
  amalda ikkalasi deyarli bir vaqtda kerak bo'lib qolishi mumkinmi?
- Akkaunt-switch paytida checkpoint uzilishi xavfi bormi — agar AGY (3.2
  bo'yicha yozuvchi rol) kvota tugashidan oldin oxirgi checkpointni yozib
  ulgurmasa, akkaunt B'da checkpoint eski/yo'q bo'lib qolishi mumkin
  ([4.2](#42-agy-checkpoint-yozishda-ishonchlimi--tasdiqlandi--takrorlanuvchi-pattern)dagi
  AGY-ishonchlilik pattern bilan bog'liq, lekin bu — alohida, tekshirilmagan
  xavf).
- Bu ikki bosqichli zanjir (model-switch → account-switch) UC2'dagi
  trigger ro'yxatiga ("5-prompt | /clear | session uzilishi | quota
  reached") qanday qo'shiladi — alohida trigger turimi yoki bittasining
  ostki holatimi, hali aniqlanmagan.

### 4.7.1 Tekshiruv natijalari va qabul qilingan oqim (2026-08-04)

**AGY (Antigravity CLI, `agy`, v1.1.10) haqida tasdiqlangan faktlar:**

- ✅ **TASDIQLANDI** — CLI darajasida `agy auth logout` kabi subcommand
  yo'q (`unknown subcommand: auth` xatosi). Akkaunt chiqish/kirish faqat
  **interaktiv sessiya ichida slash-komanda** orqali: `/logout` ("Log out")
  — sinovda avtokomplitda ko'rindi va tasdiqlandi. Login esa shundan keyin
  brauzer orqali (Google OAuth) avtomatik so'raladi.
- ✅ **TASDIQLANDI** — `~/.gemini/oauth_creds.json` va uni o'qiydigan
  `antigravity-usage` vositasi **ishonchsiz manba**: ular eskirgan, 16 kun
  ishlatilmagan, muddati tugagan (2026-07-19) boshqa akkauntni (
  `ummatovfayzilllo@gmail.com`) ko'rsatdi — `agy`ning o'zi haqiqatda
  ishlatayotgan akkaunt (`ummatovfayzillo23@gmail.com`, Google AI Pro) bilan
  mos emas. Haqiqiy holatni faqat `agy`ning o'z banneri yoki CLI logidan
  (`~/.gemini/antigravity-cli/log/cli-*.log`, `server_oauth.go` yozuvi)
  tasdiqlash mumkin edi.
- **Qaror: akkaunt-switch to'liq qo'lda (Person tomonidan), avtomatlashtirilmaydi.**
  Sabab — CLI-darajasida ishonchli, skript qiladigan subcommand yo'qligi
  (yuqoridagi band) va HOME-profil almashtirish kabi fayl-darajasidagi
  yechimlarning haqiqiy token qayerda saqlanishi tasdiqlanmagani sababli
  xavfli deb topildi ([4.7](#47-kvota-tugaganda-model-switch-birinchi-akkaunt-switch--songgi-chora-tekshirilmagan-2026-08-04-qoshildi)ning
  o'zidagi ochiq savolga javob — HOME-swap yondashuvi rad etilmadi, lekin
  hozircha qo'llanilmaydi).

**Qabul qilingan oqim (workflow, hali sinalmagan):**

```
1. Trigger: orcestor (yoki agent) kvota/limit muammosini payqaydi
      ↓
2. Orcestor Person'ga xabar beradi ("akkaunt almashtirish kerak")
      ↓
3. Person qo'lda almashtiradi: agy ichida /logout → brauzerda
   boshqa akkauntni tanlab /login (muhim: "use another account"ni
   aniq bosish — aks holda brauzer eski akkauntga qaytarib qo'yishi
   mumkin, Gemini-CLI ekotizimida kuzatilgan pattern)
      ↓
4. Person banner'da yangi akkaunt to'g'ri ko'rinayotganini tasdiqlaydi,
   keyin agentga xabar beradi ("almashtirildi")
      ↓
5. Agent limitlarni tekshiradi (masalan `agy models`/kvota holati) va
   checkpoint'dan vazifani davom ettiradi
```

**Ochiq savollar (hali sinalmagan):**

- 5-qadamda agent limitlarni **qanday** tekshiradi — ishonchli buyruq/usul
  hali topilmadi (`antigravity-usage` ishonchsiz ekani tasdiqlandi, banner
  esa faqat sessiya boshida ko'rinadi).
- 3-qadamdagi brauzer-orqali qayta autentifikatsiya doim yangi akkauntga
  o'tkazadimi, yoki ba'zan eskisiga qaytarib qo'yadimi — amalda hali
  sinalmagan.
