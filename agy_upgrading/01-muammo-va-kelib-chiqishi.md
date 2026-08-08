# 1. Muammo va kelib chiqishi

## 1.1 Kelib chiqishi

2026-08-08 kuni `zdes_frontend` loyihasida terminal asoslari (grep/sed/xargs)
haqida suhbat davomida mavzu tabiiy ravishda AGY (Google Antigravity, Executer_Agent
— qarang [`new_fixing_orcestration_system`](../new_fixing_orcestration_system/README.md))ning
ishlash uslubiga o'tdi. Suhbat davomida ikkita alohida, lekin bog'liq muammo aniq
shakllandi.

## 1.2 Muammo 1 — Execution intizomsizligi

AGY'ga xato logi (masalan build/lint xatosi) berilganda, u holatni bayon qilib,
sabab-oqibat tushuntirmasdan **darhol** faylni edit qilishga kirishadi. Natija —
xatolar zanjir shaklida ko'payib ketadi (bitta tuzatish yangi xato chiqaradi, u ham
darhol "tuzatiladi", va h.k.). "O'zgarishni bekor qil" desa bekor qiladi, lekin
o'zicha boshqa bir narsani edit qilib qaytadi — ya'ni asl muammoga o'zi yangi
gipoteza qo'yib, so'ramasdan ijro etadi.

**O'xshashi:** "yosh bolaga o'xshaydi" — signalga darhol reaksiya, oraliq
tekshirish yo'q.

## 1.3 Muammo 2 — Laganbardorlik (sycophancy)

AGY (Gemini asosida) va umuman GPT-oilasi modellari ko'pincha ortiqcha
tasdiqlovchi/maqtovchi ohangda javob beradi ("Ajoyib fikr!", "Juda to'g'ri!").
Bu ohang ba'zi kasblar uchun motivatsion bo'lishi mumkin, lekin **developer ishi
uchun zararli** — chunki bu yerda aniqlik va qat'iylik (noto'g'ri fikrga qarshi
chiqish, zaif tomonni ko'rsatish) muhimroq.

Solishtirma nuqta — Claude (shu suhbatdagi ORCESTOR_AGENT/maslahatchi rolida):
maqtov ham, keraksiz tanqid ham yo'q, sodda va londa (concise) xulosalar beradi.
Foydalanuvchi buni aynan shu muvozanat uchun afzal ko'radi.

## 1.4 Strategik kontekst — nega AGY, nega Claude emas

Bu ikki muammoni "Claude'ga o'tib ketish" bilan emas, **AGY'ni Claude'ga
yaqinlashtirish** bilan yechish qaror qilindi — sababi byudjet:

| | Gemini Pro (AGY) | Claude |
|---|---|---|
| Obuna turi | 1 yillik **sovg'a obuna**, deyarli cheksiz | Hamkasbning obunasi, **foydalanish chegarasi bor** |
| Shaxsiy obuna olish | — | Hozircha byudjetdan ajratib bo'lmaydi |

Demak amaliy yechim: **AGY asosiy ish kuchi bo'lib qoladi**, Claude esa faqat
kerak bo'lganda (murakkab/xavfli holatlarda) maslahatchi/tekshiruvchi rolida
qoladi. Shu sabab AGY'ning o'zini imkon qadar ishonchli va "Claude-uslubi"ga
yaqin qilib sozlash strategik ustuvorlik.

## 1.5 `orcestor` bilan bog'liqligi — farqli qatlam

`zdes_frontend/orcestor/` tizimi (batafsil:
[`new_fixing_orcestration_system`](../new_fixing_orcestration_system/README.md))
Muammo 1'ni **tashqi nazorat** orqali qisman allaqachon yechgan: Claude
(Orcestor_Agent) tashxis qo'yadi va aniq, tor doirali task yozadi, AGY
(Executer_Agent) faqat shu taskni bajaradi — xom xato logini to'g'ridan-to'g'ri
ko'rmaydi.

Lekin bu yechimning narxi bor: **har bir mayda xato uchun ham to'liq
ikki-agentli (Claude+AGY) zanjir ishlatilgani sababli xarajat oshdi**
(Foydalanuvchi kuzatuvi, 2026-08-08).

`agy_upgrading` va `new_fixing_orcestration_system` shu sabab **ikki alohida,
bir-birini to'ldiruvchi qatlam**:

| Qatlam | Papka | Yondashuv |
|---|---|---|
| Tashqi nazorat | `new_fixing_orcestration_system` | Claude tashxis qo'yadi, AGY faqat ijro etadi — xavfsiz, lekin qimmat |
| Ichki tuzatish | `agy_upgrading` (shu papka) | AGY'ning o'zi ko'proq ishonchli bo'ladi — Orcestor zanjiriga murojaat chastotasi kamayadi, demak xarajat kamayadi |

Ikkalasi ham qurilgach, kutilayotgan natija: oddiy/bir-fayllik ishlarda AGY
mustaqil (lekin intizomli) ishlaydi, faqat murakkab/ko'p-fayllik ishlarda
to'liq Orcestor zanjiriga murojaat qilinadi.
