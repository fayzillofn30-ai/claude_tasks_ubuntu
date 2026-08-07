# Orcestor Start Skill (`orcestor-start`)

Ushbu skill loyihalarda AI-agentlar orkestratsiyasini (Orchestrator, Executor hamda Supervisor rollari bilan) oson va portativ ravishda ishga tushirish va boshqarish imkonini beradi.

> ### AI agentlarga to'g'ridan-to'g'ri ko'rsatma
> Agar sen AI agentsan (Claude Code, Codex, yoki boshqa) va foydalanuvchi
> seni shu faylni o'qishga yo'naltirgan bo'lsa (masalan "README.md'ni o'qi",
> "shu skillni ishga tushir" kabi so'rov bilan) — bu YETARLI TRIGGER, rasmiy
> Skill-chaqiruv mexanizmini kutib o'tirma. LEKIN Bootstrap savol-javobini
> DARHOL BOSHLAMA — avval quyidagini bajar:
> 1. Ushbu fayl (README.md) va `SKILL.md` mazmunini o'qi.
> 2. Foydalanuvchiga **qisqa** qilib tushuntir: bu skill nima qiladi (rollar,
>    lifecycle, asosiy imkoniyatlar — 3-5 gapda, batafsil emas).
> 3. Shundan keyin ANIQ SO'RA: "Bootstrap'ni (sozlash savol-javobini) hozir
>    boshlaymizmi?" — faqat foydalanuvchi tasdiqlagach (ha/boshla/davom et
>    kabi javobdan keyin), `SKILL.md`dagi Bootstrap/Resume jarayonini
>    0-qadamdan (til tanlash) boshla.
> Boshqacha aytganda: **"README.md'ni o'qi" = "nima ekanini tushuntir, keyin
> ruxsat so'rab, orkestratsiyani boshla"** — bootstrapga bevosita sakrash
> emas.

## Tezkor boshlash (foydalanuvchi uchun, qadam-baqadam)

1. **Talablar:** `agy` (Antigravity CLI) PATH'da bo'lishi kerak. Docker esa FAQAT DB rejimida Postgres/MySQL tanlansa kerak.
2. **O'rnatish** — pastdagi "O'rnatish" bo'limidan birini tanlab, paketni nusxalang.
3. **Yangi sessiya oching** (skilllar ro'yxati sessiya boshida yuklanadi — o'rnatgandan keyin ochiq turgan sessiyada ko'rinmaydi).
4. Loyiha papkasida agentga shuni yozing: **"orkestratsiya boshla"** yoki **"README.md'ni o'qi"** (ikkalasi ham ishlaydi — yuqoridagi ko'rsatmaga qarang).
5. Agent avval **qisqa tushuntiradi** (bu skill nima qilishi) va **"Bootstrap'ni hozir boshlaymizmi?"** deb so'raydi — darhol savol-javobga sakramaydi.
6. Tasdiqlagach — **Bootstrap** suhbati boshlanadi: til tanlash → (eski loyihada) tezkor tahlil → bir nechta sozlash savoli → `orcestor/` avtomatik yaratiladi → oxirida `/clear` tavsiyasi beriladi (tanlov sizniki).
7. **Keyingi safarlar** — shu loyihada shunchaki qayta "orkestratsiya boshla" deyish kifoya: tushuntirish/ruxsat-savoli qayta berilmaydi (bu faqat birinchi, README orqali kirishga xos), oxirgi holatdan (**Resume**) avtomatik davom etadi.

Tafsilotlar (rollar, lifecycle, konflikt-himoya mexanizmlari) — `SKILL.md`da.

## Xususiyatlari
- **Portativlik**: Loyihaga moslashuvchan, shaxsiy papka yo'llari yoki ismlarga bog'lanmagan.
- **Minimal Context Backup**: Har sessiyada faqat eng kerakli checkpoint (`simple_context.md`) o'qiladi, ortiqcha token sarfi oldi olinadi.
- **Bir nechta Tracking Mode**: Ish jarayonini fayllar bilan (`file-based`) yoki DB bilan (`db-based`: sqlite / postgres / mysql, tanlov sizniki) kuzatish mumkin.
- **Eski loyihalar uchun `project_status`**: mavjud kod bazasiga tezkor/tejamkor tahlil qilib, struktura/qoidalar/tarix/muammolarni doimiy saqlab boradi.

## Talablar
- **`agy` (Antigravity CLI)** — `Executer_Agent` rolida kod yozish va buyruqlarni bajarish uchun tizim `PATH`ida o'rnatilgan bo'lishi kerak.
- **Python 3** — `TRACKING_MODE=db` tanlansa, `scripts/orcestor.py` uchun (stdlib only, qo'shimcha paket kerak emas).
- **Docker + Docker Compose** — FAQAT `DB_ENGINE=postgres` yoki `DB_ENGINE=mysql` tanlansa kerak (konteyner ichidagi user/password asosiy ilova bazasiga hech qanday ta'sir qilmaydi — izolyatsiya shu orqali ta'minlanadi). `DB_ENGINE=sqlite` yoki `TRACKING_MODE=file` uchun Docker shart emas.

## O'rnatish — Global yoki Loyiha-darajasida? (tanlov sizniki)

O'rnatishdan oldin shu ikkisidan birini tanlang. Agar skillni siz uchun kimdir
(masalan AI agent) o'rnatayotgan bo'lsa, u ushbu farqni tushuntirib, aynan
shu savolni SIZDAN so'rashi kerak — avtomatik hal qilmasligi lozim.

| | **Global** (`~/.claude/skills/`) | **Loyiha-darajasida** (`<loyiha>/.claude/skills/`) |
|---|---|---|
| Qamrov | Kompyuteringizdagi **BARCHA** loyihalarda ishlaydi | Faqat **shu bitta** loyihada ishlaydi |
| Ulashish | Faqat sizning mashinangizda, boshqalarga avtomatik ko'chmaydi | Loyiha bilan birga git'ga tushsa — jamoa a'zolari ham oladi |
| Mos holat | Siz orkestratsiyani odatiy ish uslubi sifatida ko'p loyihada qo'llasangiz | Faqat bitta muayyan loyiha/jamoa uchun standartlashtirmoqchi bo'lsangiz |

**1. Global o'rnatish:**
```bash
cp -r orcestor-skill ~/.claude/skills/orcestor-start
```

**2. Loyiha-darajasida o'rnatish:**
```bash
cp -r orcestor-skill <loyiha-papkasi>/.claude/skills/orcestor-start
```

## Foydalanish

Claude Code yoki mos keluvchi agent interfeysida quyidagi kabi so'rovlarni yozing:
- `"orkestratsiya boshla"`
- `"orcestor ishga tush"`
- `"start orchestration"`

Birinchi marta ishga tushirilganda **Bootstrap** rejimi ishga tushadi va bir nechta savol orqali loyiha sozlanadi (tafsilot: `SKILL.md`). Keyingi safar ishga tushirilganda esa oxirgi checkpoint'dan **Resume** rejimi davom etadi.

**Muhim — bootstrap tugagach:** Bootstrap/sozlash suhbati o'zi ham token
sarflaydi. Shu sabab, sozlash tugagach, asosiy ish (task'larni bajarish)
boshlanishidan oldin context'ni tozalash (`/clear` yoki mos buyruq) tavsiya
etiladi — bu shart emas, tanlov Supervisor_User'niki, lekin tejamkorlik
uchun tavsiya qilinadi.
