# orcestor-skill — ish jurnali

**Holat: ✅ birinchi versiya tayyor, funksional sinovdan o'tgan.**
Manba: shu papka. O'rnatilgan (global): `~/.claude/skills/orcestor-start/`.

## Nima bu

Portativ Claude Code Skill (`orcestor-start`) — loyihada ko'p agentli
orkestratsiyani (Orchestrator/Executor/Supervisor rollari bilan) bitta
komanda ("orkestratsiya boshla" yoki "README.md'ni o'qi") orqali ishga
tushiradi yoki mavjud sessiyani davom ettiradi. `new_fixing_orcestration_system/`
rejasidagi "small context backup" konsepsiyasi va `zdes/orcestor` (eski,
ishlab turgan tizim) tahlili asosida qurilgan — batafsil kelib chiqishi
o'sha papkada, bu yerda faqat yakuniy artefakt va qurish jarayonidagi
topilmalar.

## Asosiy arxitektura qarorlari

- **Rol-token konvensiyasi**: `Supervisor_User` / `Orcestor_Agent` /
  `Executer_Agent` — haqiqiy ism FAQAT bitta faylda (`orcestor.config.env`,
  `.env` uslubi). Boshqa hech bir hujjatda shaxsiy ism yo'q (tekshirilgan,
  toza).
- **`Executer_Agent` doim `agy`** (Antigravity CLI), `Orcestor_Agent` esa
  ixtiyoriy (Claude Code, Codex, va h.k.).
- **Ikki tracking rejimi**: `file` (papka-lifecycle, zdes uslubi) va `db`
  (3 dvigatel: `sqlite` / `postgres` / `mysql` — tanlov foydalanuvchiniki,
  skill faqat tavsiya beradi).
- **`simple_context.md`** — majburiy, qisqa (200-400 so'z) checkpoint;
  restart faqat Supervisor_User so'raganda (qattiq prompt-limit yo'q).
- **`project_status/overview.md`** — ESKI loyihalar uchun, doimiy
  to'planadigan bilim (struktura/qoidalar/tarix/muammolar), Executer_Agent
  orqali tezkor/tejamkor tahlil qilinadi.
- **Til tanlash** — bootstrap'ning ENG BIRINCHI qadami, ikki tilda so'raladi.
- **README.md o'zi trigger** — AI agent shu faylni o'qisa, avval qisqa
  tushuntiradi, keyin "boshlaymizmi?" deb so'raydi (darhol savol-javobga
  sakramaydi).

## Konflikt-himoya (eng ko'p vaqt shu yerga ketdi)

- **DB rejimi**: `task claim` — atomik (Postgres: `FOR UPDATE SKIP LOCKED`;
  MySQL: bitta tranzaksiyada SELECT+UPDATE; SQLite: bitta connection ichida
  UPDATE+rowcount). Barcha 5 jadvalga (`tasks`, `task_events`,
  `changed_files`, `standing_rules`, `session_checkpoints`) `workspace_path`
  ustuni qo'shildi — bitta DB bir nechta loyiha orasida ulashilsa ham,
  har bir so'rov shu ustun bilan filtrlanadi (real testda tasdiqlangan: SQLite
  va Postgres'da begona workspace_path'li qatorlar ko'rinmaydi/tegilmaydi).
- **Konteyner qayta ishlatish**: bootstrap'da mavjud `orcestor-db*`
  konteynerlarni tekshirib, foydalanuvchidan qayta ishlatish yoki yangi
  yaratishni so'raydi. Qayta ishlatilsa — `POSTGRES_DB`/`MYSQL_DATABASE`
  albatta loyihaga xos (masalan `orcestor_<loyiha-nomi>`). Baza mavjud
  bo'lmasa avtomatik yaratiladi (real testda tasdiqlangan: bitta konteyner,
  ikkita loyiha, ikkita baza — aralashmadi).
