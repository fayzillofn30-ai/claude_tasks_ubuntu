# new_fixing_orcestration_system — yagona orkestratsiya + memory + task-db rejasi

**Holat: REJA bosqichida (2026-07-30 boshlangan) — hali qurilmagan.**

Bu papka kod emas, **g'oyalarni yo'qotmaslik uchun yozilgan reja hujjatlari**.
Fayzillo vaqt topganda shu asosda haqiqiy tizim quradi. Maqsad: hozir bir
nechta loyihada tarqoq va turlicha shakllangan `orcestor/` g'oyasini +
sessiya-context muammosini + task-db fikrini **bitta tezkor, tejamkor
tizimga** birlashtirish.

## Kelib chiqishi (qisqa)

`orcestor` orkestratsiya g'oyasi — Fayzillo'ning o'z ishlanmasi, bitta
o'tirishda emas, **~3 kunlik loyiha davomida duch kelingan muammolar orqali
bosqichma-bosqich shakllangan**. Natijada hozir bir nechta loyihada
(`zdes-backend`, `zdes-frontend`, `zdes-frontend/Gpt_task`, `zdes`) bir xil
g'oyaning **turlicha nusxalari** mavjud — konsolidatsiya qilinmagan. Bu
rejaning bir maqsadi — shu tarqoqlikni ham yagona standartga keltirish.

Parallel ravishda, o'tgan haftalik token sarfini kuzatib, asosiy isrofning
**sessiya context yuklanishida** ekani aniqlandi (tafsilot: [`01-muammo-va-kelib-chiqishi.md`](./01-muammo-va-kelib-chiqishi.md)).

## G'oyaning evolyutsiya zanjiri (2026-07-30 yangilandi)

```
status.md → task management → history → orcestor → DB-based task management → small context backup
```

Zanjirning oxirgi bo'g'ini — **small context backup** — endi bu rejaning
**markaziy konsepsiyasi** deb belgilandi: har yangi sessiyada butun tarix
yoki barcha hujjatlar emas, faqat ayni task uchun kerakli **minimal
checkpoint + tegishli standing rule'lar** yuklanadi. Maqsad — clean session,
minimal context, token sarfini keskin kamaytirish (tafsilot: [`01-muammo-va-kelib-chiqishi.md#15`](./01-muammo-va-kelib-chiqishi.md), konsepsiyaning texnik ta'rifi: [`03-arxitektura-eskiz.md#30`](./03-arxitektura-eskiz.md)).

Uzoq muddatli roadmap (hozirgi implementatsiya emas — kelajak yo'nalishi):
[`07-roadmap-nestjs-api-server.md`](./07-roadmap-nestjs-api-server.md).

## O'qish tartibi

1. [`01-muammo-va-kelib-chiqishi.md`](./01-muammo-va-kelib-chiqishi.md) — nima uchun kerak, hozirgi holat, raqamlar, evolyutsiya zanjiri
2. [`02-metaforalar.md`](./02-metaforalar.md) — g'oyani tushuntiruvchi metaforalar
3. [`03-arxitektura-eskiz.md`](./03-arxitektura-eskiz.md) — bog'lovchi emas, boshlang'ich eskiz (markaziy konsepsiya: small context backup)
4. [`04-taxminlar-va-tekshirish.md`](./04-taxminlar-va-tekshirish.md) — tekshirilmagan taxminlar, ochiq savollar
5. [`05-use-caselar.md`](./05-use-caselar.md) — real qo'llanish holatlari
6. [`06-xulosa-va-keyingi-qadamlar.md`](./06-xulosa-va-keyingi-qadamlar.md) — umumiy xulosa, keyingi qadam (Faza A)
7. [`07-roadmap-nestjs-api-server.md`](./07-roadmap-nestjs-api-server.md) — uzoq muddatli roadmap (Faza B): NestJS API server, avtomatik saqlash, GitHub sync

**Qoida (`claude_tasks` konvensiyasiga mos):** noto'g'ri chiqqan yoki rad
etilgan g'oyalar bu papkadan o'chirilmaydi, "❌ RAD ETILDI" deb belgilanadi.
