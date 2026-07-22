# Tizim sekinlashishi / qotib qolishi — diagnostika (2026-07-21)

Bu task backup rejasiga kiritilmaydi — alohida, faqat performance debug.

## ⭐ QISQA XULOSA (bugungi sessiya yakuni)
**Asosiy sabab topildi: VSCode extensionlari** (og'ir til-serverlari — cpptools,
Pylance, SonarLint). VSCode yangilanishi ularni o'chirib yubordi (1.1GB→8KB), va
nol extension bilan tizim yengil ishlayapti (home folder ham). GPU/RAM sabab EMAS
edi (ikkalasi istisno qilingan).

**Qaytganda qilinadigan ish:** extensionlarni TANLAB qayta o'rnatish (faqat ESLint,
Prettier, Prisma, Thunder Client). cpptools/cmake/Python/SonarLint o'rnatilmasin.
Tafsilot va settings.json tavsiyalari pastda ("TAVSIYA" bo'limi).

**Ikkilamchi:** ~~`powerprofilesctl set balanced`~~ — TEST QILINDI (2026-07-22), gipoteza
NOTO'G'RI chiqdi. Power profil bu noutbukda hech narsani o'zgartirmaydi (pastda
"TOPILMA A — RAD ETILDI" bo'limiga qarang).

---

## 🔒 MAVZU YOPILDI (2026-07-22)

**Foydalanuvchi tasdig'i: performance ancha yaxshilangan.** Asosiy sabab (VSCode
extensionlari) bartaraf etilgan; cpptools o'chirilmasdan, `C_Cpp.files.exclude`
orqali sozlangan — qarang `../vscode-setup/status.md`.

**Ikkala "ikkilamchi omil" gipotezasi ham test qilindi va IKKALASI HAM RAD ETILDI:**

| Gipoteza | Holat | Sabab |
|---|---|---|
| TOPILMA A — `power-saver` throttle qiladi | ❌ rad etildi | profil o'zgarganda birorta parametr o'zgarmaydi |
| TOPILMA B — `amd_pstate=active` yordam beradi | ❌ rad etildi | protsessorda CPPC yo'q, drayver yuklana olmaydi |

### Nega `amd_pstate` ishlamaydi (2026-07-22 tekshiruvi)

- CPU: family 23 (0x17), model 24 (0x18) = **Picasso, Zen+** (2019).
  AMD CPPC ni to'liq **Zen 2** dan boshlab joriy qilgan — bu CPU bir avlod oldinda.
- `/proc/cpuinfo` da `cppc` bayrog'i YO'Q.
- `/sys/devices/system/cpu/cpu0/acpi_cppc/` papkasi YO'Q (BIOS `_CPC` bermaydi).
- **Eng qat'iy dalil:** `CONFIG_X86_AMD_PSTATE=y` va
  `CONFIG_X86_AMD_PSTATE_DEFAULT_MODE=3` (= active). Ya'ni drayver kernelga
  qurilgan va standart rejimi allaqachon `active`. Ishlay olganida hech qanday
  parametrsiz o'zi yuklanardi. Lekin `scaling_driver` hali ham `acpi-cpufreq` —
  demak yuklashga urinib, apparat qo'llab-quvvatlamagani uchun orqaga qaytgan.
- **Xulosa:** GRUB'ga `amd_pstate=active` yozish reboot xavfini oladi va natijada
  AYNAN hozirgi holat qoladi. QILINMAYDI.

### Yana bir tuzatish — boost aslida ishlayapti

TOPILMA B da "3.7 GHz boost ishlamayapti" shubhasi bor edi. Bu noto'g'ri:
`cpuinfo_max_freq = 2100000` faqat **bazaviy** chastotani ko'rsatadi, boost esa
apparat darajasida ishlaydi va sysfs'da ko'rinmaydi. O'lchovda yadrolar
**2390 MHz** da edi — 2100 dan yuqori, ya'ni boost faol.

### CPU/sozlama tomonida qiladigan ish qolmadi

Qolgan real vositalar — apparat tomonda:
1. **Kuler tozalash + termopasta almashtirish** — Windows'da 90°C kuzatilgan.
   Bu throttling'ning asl sababi va ikkala OS ga ham ta'sir qiladi.
2. **RAM qo'shish** — 5.7 GB eng tor joy, SO-DIMM slot mavjud.

---

## Muammo (foydalanuvchi bayoni)
- VSCode, Telegram, Chrome ilovalari **qotib qoladi**, UI sekinlashadi.
- Shu sababdan foydalanuvchi VSCode UI o'rniga Claude Code CLI'ga o'tgan.
- Foydalanuvchi GNOME'dan shubhalanadi, lekin aniq sabab noma'lum.

