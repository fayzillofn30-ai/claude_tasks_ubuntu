# claude_tasks_ubuntu

Ubuntu noutbukni sozlash bo'yicha **ish jurnali**. Har bir papka — alohida vazifa,
ichida `status.md` fayli bilan.

> **Maqsad:** keyingi sessiyada Claude shu hujjatlarni o'qib, mashina holatini
> noldan tekshirmasdan tiklab oladi va tezkor yechim beradi. Ya'ni bu repo —
> kontekst manbai, dastur emas.

## Claude uchun: qaysi tartibda o'qish

1. **`backup-plan/overview.md`** — asosiy manba (source of truth). Barcha bosqichlar,
   qoidalar va kelishuvlar shu yerda.
2. Kerakli mavzu bo'yicha tegishli papkadagi `status.md`.

**Muhim qoida:** noto'g'ri chiqqan gipotezalar o'chirilmaydi, "❌ RAD ETILDI" deb
belgilanadi. Shuning uchun bir marta tekshirilgan yo'lni qayta takrorlash shart emas.

## Muhit

Acer Nitro 5 · Ryzen 5 3550H (Zen+, 4c/8t) · Vega 8 + RX 560X · **RAM 5.7 GB** ·
NVMe 477 GB dual boot (Windows ~382 GB / Ubuntu ~94 GB) · Ubuntu 24.04, kernel 6.17, Wayland

## Papkalar

| Papka | Mavzu | Holat |
|---|---|---|
| `backup-plan/` | **Asosiy manba** — barcha bosqichlar | davom etmoqda |
| `github-backup/` | `New Folder` — 26 loyihani arxivlash | ✅ |
| `downloads-backup/` | `~/Downloads` arxivlash + push skripti | ✅ |
| `scripting-backup/` | `~/Desktop/scripting` arxivlash | ✅ |
| `file-grouping/` | Media saralash, `.deb` tozalash | ✅ |
| `performance-debug/` | Tizim qotishi diagnostikasi | ✅ yopildi |
| `vscode-setup/` | VSCode mentorlik uchun sozlash | ✅ |
| `apt-cleanup/` | APT/Docker/Snap keraksiz paketlarni tozalash | ⏳ kutilmoqda |
| `encryption_plan.md` | Gmail/Password shifrlash rejasi (C tilida, boshlang'ich g'oya) | ✅ reja tayyor |
| `pass_manager_bot/` | Shifrlangan parollar menejeri Telegram boti (Python) | ✅ yaratildi |
| `secvault-plan/` | SecVault (Python/Termux) — qaror tarixi. Kodning o'zi alohida repo: `~/Desktop/secvault` → `github.com/fayzillo95/secvault` | ✅ push qilindi |

## Xulosa (2026-07-22)

**Disk:** ~5.6 GB bo'shatildi (loyihalar avval GitHub'ga push qilinib, keyin
local'dan o'chirildi). 92 GB dan 40 GB bo'sh.

**Performance — mavzu yopildi.** Qotishning asosiy sababi VSCode extensionlari
(og'ir til-serverlari) edi, bartaraf etildi. Foydalanuvchi tasdig'i: sezilarli
yaxshilangan.

Ikkita ikkilamchi gipoteza test qilinib **ikkalasi ham rad etildi** —
qayta urinmang:

| Gipoteza | Nega ishlamaydi |
|---|---|
| `powerprofilesctl set balanced` | `acpi-cpufreq` da EPP yo'q, `platform_profile` yo'q. Profil o'zgarganda birorta parametr o'zgarmaydi — benchmark farq ko'rsatmadi. |
| `amd_pstate=active` (GRUB + reboot) | CPU Zen+ (family 23, model 24), **CPPC yo'q**. Drayver kernelga qurilgan va default rejimi allaqachon `active`, lekin apparat qo'llab-quvvatlamagani uchun `acpi-cpufreq` ga qaytadi. Reboot bekorga bo'lardi. |

**Dasturiy tomonda qiladigan ish qolmadi.** Qolgan real vositalar — apparat:
kuler tozalash + termopasta (Windows'da 90°C kuzatilgan) va RAM qo'shish
(5.7 GB — eng tor joy, SO-DIMM slot bor).

## O'rganilgan saboqlar

- **O'chirishdan oldin commit SHA yetarli emas** — `git status` bilan commit
  qilinmagan o'zgarishlar ham tekshirilsin.
- **Gipotezani o'lchamasdan qabul qilmaslik** — "aniq sabab" bo'lib ko'ringan
  ikkita narsa tekshiruvdan keyin noto'g'ri chiqdi.
- **Sekin tarmoqda** katta push timeout bo'ladi (WiFi ~40 KB/s → LAN ~570 KB/s).
- **`fayzillofn30-ai` accountida SSH kaliti yo'q**, faqat `gh` tokeni. Global
  git config'da `url.git@github.com:.insteadof=https://github.com/` qoidasi bor,
  shuning uchun push doim token-embedded HTTPS URL orqali qilinadi.
