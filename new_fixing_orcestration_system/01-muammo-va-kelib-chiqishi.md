# 1. Muammo va kelib chiqishi

## 1.1 Orcestor g'oyasining tarixi

`orcestor` — Fayzillo'ning o'z g'oyasi. Bitta rejadan boshlanmagan, **~3 kun
davomida, loyiha ustida ishlash paytida duch kelingan real muammolarga javob
sifatida** bosqichma-bosqich shakllangan (masalan: sub-agent — AGY —
ishonchliligini qanday tekshirish, fazalarga qanday bo'lish, parallel
sessiyalar bir-birining fayliga tegmasligi uchun qanday chegara qo'yish).
Shu sabab hech qachon bitta yakuniy spec sifatida yozilmagan — har safar
navbatdagi muammoni yechish uchun kengaygan.

## 1.2 Hozirgi holat: tarqoqlik

`orcestor/` papkasi kamida **4 ta joyda**, bir-biridan bexabar rivojlangan:

| Joylashuv | Tarkib |
|---|---|
| `zdes-backend/orcestor/` | `analysis/ history/ prompt.md README.MD requirements.MD status/ steps/ task_compliete/ task_pending/ tasks/` |
| `zdes-frontend/orcestor/` | `dispatch.py prompt.md README.MD requirements.MD status/ steps/ task_compliete/ task_pending/ tasks/` |
| `zdes-frontend/Gpt_task/orcestor/` | xuddi shu tuzilma, alohida nusxa |
| `zdes/orcestor/` | eng so'nggi, **konsolidatsiya qilingan** versiya (T-0XX frontend seriyasi + B- backend seriyasi birlashtirilgan), lekin o'zi ham `front-*` prefiksli tarixiy fayllar bilan to'lib ketgan |

Qo'shimcha: `zdes-frontend/orcestor.zip` (70KB, zaxira nusxa) va
`zdes/session/*.md` — 5 ta alohida "handoff" fayli (jami 307 qator) — bular
ham aslida qo'lda yozilgan checkpoint urinishlari.

**Muammoning mohiyati:** har nusxada bir xil skelet (`tasks/ →
task_pending/ → task_compliete/ → status/`, `requirements.MD`, `prompt.md`,
`dispatch.py`) qayta-qayta qo'lda ko'chirilgan/qayta yozilgan, lekin
versiyalar orasida sinxronizatsiya yo'q — qaysi biri "haqiqiy" ekani faqat
oxirgi tahrirlangan sana bilan taxmin qilinadi.

## 1.3 Token sarfi statistikasi (o'tgan hafta, Fayzillo kuzatuvi)

| Toifa | Ulush |
|---|---|
| Sessiya context yuklanishi (sessiya kattalashib borishi) | **80%** |
| Fayllar bilan ishlash / loyiha tahlili | 14% |
| Terminalda CLI ochiq qolgan vaqt | 6% |

**Xulosa:** asosiy isrof ish (fayl tahlili, kod yozish) emas — **sessiya
uzayishi sababli har promptda qayta yuklanadigan eski context**. Demak eng
katta effekt shu joyni qisqartirishdan keladi, kod-daraja optimizatsiyadan
emas.

## 1.4 Ikkita muammo — bitta reja

Bu ikki muammo bog'liq: agar orcestor yagona, tartibli, DB-asosli tizimga
o'tsa, sessiya-context muammosi ham tabiiy yechiladi — chunki checkpoint/
memory mexanizmi ikkalasiga ham bir xil infratuzilmani (DB, AGY yozuvchi
rolida) ishlatadi. Shu sabab ikkalasi bitta papkada, bitta reja sifatida
ishlanmoqda.

## 1.5 Evolyutsiya zanjiri va markaziy konsepsiya (2026-07-30 qo'shildi)

G'oya nolinchi kunda tug'ilmagan — bosqichma-bosqich, har safar oldingi
usulning yetishmagan joyidan kelib chiqib rivojlangan:

```
status.md → task management → history → orcestor → DB-based task management → small context backup
```

| Bosqich | Nima edi | Yetishmagan joyi |
|---|---|---|
| `status.md` | qo'lda yozilgan qisqa holat fayli (hozir ham `claude_tasks/*/status.md` sifatida bor) | chiziqli, tez uzayadi, qidirish qiyin |
| task management | `tasks/ → task_pending/ → task_compliete/` papka-lifecycle (orcestor'da ko'rinadi) | holat papka nomi bilan ifodalanadi, tarix yo'qoladi |
| history | `history/`, `session/*.md` handoff fayllari | qo'lda arxivlash, standartsiz, loyihadan loyihaga farq qiladi |
| orcestor | rol-based (Orchestrator/Executor/Supervisor) + fazali ish oqimi | 4 nusxada mustaqil rivojlanib, sinxronsiz qoldi ([1.2](#12-hozirgi-holat-tarqoqlik)) |
| DB-based task management | fayl o'rniga strukturaviy saqlash, so'rov orqali filtrlash | o'zi tejamkorlikni kafolatlamaydi — qanday so'ralishiga bog'liq ([3.4](./03-arxitektura-eskiz.md#34-muhim-ogohlantirish--db-ozi-token-tejamaydi)) |
| **small context backup** | **hozirgi markaziy konsepsiya** — har sessiyada faqat minimal checkpoint + tegishli standing rule yuklanadi | hali qurilmagan, reja bosqichida |

**Muhim:** bu zanjirning oxirgi bo'g'ini avvalgilarini bekor qilmaydi —
ularning ustiga quriladi (masalan DB-based task management — small context
backup'ning saqlash qatlami, orcestor — uning rol/lifecycle andozasi). Shu
sababli 1.1–1.4 bandlaridagi tavsif ("orcestor + token muammosi — bitta
reja") o'zgarmaydi, faqat endi **maqsad nomi va markazi aniq
belgilandi: small context backup**.