## Muhit / hardware
- Acer Nitro 5, Ryzen 5 **3550H** (4 yadro / 8 thread), 15W-35W mobil CPU.
- iGPU: AMD Radeon Vega 8. dGPU: AMD Radeon RX560X 4GB (Polaris11).
- Ubuntu (Wayland sessiya), kernel 6.17.0-40-generic.

## Aniqlangan faktlar (tekshiruvlardan)
1. **RAM emas** — foydalanuvchi tasdiqladi: og'ir yukda ham RAM ~70%dan oshmaydi
   (2 Node server + 2 VSCode window + 3+ Chrome window bir vaqtda). Swap muammosi emas.
2. **dGPU (RX560X) `D3cold`da** — butunlay o'chgan, ~0W. Runtime PM = auto. Ideal holat.
3. **Batareyada** — adapter offline, BAT1 30%, discharging (tekshiruv paytida).
4. Harorat tekshiruv paytida salqin (~42°C) — lekin bu deyarli idle holatda o'lchangan.
5. Top CPU (idle-ga yaqin holatda): chrome ~31%, gnome-shell ~7%.

## Ishchi gipoteza
CPU oversubscription: Ryzen 3550H (4c/8t) uchun 8+ og'ir jarayon (2 Node dev
server + 2 VSCode TS-server/extension-host + 3+ Chrome) bir vaqtda —
yadrolar navbatga tushadi → UI qotadi. Batareyada CPU throttling buni
kuchaytiradi. GPU va RAM sabab EMAS (ikkalasi ham istisno qilindi).

