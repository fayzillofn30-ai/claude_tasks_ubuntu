# 6. Umumiy xulosa va keyingi qadamlar

## Xulosa

- Muammo ikkita: (1) `orcestor` g'oyasi 4 loyihada tarqoq va sinxronsiz
  rivojlangan, (2) token sarfining 80%i sessiya-context yuklanishidan
  ketmoqda — kod/tahlil ishi emas.
- Markaziy konsepsiya (2026-07-30 aniqlandi): **small context backup** —
  har sessiyada butun tarix emas, faqat minimal checkpoint + tegishli
  standing rule yuklanadi ([`01-muammo-va-kelib-chiqishi.md#15`](./01-muammo-va-kelib-chiqishi.md#15-evolyutsiya-zanjiri-va-markaziy-konsepsiya-2026-07-30-qoshildi),
  [`03-arxitektura-eskiz.md#30`](./03-arxitektura-eskiz.md#30-markaziy-konsepsiya-small-context-backup-2026-07-30)).
- Yechim yo'nalishi (Faza A, yaqin muddatli): yagona DB-asosli tizim, ikki
  qatlamli xotira (`session_checkpoints` — tez eskiruvchi, `standing_rules`
  — doimiy), yozuvni tez/arzon AGY bajaradi, Claude faqat
  tekshiradi/tasdiqlaydi, har sessiya 5 promptdan keyin `/clear` + qisqa
  checkpoint bilan davom.
- Yechim yo'nalishi (Faza B, uzoq muddatli roadmap): saqlash to'liq
  avtomatlashadi — alohida NestJS API server, agentlar natijani API'ga
  yuboradi, DB serverda turadi, holat GitHub'ga sinxronlanadi. Tafsilot:
  [`07-roadmap-nestjs-api-server.md`](./07-roadmap-nestjs-api-server.md).
  **Bu hali qurilmagan, faqat yo'nalish sifatida qayd etilgan.**
- Bu — **reja**, kod emas. Barcha arxitektura tafsilotlari
  ([`03-arxitektura-eskiz.md`](./03-arxitektura-eskiz.md)) va taxminlar
  ([`04-taxminlar-va-tekshirish.md`](./04-taxminlar-va-tekshirish.md))
  hali tekshirilmagan — qurish paytida o'zgarishi kutilmoqda.

## Keyingi qadamlar (vaqt topilganda)

**Faza A — yaqin muddatli:**

1. Schema'ni aniq loyihalash (jadval nomlari, ustunlar) — shu papkada
   yangi fayl sifatida.
2. Local SQLite bilan kichik prototip — [4.4-bandidagi](./04-taxminlar-va-tekshirish.md#44-db-qayerda-turadi) savolni yopish.
3. Pilot: [UC1](./05-use-caselar.md#uc1--orcestorning-4-nusxasini-birlashtirish)
   — orcestor'ning 4 nusxasini shu tizim yordamida birlashtirish, shu
   bilan birga tizimning o'zini sinash.
4. Pilot natijasidan keyin: [UC5](./05-use-caselar.md#uc5--token-sarfi-taqsimotini-keyingi-haftada-qayta-olchash)
   bo'yicha token taqsimotini qayta o'lchash, natijaga qarab boshqa
   loyihalarga (`secvault`, `pass_manager_bot`, ...) tarqatish yoki
   arxitekturani qayta ko'rib chiqish.

**Faza B — uzoq muddatli (roadmap, Faza A pilot muvaffaqiyatidan keyin):**

5. [`07-roadmap-nestjs-api-server.md`](./07-roadmap-nestjs-api-server.md)dagi
   ochiq savollarni (xarajat, xavfsizlik, sinxronizatsiya) aniqlashtirish,
   keyin NestJS API server qurishni boshlash.

## Status izohi

Bu papka **statik emas** — qurish boshlangach yoki yangi taxmin/muammo
chiqqach, mavjud fayllarga qo'shimcha qilinadi (rad etilganlar
"❌ RAD ETILDI" deb belgilanadi, o'chirilmaydi — `claude_tasks`
konvensiyasiga mos).
