# REPORT — agy-align qoidalari qanday va nega tasdiqlangan

Bu hujjat **mustaqil** — boshqa hech qanday tashqi papka yoki lokal
fayllarga bog'liq emas. `agy-align` skilini boshqa kompyuterda/loyihada
ishlatgan har bir kishi shu faylni o'qib, qoidalarning nega bunday
ekanini tushunishi mumkin.

## Muammo

AGY (Google Antigravity CLI) ikkita takrorlanuvchi xatti-harakat muammosi
ko'rsatadi:

1. **Execution intizomsizligi** — xato logi yoki muammo tavsifi
   berilganda, tashxis qo'ymasdan, tasdiq so'ramasdan darhol faylni
   tahrirlaydi. Bekor qilingandan keyin ham o'zicha boshqa narsa qilib
   qo'yishi mumkin.
2. **Kontekstni tor o'qish** — so'z ma'nosini to'g'ri tushunadi, lekin
   ba'zan aniq bo'lmagan/noaniq so'rovlarda taxmin qilib ish boshlaydi,
   o'rniga savol berish o'rniga.

## Metodologiya

Sandbox Node.js loyihada (`math.js` faylida atayin bug, `test.js` orqali
avtomatik aniqlanadigan xato) `agy -p "..."` orqali headless chaqiruvlar
qilindi, natijalar `git diff` va JSON javob orqali tekshirildi. Jami
13+ test, turli sozlama kombinatsiyalari bilan (CLI bayroqlari, loyiha-
darajasidagi qoidalar fayli, global qoidalar fayli, promptning o'ziga
yozilgan ko'rsatma).

## Asosiy natijalar

| Sinalgan mexanizm | Natija |
|---|---|
| `--mode plan` (CLI bayrog'i) | ❌ Headless (`agy -p`) rejimda tahrirni to'xtatmadi |
| Loyiha-darajasidagi qoidalar fayli (`AGENT.md`, joriy ishchi papkada) | ❌ Headless bitta-martalik chaqiruvda e'tiborga olinmadi |
| **Global qoidalar fayli** (`~/.gemini/GEMINI.md`) | ✅ Headless rejimda ham ishonchli o'qildi va qo'llanildi |
| Promptning o'ziga yozilgan aniq ko'rsatma | ✅ Ishladi (lekin har safar qo'lda yozish talab qiladi — global fayl buni bir martaga tushiradi) |

**Xulosa:** faqat bitta mexanizm ham arzon, ham ishonchli chiqdi — global
`~/.gemini/GEMINI.md`ga bir marta yozilgan qoida. Loyiha-darajasidagi
fayllar yoki CLI bayroqlari ishonch bermaydi.

## Konkret testlar (qisqacha)

- **Diagnostika-qoidasi:** xom xato logi, hech qanday qo'shimcha
  ko'rsatmasiz, global faylga "avval tashxis qo'y, tasdiqlanmaguncha
  o'zgartirma" qoidasi qo'shilganda — fayl o'zgarmadi, AGY tashxis qo'yib
  aniq tasdiq so'radi.
- **Tushunish-tasdiqlash qoidasi:** noaniq vazifa ("faylni yaxshila", yo'l
  ko'rsatilmagan) berilganda, global faylga tegishli qoida qo'shilgach —
  AGY taxmin qilmasdan, aniq savol berdi.

## Mustaqil tashqi tasdiq

Bu ikki muammo shaxsiy kuzatuv emas — Google'ning o'z xavfsizlik
byulleteni (GHSA-wpqr-6v78-jr5g, 2026-04) tan olganki, Gemini CLI
oilasida ruxsat-tekshiruv faqat ro'yxatga olish vaqtida bajariladi, ijro
vaqtida emas. `google-gemini/gemini-cli` ochiq GitHub repozitoriysida
o'nlab mustaqil issue xuddi shu "bekor qilingandan keyin ham davom etish"
naqshini tasdiqlaydi (masalan issue #18525, #13758, #12044, #22145).

## Ishonch darajalari (`rules/global-rules.md`dagi bandlarga mos)

| Band | Ishonch |
|---|---|
| 1. Xato tuzatish protokoli | Yuqori — to'g'ridan-to'g'ri sinaldi |
| 2. Tushunishni tasdiqlash protokoli | Yuqori — to'g'ridan-to'g'ri sinaldi |
| 3. Qadam-narratsiya odati | O'rta — mexanizmi (global fayl) sinalgan, bu aniq matn alohida sinalmagan |
| 4. Muvozanatli ohang | O'rta — mexanizmi sinalgan, bu aniq matn alohida sinalmagan |

## Nega global fayl, nega loyiha fayli emas

Bitta ehtimoliy izoh (tasdiqlanmagan gipoteza): loyiha-darajasidagi
qoidalar fayllari ehtimol faqat interaktiv workspace-sessiyalarda yoki
maxsus bayroqlar (masalan `--add-dir`) bilan yuklanadi, headless
bitta-martalik (`-p`) chaqiruv esa bu yuklashni amalga oshirmasligi
mumkin. Global fayl, aksincha, foydalanuvchi profiliga bog'liq bo'lgani
uchun har doim yuklanadi.