## Rejalashtirilgan steplar
- [x] STEP 1: CPU governor / load / iowait — BAJARILDI (natija pastda).
- [x] STEP 2: Chastota / quvvat holati — BAJARILDI (natija pastda).
- [ ] STEP 3: Disk I/O — Node watcher + Chrome cache disk'ni urayaptimi (iotop/pidstat).
- [ ] STEP 4: GNOME/Mutter (Wayland) compositor stall belgilari (jurnal xatolari).
- [ ] STEP 5: inotify watch limiti (ko'p node_modules + VSCode watcher).
- [ ] STEP 6: Xulosa + tavsiyalar.

## STEP 1-2 NATIJALARI (2026-07-21) — 2 TA KATTA TOPILMA

### TOPILMA A: Tizim `power-saver` profilida ⚠️ → ❌ RAD ETILDI (2026-07-22)

> **YANGILANISH 2026-07-22 — bu gipoteza test qilindi va NOTO'G'RI chiqdi.**
> Benchmark (awk floating-point loop, batareyada):
> | Test | power-saver | balanced |
> |---|---|---|
> | 8 oqim | 5.30 s | 5.45 s |
> | 1 oqim ×3 | 2.34 / 2.36 / 2.36 s | 2.31 / 2.35 / 2.37 s |
>
> Farq yo'q. Sabab: profil o'zgarganda birorta parametr o'zgarmaydi —
> `power-saver` va `balanced` da bir xil: `max_freq=2100000`, `boost=1`,
> `governor=schedutil`. Chunki `acpi-cpufreq` EPP'ni qo'llab-quvvatlamaydi va
> `/sys/firmware/acpi/platform_profile` mavjud emas (`performance` profili ham yo'q).
> Ya'ni `power-profiles-daemon` bu mashinada boshqaradigan hech narsaga ega emas.
> **Xulosa: power-saver hech qachon throttle qilmagan. Profil `balanced`da qoldirildi
> (zararsiz).** (Keyinchalik TOPILMA B ham rad etildi — yuqoridagi
> "MAVZU YOPILDI" bo'limiga qarang.)

Quyidagi asl yozuv tarix uchun saqlanadi:
- `power-profiles-daemon` active, joriy profil = **`power-saver`**.
- Bu profil CPU'ni **zaryadlagich ulangan bo'lsa ham** cheklaydi (AC/batareyadan mustaqil).
- Foydalanuvchi tasdiqladi: "quvvat yaxshi bo'lganda ham qotishlar kuzatiladi" —
  bu aynan power-saver profiliga mos (chunki u AC holatiga bog'liq emas).
- **Bu — bosh shubhali. Yechim (nol-risk, qaytariladi): `powerprofilesctl set balanced`.**

### TOPILMA B: `acpi-cpufreq` ishlatilyapti, `amd_pstate` EMAS ⚠️ → ❌ RAD ETILDI (2026-07-22)

> **YANGILANISH: bu gipoteza ham noto'g'ri chiqdi.** Protsessor (Zen+, family 23
> model 24) CPPC ni qo'llab-quvvatlamaydi, shuning uchun `amd_pstate` yuklana
> olmaydi — `CONFIG_X86_AMD_PSTATE_DEFAULT_MODE=3` (active) bo'lishiga qaramay
> tizim `acpi-cpufreq` ga qaytgan. Shuningdek "boost ishlamayapti" degan quyidagi
> shubha ham noto'g'ri edi — boost faol (2390 MHz o'lchandi). To'liq tahlil:
> yuqoridagi "🔒 MAVZU YOPILDI" bo'limi.

Quyidagi asl yozuv tarix uchun saqlanadi:
- `scaling_driver = acpi-cpufreq` (eski/legacy), `amd_pstate` yo'q.
- `cpuinfo_max_freq = 2100 MHz` (faqat base clock ko'rsatilgan). 3550H aslida
  3.7 GHz'gача boost qila oladi. `boost=1` (yoqilgan), lekin acpi-cpufreq boost'ni
  qo'pol (coarse) boshqaradi — to'liq 3.7 GHz diapazoni nozik boshqarilmaydi.
- `amd_pstate=active` (EPP bilan) Ryzen mobile'da ancha tez/silliq UI beradi.
  Bu — aynan "sekin UI" simptomini davolaydigan ma'lum yechim.
- O'zgartirish uchun kernel param kerak (`amd_pstate=active`) + reboot — RISK bor,
  foydalanuvchi tasdig'isiz qilinmaydi.

### Boshqa o'lchovlar (tekshiruv paytida, tizim deyarli idle edi)
- governor: schedutil (normal). Load avg: 1.88 / 8 yadro (past — o'sha payt idle).
- CPU: 90.5% idle, iowait 0.1% (o'sha payt yuk yo'q edi — qotishni "live" ushlab bo'lmadi).
- Batareya: 22% discharging, adapter offline (tekshiruv payti).
- Chastotalar: 7 yadro ~2390 MHz, 1 yadro 1198 MHz.

## STEP: EXTENSIONS — ASOSIY SABAB ANIQLANDI (2026-07-21) ✅

Foydalanuvchi VSCode'ni yangilagach payqadi: endi home folderni ochsa ham yengil.
Tekshiruv: `~/.vscode/extensions/extensions.json = []`, papka 1.1GB → 8KB.
Ya'ni **VSCode yangilanishi barcha extensionlarni o'chirib yuborgan**, va nol
extension bilan VSCode yengil ishlayapti. Bu — qotishning ASOSIY sababi
extensionlar (og'ir til-serverlari) ekanini tasdiqlaydi. GPU/RAM/CPU-governor
ikkilamchi omillar edi.

### Avval o'rnatilgan bo'lgan extensionlar (state.vscdb'dan) — og'irlari belgilangan
- ms-vscode.**cpptools** (C/C++ IntelliSense) — JUDA OG'IR, butun papkani indekslaydi. Node.js uchun KERAK EMAS.
- ms-python.**vscode-pylance** + python + debugpy — Python LS, katta papkada og'ir. Node.js uchun KERAK EMAS.
- SonarSource.**sonarlint-vscode** — uzluksiz kod tahlili, OG'IR.
- GitHub.**copilot** + copilot-chat — autocomplete, har bosishda CPU + tarmoq.
- Orta.**vscode-jest** — test discovery, testlarni ishga tushiradi.
- ms-vscode.cmake-tools — C/C++ uchun, KERAK EMAS.
- prisma.prisma, ritwickdey.liveserver, redhat.vscode-yaml, thunder-client,
  ms-azuretools.vscode-containers, Anthropic.claude-code, ms-vscode.js-debug.

### Nega qotardi
Bu og'ir til-serverlari (ayniqsa cpptools + Pylance + SonarLint) bir vaqtda
ishlab, ayniqsa KATTA papka (home, yoki node_modules'li papka) ochilganda —
hamma faylni indekslashga urinardi → CPU spike → UI qotardi. 4c/8t 3550H
uchun bu og'irlik + power-saver profil = qotish.

### TAVSIYA (mentorlik setup uchun — Full Stack Node.js)
1. **Faqat kerakli extension o'rnatish:** ESLint, Prettier, Prisma, Thunder Client
   (yoki REST Client). JS/TS qo'llab-quvvatlash VSCode'da o'rnatilgan — extension shart emas.
2. **O'RNATMASLIK:** ~~cpptools~~, cmake-tools, Python/Pylance/debugpy (Python o'rgatmasangiz),
   SonarLint. Bular eng og'irlari.
   - ⚠️ **Tuzatish 2026-07-22:** `cpptools` (330MB) qaytib o'rnatilgan. Foydalanuvchi
     C/C++ ham dars o'tadi. **HAL QILINDI — o'chirilmadi, sozlandi.**
   - Joriy holat (2026-07-22, jami 673MB): cpptools 330M, claude-code 266M,
     angular.ng-template 61M, prettier 15M, code-runner 2M. Og'ir til-serverlari
     (Pylance, SonarLint) qaytmagan — bu yaxshi.

### cpptools tahlili (2026-07-22) — aniq faktlar

**Fakt 1 — cpptools odatda uyg'onmaydi.** `package.json` dagi activationEvents:
`onLanguage:c`, `onLanguage:cpp`, `onLanguage:cuda-cpp`,
`workspaceContains:/.vscode/c_cpp_properties.json`. Ya'ni toza Node.js loyihasida
u **umuman ishga tushmaydi**. Avvalgi "Node loyihalarini indekslaydi" degan
taxmin haddan tashqari edi.

**Fakt 2 — lekin uyg'onsa, hamma narsani indekslaydi.** Default
`C_Cpp.files.exclude = {"**/.vscode": true, "**/.vs": true}` — `node_modules` YO'Q.
Tekshiruv: `~/Desktop/zdes-frontend/node_modules` ichida **92 ta `.c`/`.h`/`.cpp` fayl**
bor (native addonlar). Ya'ni o'sha workspace'da bitta header ochilsa, tag-parser
390MB'lik daraxtni rekursiv aylanadi → CPU spike → qotish.

**Fakt 3 — Code Runner uchun cpptools KERAK EMAS.** Foydalanuvchi uni aynan shu
maqsadda o'rnatgan ekan, lekin `code-runner.executorMap` dagi C executor
(`cd $dir && gcc $fileName -o ... && ...`) — sof shell buyrug'i, faqat `gcc` kerak
(tizimda bor: gcc/g++ 13.3.0). cpptools bergani: IntelliSense/avtokomplit,
real-time xato ko'rsatish, F5 debug, go-to-definition. Foydalanuvchi bularni dars
uchun foydali deb topdi va **qoldirishni tanladi**.

**Qo'llangan yechim** — `~/.config/Code/User/settings.json` ga qo'shildi
(nusxa: sessiya scratchpad'ida `settings.json.bak`, JSON sintaksisi tekshirildi):
- `C_Cpp.files.exclude` — 9 ta pattern (`node_modules`, `.git`, `dist`, `build`,
  `.next`, `venv`, `.venv` + default ikkitasi)
- `files.watcherExclude` — 5 ta pattern
- `search.exclude` — 3 ta pattern
- `typescript.tsserver.maxTsServerMemory: 2048`
3. **Katta papkani (home, node_modules'li) workspace sifatida ochmaslik** — aniq
   loyiha papkasini ochish.
4. **Global settings.json'ga qo'shish** (watcher/search yukini kamaytiradi):
   - `"files.watcherExclude": {"**/node_modules/**": true, "**/.git/**": true}`
   - `"search.exclude": {"**/node_modules": true}`
   - `"typescript.tsserver.maxTsServerMemory": 2048` (TS server xotirasini cheklash)
5. Agar qotish qaytsa: VSCode'da `Ctrl+Shift+P` → "Developer: Show Running Extensions"
   — qaysi extension CPU yeyayotganini ko'rsatadi.
   Eslatma: `~/.config/Code/User/settings.json` (8KB) saqlanib qolgan — extension
   qayta o'rnatilsa, eski sozlamalar qayta qo'llanadi.

## IKKILAMCHI OMILLAR — ikkalasi ham test qilinib RAD ETILDI (2026-07-22)
1. ~~(nol-risk) `powerprofilesctl set balanced`~~ — ❌ profil hech narsani o'zgartirmaydi
   (acpi-cpufreq da EPP yo'q, platform_profile yo'q). Benchmark: farq yo'q.
2. ~~(tasdiq bilan) `amd_pstate=active` kernel param + reboot~~ — ❌ CPU (Zen+) CPPC ni
   qo'llab-quvvatlamaydi, drayver yuklana olmaydi. Reboot xavfi bekorga bo'lardi.

Tafsilot: yuqoridagi "🔒 MAVZU YOPILDI" bo'limi.

## HOLAT: ✅ YOPILDI (2026-07-22)
Asosiy sabab (VSCode extensionlari) aniqlandi va bartaraf etildi. Foydalanuvchi
tasdiqladi: **performance ancha yaxshilangan**. Ikkala ikkilamchi gipoteza ham
test qilinib rad etildi. Dasturiy tomonda qiladigan ish qolmadi — qolgani apparat
(kuler tozalash/termopasta, RAM qo'shish).

## Qoidalar
- Faqat read-only diagnostika, tizim sozlamalari foydalanuvchi tasdig'isiz o'zgartirilmaydi.
- Har step natijasi shu faylga yoziladi (tarmoq/sessiya uzilsa davom etish uchun).
