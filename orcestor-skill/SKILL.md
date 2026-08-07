---
name: orcestor-start
description: Loyihada AI-agentlar orkestratsiyasini (Orchestrator/Executor/Supervisor rollari bilan) bitta komanda orqali ishga tushiradi yoki mavjud sessiyani davom ettiradi. "orkestratsiya boshla", "orcestor ishga tush", "start orchestration", "README.md'ni o'qi" (shu paket ichidagi), "read README" kabi so'rovlarda ishlatiladi.
---

# Orcestor Start Skill

Ushbu skill loyihada ko'p agentli orkestratsiya tizimini ishga tushirish hamda boshqarish uchun ishlatiladi. Tizim uchta asosiy rolga tayanadi:
- **Supervisor_User**: Inson (loyihani nazorat qiluvchi va qaror beruvchi).
- **Orcestor_Agent**: Orkestrator AI (vazifalarni taqsimlovchi va tekshiruvchi).
- **Executer_Agent**: Kod yozuvchi / ijrochi AI (`agy` - Antigravity CLI).

---

## 1. Ishga tushirish jarayoni va Lifecycle

### A) Tekshiruv (Check Phase)
Loyiha ildiz papkasida `orcestor/` papkasi va `orcestor/orcestor.config.env` fayli bor-yo'qligini tekshiring.

Shuningdek, loyiha **YANGI** (deyarli bo'sh, kod/git tarixi yo'q) yoki **ESKI** (mavjud kod bazasi, git tarixida bir nechta commit, yoki sezilarli miqdorda manba fayllar) ekanini aniqlang — bu B-bo'limdagi 0.5-qadamga ta'sir qiladi.

---

### B) Bootstrap Rejimi (Agar `orcestor/` papkasi yo'q bo'lsa)

