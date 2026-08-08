# agy-align — AGY'ni o'zi o'rnatadigan portativ skill

**Holat: ✅ v1 tayyor, mustaqil (self-contained) paket — istalgan
kompyuterda, boshqa fayllarga bog'liq bo'lmasdan ishlaydi.**

## Nima bu va nega kerak

`orcestor-skill` Claude uchun ko'p-agentli orkestratsiyani ishga
tushirsa, `agy-align` — **AGY (Antigravity CLI)ning o'zini** sozlaydi.
Farqi: buni Claude emas, **AGY o'zi bajaradi** — skill AGY'ga beriladi,
AGY uni o'qib, o'z global konfiguratsiyasini (`~/.gemini/GEMINI.md`)
o'zi yangilaydi.

Bu ikkita real, testlar bilan tasdiqlangan muammoni yumshatadi:
1. AGY xato/log berilganda tashxissiz darhol faylni tahrirlab yuboradi.
2. AGY o'z tushunchasini tekshirmasdan, taxmin qilib ishga kirishadi.

To'liq dalil, metodologiya va testlar: [`REPORT.md`](./REPORT.md) — shu
paket ichida, tashqi fayl/papkaga bog'liq emas.

## Tarkib

```
agy-align/
├── README.md              ← shu fayl
├── REPORT.md               ← mustaqil dalil-hisoboti (testlar, natijalar, ishonch darajalari)
├── SKILL.md                ← AGY bajaradigan ko'rsatma (frontmatter: name, description)
└── rules/
    └── global-rules.md     ← ~/.gemini/GEMINI.md ga o'rnatiladigan qoidalar matni
```

Paket to'liq mustaqil: qaysi kompyuterga ko'chirilsa ham (yoki open-source
sifatida klon qilinsa ham), ishlashi uchun boshqa hech qanday tashqi
papka yoki fayl kerak emas.

## O'rnatish

### 1-usul — tezkor, bir martalik

Antigravity CLI'da (yoki IDE'da) AGY'ga shu papkaning **siz ko'chirgan/
klon qilgan joyidagi** yo'lini bering:

```
Quyidagi papkani o'qi va SKILL.md ko'rsatmalariga to'liq amal qil:
<agy-align papkasini ko'chirgan joyingiz>
```

AGY o'zi `~/.gemini/GEMINI.md`ni tekshiradi/yangilaydi va nima
qilinganini qisqa xabar qiladi.

### 2-usul — doimiy o'rnatish (istalgan loyihada nomi bilan chaqirish uchun)

Antigravity CLI mahalliy (custom) skill'larni
`~/.gemini/antigravity-cli/builtin/skills/<skill-nomi>/` papkasida
qidiradi va topadi — bu mexanizm ushbu kompyuterda haqiqiy ishlayotgan
boshqa skill (`orcestor-start`) orqali kuzatilgan/tasdiqlangan. Shu
papkaga nusxalang:

```bash
cp -r <agy-align papkasini ko'chirgan joyingiz> \
      ~/.gemini/antigravity-cli/builtin/skills/agy-align
```

Shundan keyin istalgan loyihada AGY'ga shunchaki **"agy-align o'rnat"**
deb yozish kifoya — to'liq yo'l kerak emas.

> **Eslatma:** Antigravity IDE (CLI'dan tashqari) uchun bir xil
> mexanizm `~/.gemini/antigravity/builtin/skills/`da ham bo'lishi mumkin
> — agar IDE'da ham ishlatmoqchi bo'lsangiz, shu papkaga ham nusxalang.

## Nima o'rnatiladi

`rules/global-rules.md` ikki qatlamdan iborat:

| Band | Ishonch darajasi |
|---|---|
| 1. Xato tuzatish protokoli | ✅ To'g'ridan-to'g'ri sinovdan o'tgan |
| 2. Tushunishni tasdiqlash protokoli | ✅ To'g'ridan-to'g'ri sinovdan o'tgan |
| 3. Qadam-narratsiya odati (spinner-fe'l o'rnini bosuvchi) | ⚠️ Mexanizm sinovdan o'tgan, bu aniq matn alohida sinalmagan |
| 4. Muvozanatli ohang (anti-laganbardorlik) | ⚠️ Alohida sinovdan o'tkazilmagan |

Tafsilot: [`REPORT.md`](./REPORT.md). O'rnatish paytida AGY 3-4-bandlarni
qo'shish/qo'shmaslikni so'raydi (`SKILL.md`, 3-qadam).

## Spinner-verb savolining yakuniy javobi

Claude Code'dagi kabi **native** (binary-darajasidagi) spinner-fe'l
ro'yxatini AGY'ga sozlash imkonsiz ekan — kerakli konfiguratsiya
kalitlari `agy` binary'sining o'zida umuman yo'q (`strings` orqali
tekshirilgan). Bu paket **funksional ekvivalentini** taqdim etadi:
3-band ("qadam-narratsiya odati") — bu native terminal-animatsiya emas,
balki AGY'ning o'z javob matnida qisqa holat-so'zlarini ishlatish odati
(masalan "Tashxis qo'yayapman"), 1-2-bandlar bilan bir xil, sinalgan
mexanizm (global `GEMINI.md`) orqali.

## Ochiq savol — global skill-registratsiya (`skills.json`)

Antigravity'da global skill-manzillarni JSON fayl orqali ro'yxatga olish
mexanizmi bor deb tavsiflangan hujjatlarga duch kelindi — biroq bu
hujjatlar ushbu kompyuterda **muallif tomonidan qo'shilgan, alohida
o'rnatilgan skill** ichida topilgan, Antigravity CLI'ning o'zi bilan
standart kelmaydi. Shu sabab bu mexanizm rasmiy/universal deb **tasdiqlab
bo'lmaydi** — shuning uchun yuqoridagi 2-usul (mahalliy skill papkasiga
to'g'ridan-to'g'ri nusxalash, `orcestor-start` orqali mustaqil
tasdiqlangan) birlamchi va yagona tavsiya etilgan o'rnatish yo'li
sifatida qoldirildi.
