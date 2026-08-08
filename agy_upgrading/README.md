# agy_upgrading — AGY (Antigravity)ni Claude uslubiga yaqinlashtirish rejasi

**Holat: REJA bosqichida (2026-08-08 boshlangan) — hali qo'llanilmagan.**

Bu papka kod emas, **g'oyalarni yo'qotmaslik uchun yozilgan reja
hujjatlari** — `zdes_frontend` loyihasidagi suhbat davomida Fayzillo bergan
vaziyat/muammolar asosida Claude tomonidan jamlanib boriladi. Maqsad: AGY
(Google Antigravity, `orcestor`dagi Executer_Agent)ning ikkita xatti-harakat
muammosini — (1) tashxissiz darhol execution, (2) laganbardor ohang —
sozlama va prompt-darajasida tuzatish.

## Kelib chiqishi (qisqa)

Gemini Pro obunasi (AGY quvvatlantiruvchisi) Fayzillo'ga 1 yillik, deyarli
cheksiz sovg'a sifatida kelgan; Claude esa hamkasbning chegaralangan
obunasi orqali ishlatiladi. Shu sabab strategik yo'nalish — Claude'ga
o'tish emas, **AGY'ni imkon qadar Claude uslubiga yaqinlashtirish**, shunda
AGY asosiy ish kuchi bo'lib qoladi, Claude faqat kerak bo'lganda maslahatchi
rolida ishlaydi (tafsilot: [`01-muammo-va-kelib-chiqishi.md#14`](./01-muammo-va-kelib-chiqishi.md#14-strategik-kontekst--nega-agy-nega-claude-emas)).

## `new_fixing_orcestration_system` bilan bog'liqligi

Bu ikki papka bir-birini to'ldiradi, bir-birini bekor qilmaydi:

| Papka | Yondashuv |
|---|---|
| [`new_fixing_orcestration_system`](../new_fixing_orcestration_system/README.md) | **Tashqi nazorat** — Claude tashxis qo'yadi, AGY faqat ijro etadi. Ishonchli, lekin har mayda ishda ham ikki-agentli zanjir ishlagani uchun qimmat. |
| `agy_upgrading` (shu papka) | **Ichki tuzatish** — AGY'ning o'zi ko'proq ishonchli/intizomli bo'ladi, Orcestor zanjiriga murojaat chastotasi (demak xarajat) kamayadi. |

Tafsilot: [`01-muammo-va-kelib-chiqishi.md#15`](./01-muammo-va-kelib-chiqishi.md#15-orcestor-bilan-boglligi--farqli-qatlam).

## O'qish tartibi

1. [`01-muammo-va-kelib-chiqishi.md`](./01-muammo-va-kelib-chiqishi.md) — ikki muammo, byudjet konteksti, orcestor bilan bog'liqlik
2. [`02-topilgan-mexanizmlar.md`](./02-topilgan-mexanizmlar.md) — Antigravity rasmiy hujjatlaridan topilgan mexanizmlar (execution mode, `/plan`, rules fayllari, Memory Bank)
3. [`03-taklif-qilingan-yechim.md`](./03-taklif-qilingan-yechim.md) — taklif qilingan sozlamalar + persona blok (GEMINI.md) + xarajat-triage strategiyasi
4. [`04-taxminlar-va-tekshirish.md`](./04-taxminlar-va-tekshirish.md) — tekshirilmagan taxminlar, ochiq savollar (jumladan orcestor bilan ziddiyat xavfi)
5. [`05-xulosa-va-keyingi-qadamlar.md`](./05-xulosa-va-keyingi-qadamlar.md) — umumiy xulosa, keyingi amaliy qadamlar
6. [`06-test-natijalari.md`](./06-test-natijalari.md) — **real testlar** (`agy -p` orqali, 7 ta test) — 03-bo'limdagi taklifning bir qismini rad etadi/tuzatadi
7. [`07-tashqi-community-dalillar.md`](./07-tashqi-community-dalillar.md) — mustaqil tashqi dalillar (Google'ning o'z CVE'si, GitHub issue'lar, developer sharhlari) — 06-bo'limdagi shaxsiy testlarni tasdiqlaydi

**Qoida (`claude_tasks` konvensiyasiga mos):** noto'g'ri chiqqan yoki rad
etilgan g'oyalar bu papkadan o'chirilmaydi, "❌ RAD ETILDI" deb belgilanadi.
