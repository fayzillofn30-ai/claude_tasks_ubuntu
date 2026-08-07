# 3. Arxitektura eskizi (bog'lovchi emas — boshlang'ich taxmin)

## 3.0 Markaziy konsepsiya: small context backup (2026-07-30)

Evolyutsiya zanjirining ([`01-muammo-va-kelib-chiqishi.md#15`](./01-muammo-va-kelib-chiqishi.md#15-evolyutsiya-zanjiri-va-markaziy-konsepsiya-2026-07-30-qoshildi))
oxirgi va hozirgi markaziy bosqichi — **small context backup**. Ta'rif:

> Har yangi sessiyada butun history yoki barcha hujjatlar emas, balki
> **faqat ayni task uchun kerakli minimal checkpoint va standing rule'lar**
> yuklanadi.

Bu bo'limdagi qolgan hamma narsa (3.1–3.5) — shu konsepsiyaning texnik
ifodasi: ikki qatlamli model (3.1) checkpoint'ni "minimal" saqlashning
mexanizmi, 5-promptli sikl (3.3) esa "ayni task uchun kerakli"ni amalda
ta'minlash usuli. Faza B (uzoq muddatli, [`07-roadmap-nestjs-api-server.md`](./07-roadmap-nestjs-api-server.md))
xuddi shu konsepsiyani saqlaydi, faqat saqlash/yozish mexanizmini
o'zgartiradi (qo'lda/AGY to'g'ridan-to'g'ri DB emas, API orqali avtomatik).

## 3.1 Ikki qatlamli model

**a) `session_checkpoints` — session-scoped, tez eskiruvchi**

| Ustun | Mazmun |
|---|---|
| `session_id` | sessiya identifikatori |
| `project` | qaysi loyiha (zdes, secvault, ...) |
| `boshlangan_vaqt` | — |
| `oxirgi_holat` | ~200–400 tokenlik qisqa xulosa — "qayerga kelindi" |
| `korilgan_muammolar` | qisqa ro'yxat (nima sinab ko'rildi, nima rad etildi) |
| `keyingi_qadam` | — |

Bu — hozirgi `status.md`ning DB ekvivalenti, lekin **majburan qisqa** (fayl
kabi cheksiz uzayib ketmaydi, chunki har checkpoint eskisini almashtiradi,
qo'shilmaydi).

**b) `standing_rules` — cross-session, sekin o'zgaruvchi**

| Ustun | Mazmun |
|---|---|
| `topic` | masalan `"zdes-orcestor-scope"`, `"github-accounts"` |
| `qoida` | qisqa matn |
| `manba` | qaysi sessiya/sana kiritgan |

`session_id`ga bog'lanmaydi, `topic` bo'yicha **unique + UPSERT** — xuddi
shu topic bo'yicha yangi ma'lumot kelsa, yangi qator qo'shilmaydi, mavjudi
yangilanadi. Bu qatlam `orcestor/requirements.MD` va
`backup-plan/overview.md`dagi "Muhim qoidalar" bo'limlarining DB'dagi
muqobili.

## 3.2 Yozuvchi va o'quvchi rollari

- **AGY** — yozuvchi. Checkpoint va (tasdiqlangandan keyin) standing rule
  yozuvlarini DB'ga kiritadi. Tez va arzon (340+ tok/s) — Claude bu mexanik
  ishga o'z (qimmatroq) tokenini sarflamaydi.
- **Claude** — o'quvchi + tasdiqlovchi. Yangi standing rule DB'ga tushishidan
  oldin tekshiradi (orcestor'dagi "Orchestrator — yakuniy texnik qaror"
  roliga mos).

**Faza izohi:** yuqoridagi taqsimot — **Faza A** (yaqin muddatli, shu reja):
AGY DB'ga to'g'ridan-to'g'ri yozadi, lokal. Uzoq muddatli **Faza B**da
([`07-roadmap-nestjs-api-server.md`](./07-roadmap-nestjs-api-server.md))
AGY DB'ga emas, **API'ga** natija yuboradi, DB'ga yozishni API'ning o'zi
avtomatik bajaradi — rollar taqsimoti (Claude tasdiqlovchi, AGY ijrochi)
o'zgarmaydi, faqat yozish yo'li o'zgaradi.

## 3.3 Sikl (5-promptli sprint)

```
[Prompt 1..5] → ish → AGY oxirgi checkpointni yozadi
      ↓
   /clear
      ↓
[Yangi prompt] → faqat quyidagilar yuklanadi:
   - session_checkpoints: oxirgi qator (bitta)
   - standing_rules: faqat shu loyiha/topic bo'yicha filtrlangan qatorlar
   - yangi prompt
   (to'liq tarix YO'Q)
```

## 3.4 Muhim ogohlantirish — DB o'zi token tejamaydi

DB ishlatish o'zi hech narsani tejamaydi — agar `SELECT *` bilan hamma
checkpointlar yoki hamma qoidalar tashib kelinsa, fayldan farqi yo'q.
Tejash ikki narsadan keladi: (1) reload hajmi doim **bitta compact
checkpoint** bo'lishi (to'liq tarix emas), (2) standing rules **faqat
kerakli topic bo'yicha** filtrlanib olinishi. DB'ning haqiqiy afzalligi —
shu selektiv so'rovni tuzilgan (structured) tarzda qilish qulayligi, fayl
bilan ham grep orqali qisman erishish mumkin bo'lgan narsa, lekin DB'da
tabiiyroq.

## 3.5 Infratuzilma savoli (hal qilinmagan)

Local SQLite (bitta noutbuk, RAM 5.7GB) yetarlimi, yoki alohida servis
kerakmi — bu [`04-taxminlar-va-tekshirish.md`](./04-taxminlar-va-tekshirish.md)da
ochiq savol sifatida qoldirilgan.
