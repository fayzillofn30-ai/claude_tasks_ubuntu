# 7. Uzoq muddatli roadmap: NestJS API server

**Holat: ROADMAP — hozirgi implementatsiya emas.** Bu fayl 03–06'dagi
yaqin muddatli rejani (Faza A: lokal, SQLite, AGY to'g'ridan-to'g'ri
DB'ga yozadi) bekor qilmaydi — uning ustiga quriladigan **keyingi bosqich
(Faza B)** sifatida qayd etilmoqda.

## 7.1 G'oya

Hozirgi rejada (Faza A) checkpoint/history/standing-rule/task holatini
saqlash AGY orqali, DB'ga to'g'ridan-to'g'ri yozish bilan ishlaydi — bu
hali ham qisman qo'lda nazoratga muhtoj. Faza B'da bu **to'liq
avtomatlashtiriladi**: alohida **NestJS API server** quriladi.

Oqim:

```
Agent (masalan AGY) ish yakunlaydi
   → natijani API'ga yuboradi (HTTP so'rov)
      → API kerakli yozuvlarni (checkpoint / history / standing-rule / task holati)
        avtomatik DB'ga saqlaydi
```

Ya'ni yozish mantig'i AGY'ning o'zidan (yoki Claude'dan) **API qatlamiga**
ko'chadi — agent faqat natijani yuboradi, saqlash formatini/joyini
bilishi shart emas.

## 7.2 Fonda CLI-agent ishlatish

NestJS API ichida CLI-agent (masalan `agy --print`) **fon jarayoni**
sifatida chaqirilishi mumkin — ya'ni server o'zi kerakli paytda agentni
ishga tushirib, natijasini API orqali qayta ishlaydi. Bu Faza A'dagi
"AGY — kotib" metaforasini ([`02-metaforalar.md#21`](./02-metaforalar.md))
bir qadam oldinga olib boradi: kotib endi mustaqil, server ichida ishlaydi.

## 7.3 Motivatsiya: serverga o'tish sababi

- AGY kabi agent-API'lar odatda **pullik**. Shuning uchun bitta server
  ijaraga olinib, shu serverda API'lar chiqariladi.
- Lokal noutbukka esa faqat **terminal-CLI agent** o'rnatiladi, u shu
  NestJS loyihaga (serverdagi API'ga) ulanadi — og'ir hisoblash
  (compute) serverga o'tadi, **lokal kompyuterga yuklama tushmaydi**.
- DB ham serverda turadi (Faza A'dagi "local SQLite, bitta noutbuk"
  taxminidan farqli — [`04-taxminlar-va-tekshirish.md#44`](./04-taxminlar-va-tekshirish.md#44-db-qayerda-turadi)
  savolini Faza B boshqacha hal qiladi: **serverda markazlashgan DB**).

## 7.4 Hujjatlar va GitHub sinxronizatsiyasi

Server holati (checkpoint/history/standing-rule) va tizim qo'llanmasi
**GitHub'da saqlanadi va avtomatik yangilanib boradi** — ya'ni serverdagi
DB holatidan davriy/hodisaviy ravishda hujjat holatiga (masalan
`claude_tasks` uslubidagi markdown) sinxronlanadi. Bu ikki foyda beradi:
versiyalash (git tarixi) va serverdan mustaqil o'qish imkoniyati (server
o'chiq bo'lsa ham oxirgi holat GitHub'da ko'rinadi).

## 7.5 Bosqichlash — Faza A vs Faza B

| | Faza A (hozirgi reja, 01–06) | Faza B (bu fayl, roadmap) |
|---|---|---|
| Joylashuv | Lokal noutbuk | Ijaraga olingan server |
| DB | Local SQLite (taxmin) | Server-DB, markazlashgan |
| Yozuvchi | AGY, DB'ga to'g'ridan-to'g'ri | API, agent yuborgan natija asosida avtomatik |
| Claude/AGY yuklamasi | Lokal CPU/RAM | Terminaldagi CLI-agent faqat serverga ulanadi |
| Hujjat holati | `claude_tasks/` ichida qo'lda | Serverdan GitHub'ga avtomatik sinxron |
| Boshlanish sharti | Hech narsa — hozir ham qurish mumkin | Faza A pilot (UC1) muvaffaqiyatli bo'lgandan keyin mantiqan |

## 7.6 Ochiq xavflar / keyin hal qilinadigan savollar

Bu roadmap bosqichida qo'shimcha, hali chuqur o'ylanmagan savollar (Faza
A'dagi [4-fayl](./04-taxminlar-va-tekshirish.md) uslubida, lekin alohida —
chunki Faza B'ga xos):

- **Xarajat:** server ijarasi + agent API pullik chaqiruvlari — oylik
  xarajat hozircha baholanmagan.
- **Yagona nuqta halokati:** server o'chsa/tarmoq uzilsa, checkpoint/
  standing-rule'ga kirish yo'qoladi (GitHub sinxronizatsiyasi buni
  qisman yumshatadi — 7.4).
- **Xavfsizlik:** API tashqi serverda turgani uchun autentifikatsiya/
  ruxsat nazorati kerak — hali loyihalashtirilmagan.
- **Server-DB ↔ GitHub docs sinxronizatsiyasi:** ikki manba orasida
  konflikt yuzaga kelishi mumkinmi (masalan qo'lda GitHub'da tuzatish
  qilinsa, server DB bilan mos kelmay qolishi) — hal qilinmagan.
