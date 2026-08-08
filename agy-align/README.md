# agy-align — AGY'ni o'zi o'rnatadigan portativ skill

**Holat: ✅ birinchi versiya (v1) tayyor.** Manba:
[`agy_upgrading/`](../agy_upgrading/README.md) — 2026-08-08 kuni
o'tkazilgan 13+ real test va mustaqil tashqi dalillar (Google CVE,
`google-gemini/gemini-cli` GitHub issue'lari) asosida.

## Nima bu va nega kerak

`orcestor-skill` Claude uchun ko'p-agentli orkestratsiyani ishga
tushirsa, `agy-align` — **AGY (Antigravity CLI)ning o'zini** sozlaydi.
Farqi: buni Claude emas, **AGY o'zi bajaradi** — skill AGY'ga beriladi,
AGY uni o'qib, o'z global konfiguratsiyasini (`~/.gemini/GEMINI.md`)
o'zi yangilaydi.

Bu ikkita real, testlar bilan tasdiqlangan muammoni yumshatadi:
1. AGY xato/log berilganda tashxissiz darhol faylni tahrirlab yuboradi.
2. AGY o'z tushunchasini tekshirmasdan, taxmin qilib ishga kirishadi.

Ikkalasi ham `~/.gemini/GEMINI.md`ga yozilgan ikkita qoida orqali
yechiladi — bu global fayl headless (`agy -p`) rejimda ham ishonchli
o'qilishi maxsus test bilan tasdiqlangan (loyiha-darajasidagi
`AGENT.md`dan farqli — u ishlamagan). Tafsilot:
[`agy_upgrading/06-test-natijalari.md#h`](../agy_upgrading/06-test-natijalari.md#h-global-geminimd--tuzatuvchi-topilma-2026-08-08-test-10-12).

## Tarkib

```
agy-align/
├── README.md              ← shu fayl
├── SKILL.md                ← AGY bajaradigan ko'rsatma (frontmatter: name, description)
└── rules/
    └── global-rules.md     ← ~/.gemini/GEMINI.md ga o'rnatiladigan qoidalar matni
```

## O'rnatish (foydalanuvchi uchun)

### 1-usul — tezkor, bir martalik (tavsiya etiladi)

AGY'ga (Antigravity CLI'da) shunchaki shu papka yo'lini bering:

```
Quyidagi papkani o'qi va SKILL.md ko'rsatmalariga to'liq amal qil:
/home/fayzillo/Desktop/testing/claude_tasks/agy-align
```

AGY o'zi `~/.gemini/GEMINI.md`ni tekshiradi/yangilaydi va nima
qilinganini qisqa xabar qiladi.

### 2-usul — doimiy o'rnatish (istalgan loyihada nomi bilan chaqirish uchun)

`orcestor-skill`ning o'zi qanday o'rnatilgan bo'lsa xuddi shunday
(`~/.gemini/antigravity-cli/builtin/skills/orcestor-start/` — mavjud,
tekshirilgan andoza):

```bash
cp -r /home/fayzillo/Desktop/testing/claude_tasks/agy-align \
      ~/.gemini/antigravity-cli/builtin/skills/agy-align
```

Shundan keyin istalgan loyihada AGY'ga shunchaki **"agy-align o'rnat"**
deb yozish kifoya — to'liq yo'l kerak emas.

### 3-usul — rasmiy JSON-registratsiya (rasmiy hujjatlashtirilgan, lekin bu qurilmada hali sinalmagan)

Antigravity'ning o'z hujjatlariga ko'ra (`agy-customizations` builtin
skill, `docs/json_configs.md`), global skill-manzillarni
`~/.gemini/config/skills.json` fayli orqali ham ro'yxatga olish mumkin:

```json
{
  "entries": [
    { "path": "/home/fayzillo/Desktop/testing/claude_tasks/agy-align" }
  ]
}
```

Bu fayl hozircha mavjud emas (birinchi marta yaratilishi kerak) — shu
sabab 2-usul (to'g'ridan-to'g'ri nusxalash, `orcestor-skill`da isbotlangan
yo'l) birlamchi tavsiya sifatida qoldirildi.

## Nima o'rnatiladi

`rules/global-rules.md` ikki qatlamdan iborat:

| Band | Ishonch darajasi |
|---|---|
| 1. Xato tuzatish protokoli | ✅ Sinovdan o'tgan (Test 12) |
| 2. Tushunishni tasdiqlash protokoli | ✅ Sinovdan o'tgan (Test 13) |
| 3. Qadam-narratsiya odati (spinner-fe'l o'rnini bosuvchi) | ⚠️ Mexanizm sinovdan o'tgan, bu aniq matn alohida sinalmagan |
| 4. Muvozanatli ohang (anti-laganbardorlik) | ⚠️ Alohida sinovdan o'tkazilmagan |

O'rnatish paytida AGY 3-4-bandlarni qo'shish/qo'shmaslikni so'raydi
(SKILL.md 3-qadam).

## Spinner-verb savolining yakuniy javobi (2026-08-09)

`agy_upgrading/08-spinner-verbs-tadqiqoti.md`da aniqlandiki, Claude
Code'dagi kabi **native** (binary-darajasidagi) spinner-fe'l ro'yxatini
AGY'ga sozlash imkonsiz — kerakli kalitlar (`ui.loadingPhrases`/
`customWittyPhrases`) `agy` binary'sida umuman yo'q.

Lekin ushbu paket **funksional ekvivalentini** taqdim etadi: 3-band
("qadam-narratsiya odati") — bu native terminal-animatsiya emas, balki
AGY'ning o'z javob matnida qisqa holat-so'zlarini ishlatish odati
(masalan "Tashxis qo'yayapman"). Mexanizmning o'zi (global `GEMINI.md`
qoidasi) allaqachon 1-2-bandlarda ishlashi tasdiqlangan — 3-band shu
mexanizmning tabiiy davomi, faqat matni alohida sinalmagan.

Antigravity'ning rasmiy skill/rules tizimi ("global agent yoki skillni
AGY reference orqali yuklab olishi") aynan shu paketning o'zi orqali
amalga oshirilmoqda — `agy-customizations` builtin skill hujjatlariga
ko'ra bu rasman qo'llab-quvvatlanadigan mexanizm (qarang yuqoridagi
3-usul), shunchaki hozircha bu qurilmada faqat 2-usul (to'g'ridan-to'g'ri
nusxalash) amalda sinalgan.