0. **(ENG BIRINCHI qadam, hamma narsadan oldin) Til tanlash:**
   - Skill ishga tushirilgan ZAHOTI, boshqa hech narsadan oldin (loyiha eski/yangi tekshiruvidan ham oldin), Supervisor_User'dan so'rang: "Qaysi tilda suhbat qurishni xohlaysiz? (masalan: o'zbek, ingliz, rus — yoki boshqa til nomini yozing)"
   - Bu savolning O'ZI ham javob kutilayotgan tilda emas, **bir nechta tilda** (kamida o'zbek + ingliz) berilsin — masalan: "Qaysi tilda suhbat qurishni xohlaysiz? / Which language would you like to use?"
   - Javobni `LANGUAGE` sifatida `orcestor.config.env`ga saqlang (2-qadamga qarang). Shundan keyingi BARCHA savol/xabar/hisobot (shu jumladan quyidagi 0.5- va 1-qadamlar) tanlangan tilda beriladi.
   - Resume rejimida bu savol qayta berilmaydi — `LANGUAGE` config'dan o'qiladi (C-bo'lim).

0.5. **(FAQAT loyiha ESKI bo'lsa) Tezkor loyiha tahlili:**
   - Batafsil mexanizm va sabab uchun qarang: [4-bo'lim, "Mavjud (eski) loyihada ishga tushirish"](#4-mavjud-eski-loyihada-ishga-tushirish--project_status).
   - Qisqacha: tahlilni **Executer_Agent** (`agy -p "..."`) orqali bajaring — Orcestor_Agent xom loyiha fayllarini o'zi to'liq o'qib token sarflamasin, faqat Executer_Agent tayyorlagan qisqa xulosani ko'rib chiqsin/tasdiqlasin.
   - **MAJBURIY (1.1-bandga qarang):** buyruqda joriy loyiha yo'lini ANIQ, aniq qilib bering — hech qachon ambient/inherited cwd'ga ishonmang: `cd "<WORKSPACE_PATH>" && agy -p "Loyihani tahlil qil: ..." --dangerously-skip-permissions`.
   - Natijani `orcestor/project_status/overview.md` ga saqlang (`templates/project_status.md.template` asosida).

1. **Foydalanuvchidan (Supervisor_User) savollarni so'rang (bittalab, aniq):**
   - **1-savol:** "Bitta sprintda nechta Executer_Agent-task ishlatilsin?" (`BATCH_SIZE`, standart taklif: `5`)
   - **2-savol:** "Task kuzatuvi file-based (papka-lifecycle) yoki db-based bo'lsinmi?" (`TRACKING_MODE`: `file` | `db`)
   - **2.1-savol (faqat TRACKING_MODE=db bo'lsa):** "Qaysi DB dvigateli ishlatilsin — postgres, mysql yoki sqlite? Tavsiya: agar bu kompyuterda Docker o'rnatilgan bo'lsa va bir nechta loyiha/agent parallel ishlashi kutilsa — postgres (eng ishonchli, FOR UPDATE SKIP LOCKED bilan konflikt xavfsiz). Agar sodda, yengil, bitta foydalanuvchi uchun yetarli bo'lsa — sqlite (Docker shart emas). MySQL — Postgres bilan bir xil darajada ishonchli, agar loyihada allaqachon MySQL infratuzilmasi bo'lsa shu tanlanadi. Postgres/MySQL konteynerining user/password i FAQAT o'sha konteyner ichida amal qiladi — asosiy ilova bazasiga hech qanday ta'siri yo'q (xavfsizlik uchun ataylab shunday)."
   - **3-savol:** "`orcestor/` workspace papkasi git'ga qo'shilsinmi yoki `.gitignore`'ga tushsinmi?" (`GIT_TRACK_ORCESTOR`: `true` | `false`)
   - **3.4-savol (faqat TRACKING_MODE=db va DB_ENGINE postgres YOKI mysql bo'lsa, 3.5'dan OLDIN so'raladi):** Avval `docker ps --filter name=orcestor-db` (yoki `--filter name=orcestor`) orqali bu mashinada ALLAQACHON ishlab turgan orcestor-konteynerlarni tekshiring, natijani Supervisor_User'ga ko'rsating, keyin so'rang: "Mavjud DB konteynerni (yuqorida ko'rsatilgan) qayta ishlataymi, yoki shu loyiha uchun YANGI, alohida konteyner yarataymi?"
     - **Qayta ishlatish tanlansa:** mavjud konteyner nomi `POSTGRES_CONTAINER_NAME`/`MYSQL_CONTAINER_NAME` sifatida yoziladi, PORT/VOLUME o'sha konteynernikiga moslanadi (`docker inspect <konteyner>` orqali aniqlanadi). **MAJBURIY:** `POSTGRES_DB`/`MYSQL_DATABASE` albatta shu loyihaga XOS qilib beriladi (masalan `orcestor_<loyiha-nomi>`, hech qachon umumiy "orcestor" nomi bilan qoldirilmaydi) — bitta konteyner bir nechta loyihaga xizmat qilishi mumkin, lekin har biri o'z alohida database'iga ega bo'lishi shart (workspace_path ustuni — 3-bo'lim — bunga qo'shimcha himoya, DB_NAME farqi esa BIRINCHI, sodda himoya qatlami).
     - **Yangi konteyner tanlansa:** standart bo'yicha davom etiladi (3.5-savol, keyin struktura shakllantirish qadami — pastga qarang).
   - **3.5-savol (faqat TRACKING_MODE=db va DB_ENGINE postgres YOKI mysql bo'lsa VA 3.4'da "yangi konteyner" tanlangan bo'lsa):** "<DB_ENGINE> ma'lumotlari qaysi papkada (volume) saqlansin? Standart: orcestor/db/pgdata (postgres) yoki orcestor/db/mysqldata (mysql)."
   - **3.9-savol (FAQAT loyiha ESKI bo'lsa):** "`project_status` qachon yangilansin — har taskda avtomatik, yoki faqat siz (Supervisor_User) aytganda?" (`PROJECT_STATUS_UPDATE`: `every_task` | `on_demand`)

2. **Konfiguratsiya faylini yaratish:**
   Olingan javoblar asosida `orcestor/orcestor.config.env` faylini quyidagi mazmunda shakllantiring:
   ```env
   SUPERVISOR_USER=User
   ORCESTOR_AGENT=Claude
   EXECUTER_AGENT=agy

   LANGUAGE=<Javob0_masalan_uz_yoki_en_yoki_ru>
   WORKSPACE_PATH=<joriy_loyiha_papkasining_MUTLAQ_yo'li_avtomatik_aniqlanadi>
   BATCH_SIZE=<Javob1_standart_5>
   TRACKING_MODE=<Javob2_file_yoki_db>
   DB_ENGINE=<Javob2.1_sqlite_yoki_postgres_yoki_mysql>
   GIT_TRACK_ORCESTOR=<Javob3_true_yoki_false>
   PROJECT_STATUS_UPDATE=<Javob3.9_every_task_yoki_on_demand_yoki_bosh_agar_yangi_loyiha>
   ```
   `WORKSPACE_PATH` — **ikkala rejim uchun ham umumiy himoya mexanizmi**
   (batafsil: 3-bo'lim). Savol sifatida so'ralmaydi, loyiha ildizining
   mutlaq (absolute) yo'li avtomatik yozib qo'yiladi.

3. **Strukturani shakllantirish:**
   - **REQUIRED — TRACKING_MODE'dan qat'i nazar (ikkalasida ham) yaratiladi**
     (bular oddiy markdown-jurnal papkalar, task-tracking backend'iga
     bog'liq emas — real loyihada (2026-08-07, `zdes_frontend`) sinovdan
     o'tgan va foydali topilgan):
     - `orcestor/memory/` — Supervisor_User'ning uzoq muddatli,
       qo'lda belgilangan direktivalari (`simple_context.md`dan farqli —
       avtomatik eskirmaydi; `standing_rules.json`/DB `standing_rules`dan
       farqli — bir qatorli qoida emas, to'liq mulohaza/sabab bilan
       hujjatlashtiriladi). Har bir mavzu — alohida `.md` fayl +
       `memory/README.md` — bitta qatorlik indeks (fayl nomi + qisqa tavsif,
       har biriga havola). **Resume paytida FAQAT `memory/README.md`
       (indeks) o'qiladi majburiy tarzda — individual fayllar faqat joriy
       task shu mavzuga aloqador bo'lsa o'qiladi** (batafsil: 2.4-bo'lim).
     - `orcestor/sub_tasks/` — orkestratsiya rasmiy task-lifecycle'i
       (tasks→task_pending→task_compliete yoki DB `tasks` jadvali)
       TASHQARISIDA qilingan ishlar yoki auditlar jurnali (masalan qo'lda
       qilingan refaktoring, read-only tahlil hisobotlari). Fayllar
       `NN-qisqa-nom.md` tarzida raqamlanadi.
     - `orcestor/error_logs/` — uchragan xato + yechim jurnali
       (`NN-qisqa-nom.md`), kelajakda xuddi shu xato qaytarilganda tezkor
       ma'lumot manbai sifatida.
   - **OPTIONAL — faqat loyiha turiga mos kelsa yaratiladi** (bootstrap
     paytida avtomatik YARATILMAYDI, faqat Supervisor_User mos material
     taqdim etganda yoki so'raganda qo'lda ochiladi):
     - `orcestor/project_docs/` — backend API/DTO hujjatlari, dizayn
       referensi va h.k. (faqat loyihada alohida backend/API mavjud bo'lsa
       mantiqiy).
     - `orcestor/template_images/` — UI/dizayn maketlari (screenshot/rasm),
       Supervisor_User rasm-material bergan loyihalarda.
   - **Agar `TRACKING_MODE=file` bo'lsa:**
     Qo'shimcha quyidagi papkalarni yarating:
     - `orcestor/tasks/` — yangi / rejalashtirilayotgan tasklar
     - `orcestor/task_pending/` — ijrodagi tasklar
     - `orcestor/task_compliete/` — yakunlangan tasklar
     - `orcestor/status/` — umumiy holat va reportlar
     - Task olish (claim) — 3-bo'limdagi "Fayl-darajasida atomik claim" qoidasiga qarang.
   - **Agar `TRACKING_MODE=db` bo'lsa:**
     - **DB_ENGINE=sqlite:** faqat `orcestor/db/` papkasi yaratiladi, `python3 scripts/orcestor.py init` chaqiriladi (sqlite3 bilan, Docker kerak emas).
     - **DB_ENGINE=postgres, YANGI konteyner (3.4-javob):** `orcestor/orcestor.config.env` ga POSTGRES_* kalitlari (POSTGRES_CONTAINER_NAME masalan orcestor-db-<loyiha-nomi>, POSTGRES_PORT standart 55432, POSTGRES_USER/PASSWORD=orcestor, POSTGRES_DB=orcestor_<loyiha-nomi>, POSTGRES_VOLUME_PATH=3.5-savol javobi) qo'shiladi. `templates/docker-compose.postgres.yml.template` dan `orcestor/docker-compose.yml` yaratiladi (${VAR} lar config qiymatlari bilan almashtiriladi), `python3 scripts/orcestor.py init` chaqiriladi.
     - **DB_ENGINE=postgres, MAVJUD konteynerni qayta ishlatish (3.4-javob):** `orcestor/docker-compose.yml` yaratilmaydi (konteyner allaqachon boshqa joyda boshqariladi). `orcestor.config.env`ga mavjud konteynerning POSTGRES_CONTAINER_NAME/PORT'i va **albatta loyihaga xos** `POSTGRES_DB=orcestor_<loyiha-nomi>` yoziladi. `python3 scripts/orcestor.py init` chaqirilganda skript konteyner ishlab turganini ko'rib `docker compose up`ni o'tkazib yuboradi, keyin `POSTGRES_DB` mavjud emasligini aniqlab, uni avtomatik yaratadi (kodda mavjud, qo'lda SQL yozish shart emas).
     - **DB_ENGINE=mysql:** postgres bilan bir xil mantiq, MYSQL_* kalitlari (MYSQL_CONTAINER_NAME, MYSQL_PORT standart 33060 — asosiy MySQL 3306 bilan to'qnashmasligi uchun, MYSQL_USER/PASSWORD=orcestor, MYSQL_DATABASE=orcestor_<loyiha-nomi>) va `templates/docker-compose.mysql.yml.template` bilan.
     - ESLAATMA: Bu DB FAQAT orkestratsiya metama'lumotlari (tasks/checkpoints/rules) uchun, loyihaning haqiqiy ilova bazasi bilan aloqasi yo'q. `POSTGRES_DB`/`MYSQL_DATABASE`ni HECH QACHON umumiy/standart nom bilan qoldirmang (masalan yalang'och "orcestor") — har doim loyihaga xos qiling, bu QOIDA 2.1'dagi (3-bo'lim) `workspace_path` himoyasidan TASHQARI, birinchi va soddaroq himoya qatlami.

4. **Boshlang'ich context yaratish:**
   - `templates/simple_context.md.template` dan nusxa olib, `orcestor/simple_context.md` faylini boshlang'ich holatda yarating.
   - **Agar `TRACKING_MODE=file` bo'lsa**, qo'shimcha ravishda
     `templates/standing_rules.example.json` dan nusxa olib
     `orcestor/standing_rules.json` faylini ham yarating (bo'sh massiv
     `[]` bilan boshlansa ham bo'ladi). Bu — DB rejimidagi `standing_rules`
     jadvalining file-mode ekvivalenti (batafsil: 2.4-bo'lim, "Small
     Context Backup"). **Agar `TRACKING_MODE=db` bo'lsa**, bu qadam shart
     emas — `standing_rules` jadvali `orcestor.py init` orqali allaqachon
     yaratiladi (3-qadamga qarang).
   - **Ikkala rejimda ham**: `orcestor/memory/README.md`ni bo'sh indeks
     holatida yarating (masalan sarlavha + "hozircha memory yozuvi yo'q"
     izohi) — 3-qadamda yaratilgan `orcestor/memory/` papkasi uchun.
     Individual `memory/*.md` fayllar hali yaratilmaydi — ular faqat
     Supervisor_User uzoq muddatli direktiva bergan taqdirda, kerak
     bo'lganda qo'shiladi (2.4-bo'lim).

5. **Git konfiguratsiyasi:**
   - `GIT_TRACK_ORCESTOR=false` bo'lsa, loyihadagi `.gitignore` fayliga `orcestor/` qatorini qo'shing (agar `.gitignore` bo'lmasa, uni yarating).

6. **Bootstrap tugagach — `/clear` tavsiyasi (MAJBURIY eslatma, majburiy amal EMAS):**
   - Barcha sozlash (0–5-qadamlar, savol-javoblar, mumkin bo'lgan `project_status` tahlili) shu suhbatning o'zida ancha token sarflagan bo'ladi.
   - Shu sabab, haqiqiy task ishiga o'tishdan OLDIN Supervisor_User'ga aniq tavsiya bering: "Sozlash tugadi. Bu xabar (sozlash suhbati) token sarfi bilan bog'liq — shuning uchun asosiy ishni boshlashdan oldin `/clear` (yoki mos context-tozalash buyrug'i) qilishni tavsiya qilaman. Davom etishni yoki tozalashni o'zingiz tanlaysiz."
   - Bu — FAQAT tavsiya. Qaror har doim Supervisor_User'niki; agar davom etishni tanlasa, shu sessiyada davom eting.
   - Agar Supervisor_User `/clear` (yoki muqobilini) tanlasa — buni bajarishdan oldin `orcestor/simple_context.md` allaqachon (4-qadamda) yaratilgan bo'lishi shart, shunda keyingi sessiya C-bo'lim (Resume) orqali to'g'ri davom etadi.

---

### C) Resume Rejimi (Agar `orcestor/` papkasi mavjud bo'lsa)

1. `orcestor/orcestor.config.env` faylini o'qing, rollar va sozlamalar (`LANGUAGE`, `WORKSPACE_PATH`, `BATCH_SIZE`, `TRACKING_MODE`, `DB_ENGINE`, `PROJECT_STATUS_UPDATE`) bilan tanishing. `LANGUAGE` qayta so'ralmaydi — shu qiymat asosida BARCHA keyingi savol/xabar/hisobotlar shu tilda beriladi.
   - **Majburiy tekshiruv:** saqlangan `WORKSPACE_PATH`ni joriy loyiha papkasining haqiqiy mutlaq yo'li bilan solishtiring. Agar MOS KELMASA — bu `orcestor/` papkasi boshqa joydan ko'chirilgan/nusxalangan/symlink qilingan bo'lishi mumkin. Supervisor_User'ga ANIQ ogohlantiring: "Bu orcestor/ papkasi boshlanishda `<eski_yo'l>`da yaratilgan edi, hozir esa `<joriy_yo'l>`da ishlatilyapti — agar bu nusxa boshqa joyda ham faol bo'lsa, ikkalasi mustaqil ishlab, tasklar/checkpoint holati bir-biriga zid bo'lib qolishi mumkin." Davom etish yoki tozalash — Supervisor_User qarori (batafsil: 3-bo'lim).
2. Minimal checkpoint + standing rules'ni yuklang (batafsil: 2.4-bo'lim,
   "Small Context Backup" — bu qadam shu konsepsiyaning amaliy bajarilishi):
   - **`file` rejimida:** `orcestor/simple_context.md` faylini o'qing —
     **BU YAGONA majburiy o'qiladigan tarix faylidir**, boshqa eski
     tarixiy fayllarni o'qimang. Shu bilan birga `orcestor/standing_rules.json`
     ham MAJBURIY o'qiladi (agar mavjud bo'lsa) — bu cross-session,
     sekin o'zgaruvchi qoidalar ro'yxati, `simple_context.md`dan farqli
     ravishda restartda o'chmaydi.
   - **`db` rejimida:** `python3 scripts/orcestor.py checkpoint get`
     (kerak bo'lsa `--topic <mavzu>` bilan filtrlab) ishlatiladi — bu
     buyruq eng so'nggi (FAQAT bitta) checkpoint yozuvini va tegishli
     standing rules'ni qaytaradi. Hech qachon `session_checkpoints`/
     `standing_rules` jadvallariga qo'lda to'liq `SELECT *` yubormang —
     bu "small context backup" g'oyasini buzadi (sabab: 2.4-bo'lim).
   - **Ikkala rejimda ham**, agar `orcestor/memory/` mavjud bo'lsa,
     `orcestor/memory/README.md` (indeks) o'qiladi — bu MAJBURIY, lekin
     QISQA (bitta qatorlik yozuvlar). Individual `memory/*.md` fayllar
     BU QADAMDA o'qilmaydi — faqat keyinroq, joriy task/savol shu mavzuga
     bevosita aloqador bo'lganda ochiladi (2.4-bo'lim).
3. Agar `orcestor/project_status/overview.md` mavjud bo'lsa — uni o'qing (qisqa, 4-bo'limga qarang) va **ishni boshlashdan oldin uning mazmunini Supervisor_User'ga qisqa bayon qiling** (struktura, oxirgi bajarilgan ishlar, ma'lum muammolar). Bu qadam MAJBURIY — tasklarga o'tishdan oldin bajariladi.
4. `TRACKING_MODE` ga qarab navbatdagi tasklarni toping:
   - `file` rejimida: `orcestor/task_pending/` papkasidagi fayllar.
   - `db` rejimida: `python3 scripts/orcestor.py task list --status TODO` bilan ko'rib chiqiladi, keyingi task esa albatta `python3 scripts/orcestor.py task claim` (atomik) orqali olinadi — hech qachon qo'lda SQL SELECT/UPDATE ishlatilmasin (sabab: 3-bo'lim, "Parallel Orkestratsiya").
5. **Orcestor_Agent** sifatida ishni qolgan joyidan davom ettiring va ijrochiga (`Executer_Agent`) yo'nalish bering.
6. Agar `PROJECT_STATUS_UPDATE=every_task` bo'lsa — har task yakunlangach, `orcestor/project_status/overview.md`ni yangilang (4-bo'limga qarang). Agar `on_demand` bo'lsa — faqat Supervisor_User aniq so'raganda yangilang.

---

## 2. Umumiy Qoidalar va Tamoyillar

1. **Rollar va Identifikatsiya:**
   - Rollar strictly `orcestor.config.env` faylida belgilanadi.
   - Boshqa hech bir hujjatda yoki kodda haqiqiy odam/agent ismi yozilmaydi. Faqat umumiy tokenlar ishlatiladi: `Supervisor_User`, `Orcestor_Agent`, `Executer_Agent`.
   - `Executer_Agent` har doim `agy` (Antigravity CLI) hisoblanadi. `Orcestor_Agent` esa istalgan LLM (Claude, Codex, GPT va h.k.) bo'lishi mumkin.

1.1. **XAVF (real sinovda tasdiqlangan, aniq mexanik sabab bilan): Executer_Agent noto'g'ri workspace'da ishlashi.**
   - Sabab **gallyutsinatsiya yoki "xotira" emas** — bundan ancha oddiyroq va
     jiddiyroq: `agy -p "..."` buyrug'i ANIQ papka/workspace argumentisiz
     chaqirilsa, u ambient/inherited joriy papkaga (`cwd`) tayanadi. Agar bu
     chaqiruv **ichki/nested** tarzda amalga oshsa (masalan `Orcestor_Agent`
     ham `agy` bo'lib, o'zi ichida yana `agy -p ...`ni subprocess sifatida
     chaqirsa), inherited `cwd` HAR DOIM ham joriy, kutilgan loyiha bo'lishi
     shart emas — boshqa (oldingi/faol) workspace bo'lib chiqishi mumkin.
     Natijada Executer_Agent **butunlay boshqa, real loyihani** tahlil
     qiladi/o'zgartiradi, lekin natijani "joriy loyihaga tegishli" deb
     qaytaradi — va bu tashqi ko'rinishda "boshqa loyihadan texnologiya
     sizib kirdi" kabi ko'rinadi, aslida esa noto'g'ri papkada ishlagan.
   - **Oldini olish — QATTIQ QOIDA:** `agy -p ...` chaqiriladigan HAR safar,
     hech qachon ambient `cwd`ga ishonilmasin — buyruqqa ANIQ, mutlaq yo'l
     doim qo'shilsin: `cd "<WORKSPACE_PATH>" && agy -p "..." --dangerously-skip-permissions`
     (`<WORKSPACE_PATH>` — `orcestor.config.env`dagi qiymat, 2-qadamga
     qarang). Implicit/argumentsiz chaqiruv hech qachon ishlatilmasin —
     xuddi shu holat buni isbotladi.
   - **Tekshirish (Orcestor_Agent majburiy, KONKRET vazifasi):** shunchaki
     "tekshirdim" deyish YETARLI EMAS. Executer_Agent natijasini qabul
     qilishdan OLDIN, Orcestor_Agent **o'zi** joriy papkada bitta oddiy
     `ls`/`find` buyrug'ini bajarib, natijadagi kamida 1-2 ta konkret faktni
     (masalan "`src/` papkasi bormi", "`angular.json`/`package.json` bormi,
     va undagi qiymat Executer aytgan bilan mosmi") qo'lda solishtirsin.
     Mos kelmasa — natija RAD ETILADI, qayta (aniq path bilan) so'raladi,
     va bu holat `simple_context.md`ga qisqa qayd etiladi.

2. **Context Boshqaruvi va Update:**
   - Context restart FAQAT `Supervisor_User` so'raganda amalga oshiriladi (qattiq prompt limiti yo'q).
   - Context restart bo'lishidan oldin:
     - **`file` rejimida:** `orcestor/simple_context.md` fayli majburiy
       yangilanishi va joriy holat aks etishi shart.
     - **`db` rejimida:** `python3 scripts/orcestor.py checkpoint add`
       chaqirilishi shart (`--session-id` va `--summary` majburiy,
       ixtiyoriy `--blockers`/`--next-steps`/`--project` bilan) — bu
       `simple_context.md`ni yangilashning DB ekvivalenti.
   - `simple_context.md` (yoki DB'dagi `checkpoint add --summary`) har doim
     **QISQA** bo'lishi shart (taxminan 200-400 so'z). Unda to'liq muloqot
     tarixi emas, faqat:
     - Joriy holat (Current state)
     - Ko'rilgan muammolar (Short blockers/issues)
     - Keyingi qadamlar (Next steps)
     - Restart paytidagi token hisob-kitobi (quyiga qarang)

3. **Token sarfini kuzatib borish (restart samaradorligini o'lchash):**
   - Bu skillning butun maqsadi — sessiya-tarixi (odatda "Messages" toifasi) katta token isrofiga sabab bo'lishining oldini olish (real o'lchov: bitta sessiyada tekshirilganda System prompt/Tools/Memory/Skills jami ~3%, "Messages" esa yolg'iz ~27% — sezilarli farq).
   - Agar Orcestor_Agent shu imkoniyatga ega bo'lsa (masalan Claude Code'da `/context` buyrug'i), context restart QILISHDAN OLDIN joriy token taqsimotini tekshiring va "Messages" ulushini (yoki eng katta toifani) `simple_context.md`ga bitta qisqa qatorda qayd eting (masalan: "Restart oldida: Messages ~27% — kutilganidek").
   - Maqsad — vaqt o'tishi bilan bu ko'rsatkichning pasayib borishini kuzatish (restart intizomi chindan token tejayotganining dalili). Agar ko'rsatkich doim yuqori bo'lib qolsa — restartlar juda kech qilinayotganini bildiradi, Supervisor_User'ga shu haqda ogohlantirish bering.

4. **Small Context Backup — checkpoint, standing rules va memory yuklash intizomi:**
   Bu — 2.1–2.3-bandlardagi context-restart va token-tejash qoidalarining
   **markaziy konsepsiyasi**: har yangi sessiya/restart'da butun tarix yoki
   barcha hujjatlar emas, balki **faqat ayni task uchun kerakli minimal
   checkpoint, tegishli standing rule'lar va (kerak bo'lsa) memory
   fayllari** yuklanadi.

   - **Uch qatlamli model** (real loyihada — `zdes_frontend`, 2026-08-07 —
     sinovdan o'tgan va foydali topilgan uchinchi qatlam bilan):
     - **a) Checkpoint (session-scoped, tez eskiruvchi)** — "qayerga
       kelindik" degan ~200–400 so'zlik qisqa xulosa. `file` rejimida:
       `simple_context.md` (har safar ESKISI ALMASHTIRILADI, qo'shilmaydi).
       `db` rejimida: `session_checkpoints` jadvali (`checkpoint add` bilan
       yoziladi, `checkpoint get` bilan **faqat eng so'nggi qator**
       o'qiladi — `ORDER BY id DESC LIMIT 1`, hech qachon to'liq tarix
       emas).
     - **b) Standing rules (cross-session, sekin o'zgaruvchi, BIR QATOR)** —
       uzoq muddatli, mavzu (`topic`) bo'yicha **qisqa** qoidalar (masalan
       "build-verification", "agent-skills-usage"). `file` rejimida:
       `orcestor/standing_rules.json` (`{topic, rule}` massiv). `db`
       rejimida: `standing_rules` jadvali (`rule add` — topic bo'yicha
       UPSERT, ya'ni bir xil topic qayta yozilsa yangilanadi, dublikat
       qo'shilmaydi; `rule list` yoki `checkpoint get --topic <X>` — faqat
       kerakli mavzu bo'yicha filtrlab o'qiladi).
     - **c) Memory (cross-session, sekin o'zgaruvchi, TO'LIQ HUJJAT)** —
       `orcestor/memory/*.md` — (b)dan farqi: bitta qatorga sig'maydigan,
       **sabab/mulohaza (nega shunday qaror qilingan) bilan** hujjatlash
       kerak bo'lgan direktivalar (masalan model/effort siyosati, ko'p
       bosqichli reja, ish-taqsimoti qoidalari). Har mavzu — alohida fayl;
       `orcestor/memory/README.md` — bitta qatorlik indeks (barcha
       fayllarga havola bilan). **Reload intizomi (b)dan farqli**: indeks
       (`README.md`) har doim MAJBURIY o'qiladi (u qisqa), lekin
       individual `memory/*.md` fayllar **faqat joriy task/savol shu
       mavzuga bevosita aloqador bo'lsa** ochiladi — bu ham xuddi shu
       "kerakli topic bo'yicha filtrlash" tamoyili, faqat DB SELECT o'rniga
       inson/agent qaror qiladi qaysi faylni ochish kerakligini.
   - **Yozuvchi/o'quvchi rollari:** `Executer_Agent` (`agy`) — checkpoint
     yozuvchi (tez/arzon, mexanik ish uchun o'z tokenini ishlatadi).
     `Orcestor_Agent` — o'quvchi va **tasdiqlovchi**: yangi standing rule
     yoki memory fayli qo'shilishidan oldin uni ko'rib chiqadi
     (dublikat/zid qoidaning oldini olish uchun) — bu 2-bo'lim 1-banddagi
     "Rollar" tamoyiliga mos.
   - **MUHIM OGOHLANTIRISH — DB/fayl ishlatishning O'ZI tejamaydi:** agar
     DB rejimida `SELECT * FROM session_checkpoints`/`standing_rules`
     (filtrsiz, to'liq tarix) yuborilsa, file rejimida `simple_context.md`
     cheksiz uzayib ketishiga yo'l qo'yilsa, YOKI `memory/`dagi BARCHA
     fayllar har Resume'da to'liq o'qib chiqilsa — bu to'liq tarixni
     o'qishdan farqsiz, hech narsa tejalmaydi. Tejash faqat uch narsadan
     keladi: (1) checkpoint doim **bitta compact yozuv** bo'lishi (eskisi
     almashtiriladi, tarix jamg'arilmaydi), (2) standing rules **faqat
     kerakli topic bo'yicha** filtrlab olinishi, (3) memory **faqat
     indeks** majburiy o'qilishi, individual fayllar esa mavzu mos
     kelgandagina.

---

## 3. Parallel Orkestratsiya va Ish Maydoni Izolyatsiyasi — Konflikt Ogohlantirishi

Ikki xil konflikt xavfi bor, ikkalasi ham shu bo'limda yechiladi:
**(a) bitta workspace ichida bir nechta agent bir xil taskni olib ketishi**
(ichki konflikt) va **(b) bir nechta MUSTAQIL loyiha/nusxa bir-biriga
aralashib ketishi** (tashqi/workspace-aro konflikt).

### (a) DB rejimi — ichki konflikt

- QOIDA 1: navbatdagi taskni olishda HECH QACHON qo'lda SELECT keyin UPDATE qilinmasin — doim `python3 scripts/orcestor.py task claim` (atomik, FOR UPDATE SKIP LOCKED) ishlatilsin (barcha uchta DB_ENGINE uchun ham amal qiladi — sqlite'da ham, postgres/mysql'da ham `task claim` ishlatilishi shart). `task claim` avtomatik ravishda joriy `WORKSPACE_PATH`ga tegishli tasklar orasidangina tanlaydi.

### (b) DB rejimi — workspace-aro izolyatsiya

- QOIDA 2: har loyiha o'z POSTGRES_CONTAINER_NAME/POSTGRES_PORT/POSTGRES_VOLUME_PATH (yoki MYSQL_*) kombinatsiyasiga ega bo'lishi kerak — ikkita turli loyiha bir-biriga aralashmasligi shu orqali ta'minlanadi.
- QOIDA 2.1 (qo'shimcha himoya qatlami): `tasks`, `task_events`, `changed_files`, `standing_rules`, `session_checkpoints` jadvallarining BARCHASIDA `workspace_path` ustuni bor va HAR BIR so'rov shu qiymat bilan filtrlanadi (`scripts/orcestor.py`da qattiq kodlangan). Ya'ni QOIDA 2 buzilib, bitta DB bir nechta loyiha orasida (qasddan yoki tasodifan) ulashilib qolsa ham, loyihalar ma'lumotlari aralashmaydi — har biri faqat o'z `workspace_path`iga tegishli qatorlarni ko'radi/o'zgartiradi.

### (a+b) File rejimi — fayl-darajasida atomik claim va workspace izolyatsiyasi

File-based rejimda DB yo'q, shuning uchun yuqoridagi mexanizm boshqacha
amalga oshiriladi:

- QOIDA 3 (ichki konflikt, DB'dagi `task claim`ning fayl ekvivalenti): task olish — faylni `orcestor/tasks/`dan `orcestor/task_pending/`ga **ko'chirish (mv/rename)** orqali amalga oshiriladi, hech qachon fayl ustida joyida (in-place) belgi qo'yish orqali emas. Fayl ko'chirish operatsion tizimda atomik. Agar ko'chirish vaqtida fayl "topilmadi" xatosi chiqsa — bu XATO EMAS, demak boshqa sessiya uni ALLAQACHON claim qilgan; keyingi faylga o'ting, urinishni takrorlamang.
- QOIDA 4 (workspace-aro izolyatsiya): har loyiha o'z, jismonan alohida `orcestor/` papkasiga ega bo'lgani uchun file-mode'da tabiiy izolyatsiya bor — LEKIN agar shu `orcestor/` papka boshqa joyga ko'chirilsa/nusxalansa/symlink qilinsa, ikki nusxa mustaqil ishlab, task holatlari zidlashishi mumkin. Shu xavfni ushlash uchun `WORKSPACE_PATH` (bootstrap'da yozib qo'yilgan mutlaq yo'l) har Resume'da solishtiriladi (C-bo'lim, 1-qadam) — mos kelmasa, Supervisor_User ANIQ ogohlantiriladi.

### Umumiy

- QOIDA 5: agar Supervisor_User bir xil loyihada ataylab bir nechta Orcestor_Agent sessiyasini parallel ishga tushirsa (workspace bitta, sessiya bir nechta — bu XAVFLI EMAS, QOIDA 1/3 buni qoplaydi), bootstrap/resume boshida foydalanuvchiga bu haqda ANIQ ESLATMA ko'rsatilsin: 'Diqqat: shu loyihada boshqa Orcestor_Agent sessiyasi ham ishlayotgan bo'lishi mumkin. Task olishda faqat `task claim` (DB) yoki fayl-ko'chirish (file) protsedurasidan foydalaning.'

---

## 4. Mavjud (eski) loyihada ishga tushirish — `project_status`

`simple_context.md` — sessiya-darajasida, tez eskiradi va restartda qisqa
holatga tushiriladi. `project_status/overview.md` esa BOSHQA maqsad uchun:
loyiha haqidagi bilim **vaqt o'tishi bilan to'planadi**, sessiyadan sessiyaga
o'chmaydi. Ikkalasi turli muammoni yechadi, biri ikkinchisini almashtirmaydi.

**Qachon ishlatiladi:** faqat orkestratsiya loyiha ichida BIRINCHI marta
(bootstrap paytida) ishga tushayotganda VA loyiha ESKI (mavjud kod bazasi,
git tarixi) bo'lsa. Yangi/bo'sh loyihada bu qadam o'tkazib yuboriladi —
o'rganadigan narsa yo'q.

**Tezkor va tejamkor tahlil — QANDAY bajariladi:**
- Tahlilni **Executer_Agent** (`agy`) bajaradi, `--print`/`-p` rejimida,
  **HAR DOIM aniq `WORKSPACE_PATH` bilan** (1.1-bandga qarang — ambient cwd'ga
  ishonib bo'lmaydi, ayniqsa Orcestor_Agent ham `agy` bo'lsa):
  `cd "<WORKSPACE_PATH>" && agy -p "Loyihani tahlil qil: texnologiya steki, papka tuzilishi,
  muhim modullar, aniqlangan konventsiyalar/qoidalar. Qisqa, bullet-point
  xulosa ber, fayl mazmunini so'zma-so'z ko'chirma." --dangerously-skip-permissions`
- **Orcestor_Agent xom loyiha fayllarini o'zi to'liq o'qib token sarflamaydi**
  — faqat Executer_Agent tayyorlagan qisqa xulosani ko'rib chiqadi/tasdiqlaydi
  (xuddi 2-bo'limdagi "Rollar" tamoyiliga mos: Executer — tez/arzon ijrochi,
  Orcestor — tekshiruvchi/tasdiqlovchi).
- **MUHIM (tekshirilgan, real xato asosida):** Executer_Agent natijasida
  gallyutsinatsiya/nomuvofiqlik bo'lishi mumkin — Orcestor_Agent xulosani
  ko'r-ko'rona qabul qilmasdan, kamida asosiy faktlarni (masalan texnologiya
  nomi, papka nomlari) haqiqiy loyiha bilan tez solishtirib tasdiqlashi kerak.

**Natija qayerga saqlanadi:** `orcestor/project_status/overview.md`
(`templates/project_status.md.template` asosida), 4 ta bo'lim bilan:
1. **Struktura** — texnologiya steki, papka tuzilishi, muhim modullar.
2. **Qoidalar va konventsiyalar** — loyihada aniqlangan yozilmagan/yozilgan
   qoidalar (kod uslubi, arxitektura qarorlari, taqiqlar).
3. **Bajarilgan ishlar** — qisqa, o'sib boruvchi tarix (juda uzayib ketsa,
   eng eski yozuvlar ixchamlashtiriladi, lekin butunlay o'chirilmaydi).
4. **Ma'lum muammolar / ochiq savollar** — aniqlangan, hali hal qilinmagan.

**Yangilanish chastotasi:** `orcestor.config.env`dagi `PROJECT_STATUS_UPDATE`
bilan belgilanadi (bootstrap'da so'raladi, 3.9-savol):
- `every_task` — har task yakunida avtomatik yangilanadi.
- `on_demand` — faqat Supervisor_User aniq so'raganda yangilanadi.

**Majburiy qoida:** ishni (birinchi taskni ham, resume qilingan taskni ham)
boshlashdan OLDIN, Orcestor_Agent `project_status/overview.md` mazmunini
Supervisor_User'ga QISQA bayon qilishi shart — foydalanuvchi har doim
ishni boshlashdan oldin joriy loyiha holatini bilishi kerak.