- **File rejimi**: claim — fayl `tasks/`→`task_pending/`ga ATOMIK ko'chirish
  (mv/rename) orqali; "topilmadi" xatosi normal (boshqa sessiya oldi).
  Workspace-aro himoya: `WORKSPACE_PATH` (mutlaq yo'l) bootstrap'da
  yoziladi, Resume'da solishtiriladi — mos kelmasa (papka ko'chirilgan
  bo'lsa) ogohlantirish beriladi.

## Topilgan va tuzatilgan real xatolar (AGY gallyutsinatsiyasi — qo'lda tekshirib topilgan)

Bular — `04-taxminlar-va-tekshirish.md` 4.2-banddagi "AGY ishonchlilik
pattern"ining amaliy tasdig'i, shu skillni qurish jarayonida:

1. DB yo'li nomuvofiqligi (`.orcestor` vs `orcestor/db`) — birinchi
   qoralamada.
2. `scripts/orcestor.py`ning sxemasi `templates/db-schema.sql`dan
   butunlay farq qilardi (3 vs 5 jadval) — yagona sxema-manbaga
   birlashtirildi.
3. `standing_rules.example.json`da eski "5 promptdan keyin /clear"
   qoidasi — yangi kelishuvga (foydalanuvchi nazorati) zid edi.
4. **Jiddiy**: `MySQLAdapter.claim_task()` ikkita ALOHIDA `docker exec`
   chaqiruvida ishlagani uchun tranzaksiya/lock ikkinchisigacha
   saqlanmasdi — "atomik claim" aslida atomik emas edi. Bitta chaqiruvga
   birlashtirib tuzatildi.
5. **Jiddiy, faqat live-testda topildi**: `psql`da `-q` bayrog'i yo'qligi
   sababli, RETURNING natijasidan keyingi "UPDATE N" xizmatchi qatori
   soxta "ma'lumot qatori" sifatida parse qilinardi — 0 mos qator bo'lganda
   ham soxta "claimed" natija chiqarardi. `-q` qo'shib tuzatildi, qayta
   test qilindi.

**Xulosa**: agy natijasini hech qachon ko'r-ko'rona qabul qilmaslik kerak —
kamida asosiy oqim (happy path + zero-result holat) qo'lda/real muhitda
sinab ko'rilishi shart, chunki xatolar ko'pincha faqat chekka holatlarda
(zero rows, ikki alohida chaqiruv orasidagi tranzaksiya) ko'rinadi.

6. **Foydalanuvchi real sinovda topdi (2026-08-04, `GoogleAiStudio` test
   papkasida)**: `agy`ni Executer_Agent qilib skill sinalganda, boshida
   yaxshi ishladi, keyin agy o'zicha `src/` papka ochib, so'ralmagan
   Angular loyihasi yoza boshladi.
   - **Birinchi gipoteza (RAD ETILDI):** agy'da loyihalar-aro "xotira"
     bor deb o'ylandim, `conversation_summaries.db`dagi `workspace_uris`
     ustunini asos qilib. Bu YETARLI ISBOT emas edi — keyingi tekshiruv
     (foydalanuvchi tomonidan, boshqa terminalda) buni rad etdi.
   - **Aniq, tasdiqlangan sabab:** `task-18.log`da `file://` havolalar
     orqali isbotlandi — bu gallyutsinatsiya/xotira EMAS, mexanik bug:
     Orcestor rolida ham `agy` ishlatilgan edi (foydalanuvchining "agy->agy"
     variantida), va SKILL.md ko'rsatmasi bo'yicha ICHKI/NESTED `agy -p
     "..." --dangerously-skip-permissions` chaqirilganda **hech qanday
     aniq path argumenti berilmagan edi**. Natijada ichki chaqiruv ambient
     `cwd`ga tayandi, bu esa joriy (GoogleAiStudio) emas, balki BOSHQA,
     oldin faol bo'lgan real Angular loyihaga (`.../test-zdes-front`)
     ishora qilardi. Executer_Agent o'sha (noto'g'ri, lekin haqiqiy)
     loyihani 100% aniq tahlil qildi, lekin natijani "joriy loyihaga
     tegishli" deb qaytardi — tashqi Orcestor (agy) buni tekshirmasdan
     qabul qilib, Angular tasklar yarata boshladi.
   - **Tuzatish (`SKILL.md` 1.1-band, to'g'rilangan sabab bilan qayta
     yozildi):** endi eski "scope-lock/--new-project" gipotezasi o'rniga
     ANIQ, mexanik talab: har `agy -p` chaqiruvi MAJBURIY `cd
     "<WORKSPACE_PATH>" && agy -p ...` shaklida, hech qachon argumentsiz/
     ambient-cwd'ga tayanmasdan. Orcestor_Agent uchun ham KONKRET
     tekshirish protsedurasi qo'shildi (o'zi `ls`/`find` bilan 1-2 faktni
     qo'lda solishtirishi shart, shunchaki "tekshirdim" deyish yetarli
     emas).
   - **Sinalmagan** — bu tuzatish hali qayta shu stsenariyda (ichki
     agy->agy chaqiruv, noto'g'ri cwd) tekshirilmagan.

## Sinovdan o'tgan (tasdiqlangan)

- SQLite: to'liq CRUD + claim + rule upsert + workspace izolyatsiyasi.
- Postgres: xuddi shu, ikki marta (bir marta xato bilan, bir marta
  tuzatilgandan keyin) + konteyner-qayta-ishlatish stsenariysi.

## Sinalmagan (ochiq qoldi)

- MySQL yo'li — faqat kod darajasida ko'rib chiqilgan, live-test
  qilinmagan (Docker bilan haqiqiy MySQL konteynerda sinash kerak).
- Fayl-rejimidagi atomik claim (mv/rename) — mantiqan to'g'ri, lekin
  amalda ikkita parallel jarayon bilan sinalmagan.
