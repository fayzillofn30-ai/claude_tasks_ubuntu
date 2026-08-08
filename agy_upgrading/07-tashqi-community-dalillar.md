# 7. Tashqi (community/rasmiy) dalillar — Gemini CLI developer feedback

**Holat: TASDIQLANGAN — mustaqil manbalar.** Bu fayl
[6-bo'lim](./06-test-natijalari.md)dagi shaxsiy testlarni **mustaqil**
tashqi dalillar bilan tasdiqlaydi. Antigravity (`agy`) Gemini
asosida qurilgan bo'lgani uchun, ochiq Gemini CLI (`google-gemini/gemini-cli`)
loyihasidagi hujjatlashtirilgan muammolar bevosita aloqador — arxitektura
va modellar bir xil oilaga tegishli.

## 7.1 Permission/allowlist real vaqtda ijro etilmagan — rasmiy CVE

Google'ning o'z xavfsizlik byulleteni (**GHSA-wpqr-6v78-jr5g**, 2026-04-24,
Gemini CLI v0.39.1/v0.40.0-preview.3'da tuzatilgan):

> "Gemini CLI parsed its tool allowlist only when registering the tool; at
> runtime nothing enforced it, and under `--yolo` every command the model
> asked for was auto-approved."

**6-bo'limga bog'liqligi:** bu — mening Test 1/5'da kuzatgan hodisamning
(fayl-yozish va shell-komanda ruxsatlari alohida, ba'zan kutilganidan
boshqacha ishlashi) **mustaqil, rasmiy tasdig'i**. Google'ning o'zi tan
olganki, ruxsat tizimi faqat **ro'yxatga olish** vaqtida tekshiriladi,
**ijro** vaqtida emas — bu xuddi men kuzatgan "fayl jim tahrirlandi, lekin
buyruq bloklandi" assimetriyasiga mos keladigan arxitektura naqshi.

Manba: [Google Fixes CVSS 10 Gemini CLI CI RCE — TheHackerNews](https://thehackernews.com/2026/04/google-fixes-cvss-10-gemini-cli-ci-rce.html),
[Gemini CLI CVSS 10.0: RCE in AI Developer Tools — CSA Labs](https://labs.cloudsecurityalliance.org/research/csa-research-note-gemini-cli-rce-cvss10-ai-tool-security-202/)

## 7.2 "Loop" — Muammo 1'ning ("bekor qil"dan keyin ham davom etadi) keng tarqalgan shakli

`google-gemini/gemini-cli` rasmiy GitHub repozitoriysida **o'nlab** ochiq
muammo bor, aynan Foydalanuvchi tasvirlagan xatti-harakat bilan bir xil
naqshda:

| Issue | Tavsif |
|---|---|
| [#18525](https://github.com/google-gemini/gemini-cli/issues/18525) | Agent javoblar orasida "qotib qoladi", faqat bekor qilib qayta so'rash orqali davom etadi |
| [#13758](https://github.com/google-gemini/gemini-cli/issues/13758) | Tez-tez loop'ga tushib qoladi; bekor qilib qayta urinish ko'pincha yordam beradi |
| [#12044](https://github.com/google-gemini/gemini-cli/issues/12044) | Cheksiz loop — bir necha marta to'xtatib, yangi prompt berilsa ham xuddi shu fikr/jarayonni takrorlayveradi |
| [#22145](https://github.com/google-gemini/gemini-cli/issues/22145) | Aniq "e'tiborsiz qoldir" deb aytilgan bo'lsa ham, loop davom etadi |
| [#23240 (discussion)](https://github.com/google-gemini/gemini-cli/discussions/23240) | Custom tool 10–15 marta ketma-ket qayta chaqiriladi |

**Xulosa:** Foydalanuvchining "bekor qil desam bekor qiladi, lekin yana
nimanidir edit qilib qaytadi" ta'rifi — bu **noyob, shaxsiy tajriba emas**,
balki Gemini CLI oilasining keng, rasmiy repo'da hujjatlashtirilgan,
hozirgacha to'liq yechilmagan arxitektura muammosi. Bu Muammo 1'ning
og'irlik darajasini oshiradi: sozlama bilan "tuzatish" emas, balki **model
oilasining tizimli xususiyati** bilan ishlayapmiz.

## 7.3 Mustaqil developer sharhlari — Claude Code bilan solishtirma

Bir nechta 2026-yilgi qiyosiy sharh (Real Python, DataCamp va boshqalar)
umumiy naqshni tasdiqlaydi:

> "Claude Code was more cautious and better at preserving intent during
> multi-step edits, while Gemini CLI was fast and comfortable with a lot of
> context. However, both also made mistakes developers would not want
> merged without review."

> "Gemini Flash 'gets tired' in extended sessions, with developers
> reporting they take over manual control around 75% of the time."

**Xulosa:** "tez, lekin nazoratsiz" va "sekin, lekin ehtiyotkor" farqi —
Foydalanuvchining shaxsiy taassuroti emas, **keng tarqalgan, mustaqil
kuzatilgan naqsh**. Ba'zi developerlar ikkalasini birga ishlatadi: Gemini
CLI tezkor tadqiqot/reja uchun, Claude Code aniqlik kerak bo'lganda — bu
aynan `agy_upgrading`da qabul qilingan strategiyaga ([1.5-band](./01-muammo-va-kelib-chiqishi.md#15-orcestor-bilan-boglligi--farqli-qatlam))
mos keladi.

Manba: [Gemini CLI vs Claude Code — Real Python](https://realpython.com/gemini-cli-vs-claude-code/),
[Gemini CLI vs. Claude Code — DataCamp](https://www.datacamp.com/blog/gemini-cli-vs-claude-code)

## 7.4 Umumiy ta'sir — `agy_upgrading` strategiyasiga

Bu tashqi dalillar [5-bo'lim](./05-xulosa-va-keyingi-qadamlar.md)dagi
xulosani **kuchaytiradi, o'zgartirmaydi**: Muammo 1 (execution
intizomsizligi) sozlama-darajasida emas, arxitektura-darajasida — bu endi
nafaqat mening 7 ta shaxsiy testim, balki Google'ning o'z CVE tan olishi va
o'nlab mustaqil GitHub issue bilan tasdiqlangan. Demak `orcestor`ning tor,
matnli-task yondashuvi (tashqi nazorat) — **eng ishonchli, hozircha
yagona ma'lum ishlaydigan** yechim bo'lib qolmoqda, sozlama-darajasidagi
"tezkor yo'l" umidlari asossiz ekan.

Sources:
- [GHSA-wpqr-6v78-jr5g / Google Fixes CVSS 10 Gemini CLI CI RCE — TheHackerNews](https://thehackernews.com/2026/04/google-fixes-cvss-10-gemini-cli-ci-rce.html)
- [Gemini CLI CVSS 10.0: RCE in AI Developer Tools — Cloud Security Alliance Labs](https://labs.cloudsecurityalliance.org/research/csa-research-note-gemini-cli-rce-cvss10-ai-tool-security-202/)
- [Google's Gemini CLI Has a Reliability Problem Developers Can't Ignore — HackerNoon](https://hackernoon.com/googles-gemini-cli-has-a-reliability-problem-developers-cant-ignore)
- [Agent Stuck between Responses — gemini-cli #18525](https://github.com/google-gemini/gemini-cli/issues/18525)
- [frequently getting stuck in loops — gemini-cli #13758](https://github.com/google-gemini/gemini-cli/issues/13758)
- [CLI stuck in an endless loop — gemini-cli #12044](https://github.com/google-gemini/gemini-cli/issues/12044)
- [Looping — gemini-cli #22145](https://github.com/google-gemini/gemini-cli/issues/22145)
- [Agent keeps calling tools repeatedly — gemini-cli discussion #23240](https://github.com/google-gemini/gemini-cli/discussions/23240)
- [Gemini CLI vs Claude Code: Which to Choose for Python Tasks — Real Python](https://realpython.com/gemini-cli-vs-claude-code/)
- [Gemini CLI vs. Claude Code: Differences and Use Cases (2026) — DataCamp](https://www.datacamp.com/blog/gemini-cli-vs-claude-code)
