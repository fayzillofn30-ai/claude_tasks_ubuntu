# Kompyuterni tozalash + backup rejasi — UMUMIY HOLAT (yangilandi 2026-07-21)

Maqsad: kompyuterni tozalash uchun avval fayllarni tartiblab, keyin backup qilish.
Bu fayl yagona manba (source of truth) — boshqa `claude_tasks/*/status.md` fayllar
batafsil ma'lumot uchun, lekin umumiy holat shu yerda.

## Bosqichlar va holat

1. **[DONE] Media fayllarni saralash** — `~/Downloads`, `~/Desktop/scripting` (keyin qaytarildi), `~/Documents`, `~/Pictures`, `~/Videos`, `~/Desktop/New Folder` ildizidagi loose fayllar → `~/Downloads/{videos,images,archives,documents,codes,others}`.
   - `~/Desktop/safira`, `~/Desktop/intervyu`, `~/Desktop/.Trash-1000` — tegilmagan.
   - ✅ **[YOPILDI 2026-07-22]** `~/Downloads/others` dagi `fedya.pem`, `fedya__2.pem`, `test-action.pem`, `client_secret_*.json` — foydalanuvchi tasdiqladi: bular **trening/laboratoriya fayllari**, haqiqiy production siri emas. Chora ko'rish shart emas, mavzu yopiq.

2. **[DONE] `~/Desktop/New Folder` loyihalarini darajalarga bo'lish** — 26 ta loyiha `low/medium/high/pro` papkalariga taqsimlangan. (Alohida status fayli yaratilmagan, tafsilotlar shu qatorda.)

3. **[DONE] GitHub backup (New Folder, 26 loyiha)** — barchasi `fayzillofn30-ai` (alohida backup account) ostida private repo sifatida push qilindi. Batafsil: `../github-backup/status.md`.

4. **[DONE] Images/Documents ichki guruhlash + .deb tozalash** — `~/Downloads/images` va `~/Downloads/documents` ichida nomiga qarab sub-papkalarga bo'lindi, `.deb`/`.deb.part` fayllar o'chirildi (301MB bo'shadi). Batafsil: `../file-grouping/status.md`.

5. **[DONE] `~/Desktop/scripting` → GitHub backup** — `ummatovfayzilllo/scripting_learinig` repoga push qilindi. `~/Desktop/Toylar` o'chirildi (foydalanuvchi allaqachon backup qilgan, papka bo'sh edi). Batafsil: `../scripting-backup/status.md`.

6. **[DONE] `~/Downloads` → GitHub backup** — Mega.nz o'rniga, xuddi New Folder kabi `fayzillofn30-ai` accountiga `downloads-backup` private repo sifatida push qilindi (https://github.com/fayzillofn30-ai/downloads-backup). Birinchi urinishlar tarmoq sekinligi (~40KB/s, WiFi) tufayli timeout bo'lgandi; LAN kabel ulanib, NetworkManager route ustunligi to'g'irlangandan keyin (~570KB/s+) push muvaffaqiyatli tugadi. Takroriy push uchun skript tayyor va test qilingan: `../downloads-backup/push_scripts.sh` (`bash ~/Desktop/claude_tasks/downloads-backup/push_scripts.sh`). Batafsil: `../downloads-backup/status.md`, `../downloads-backup/push_docs.md`.

7. **[BEKOR QILINDI] Telegram backup** — `safira`ni Telegramga yuborish rejasi bekor qilindi. Sabab: barcha backuplar allaqachon GitHub repolarida (New Folder 26 loyiha, `downloads-backup`, `scripting_learinig`) — Telegram orqali qo'shimcha backup shart emas deb topildi.

8. **[DONE] `~/Desktop/overview/CRM/` tekshirildi va o'chirildi** — `crm/backend` va `crm/front` local commitlari `ummatovfayzilllo/crm_backend` va `crm_frontend` GitHub repolaridagi HEAD bilan aynan bir xil ekani tasdiqlandi (ikkalasi ham to'liq backup qilingan). 1.6GB hajmning deyarli hammasi `node_modules` (651M+829M) va build-cache (`.next` 77M, `dist` 1.9M) edi — asl kod atigi ~13MB. Repolar GitHub'da xavfsiz saqlanganligi sababli papka butunlay o'chirildi, 1.6GB disk bo'shatildi.

9. **[DONE] `~/Desktop/New Folder` local'dan o'chirildi (2.0GB)** — o'chirishdan oldin barcha 26 loyiha GitHub API orqali tekshirildi: local HEAD commit vs GitHub HEAD commit solishtirildi (`gh api repos/fayzillofn30-ai/<repo>/commits/<branch>`). 25/26 to'liq toza va mos edi. `high/crm` ichidagi `backend`/`front` (alohida `.git`li, `ummatovfayzilllo/crm_backend` va `crm_frontend`ga ulangan) da commit qilinmagan o'zgarishlar bor edi — foydalanuvchi bu imtihon loyihasi ekanini va ahamiyati yo'qligini tasdiqladi. `high-crm` repoda `backend`/`front` submodule-pointer sifatida saqlangan (haqiqiy fayl emas), lekin ularning SHA'si `crm_backend`/`crm_frontend` HEAD bilan bir xil — asl kod o'sha alohida repolarda to'liq bor.
   - ⚠️ **Eslatma (xato saboq):** shundan oldin `~/Desktop/overview/CRM` (bosqich 8) o'chirilganda faqat commit SHA solishtirilgan, `git status` (commit qilinmagan o'zgarish bormi) tekshirilmagan edi — agar o'sha nusxada ham shunga o'xshash saqlanmagan o'zgarish bo'lgan bo'lsa, u qaytarib bo'lmas holda yo'qolgan. Foydalanuvchi buni muammo emas deb topdi (loyiha imtihon uchun edi), lekin keyingi safar o'chirishdan oldin har doim ham commit SHA, ham `git status` (dirty/uncommitted) tekshirilishi kerak.

10. **[DONE] `~/Desktop/safira` — commit + push** — aslida `ummatovfayzilllo/safira`ga ulangan git repo ekan (avvalgi "github kerak emas" degan taxmin noto'g'ri chiqdi). 1.7GB hajmning aksariyati `node_modules`+`.next` edi, asl kod ~8.8MB. 28 fayl (backend service o'zgarishlari, frontend sahifalar, Docker/CI config, `task/*.md` loyiha tarixi) commit qilinib SSH orqali push qilindi, local=remote tasdiqlandi. Papkaning o'zi hali local'da qoladi (o'chirilmagan). Batafsil: `safira-status.md`.

11. **[DONE] VSCode mentorlik uchun sozlandi (2026-07-22)** — terminal papkasi (`~/.bashrc` dagi shartsiz `cd ~/Desktop` shartli qilindi), Code Runner terminalda ishlashi (`runInTerminal` xato joyda — `executorMap` ichida turgan edi), klaviatura yorliqlari (GNOME `Ctrl+Alt+↑/↓` va `Ctrl+Shift+Alt+↑/↓` ni o'g'irlaydi — VSCode bo'sh kombinatsiyalarga bog'landi), kodni blokka o'rash uchun 33 ta snippet. Batafsil: `../vscode-setup/status.md`.

## Umumiy bo'shatilgan disk joyi (2026-07-21)
- `.deb`/`.deb.part` tozalash: 301 MB
- `overview/CRM` o'chirish: 1.6 GB
- `New Folder` o'chirish: 2.0 GB
- **Jami: ~3.9 GB** (disk holati: 92G'dan 26G bo'sh, 71% band)

## Muhim qoidalar / kelishuvlar
- `~/Desktop/intervyu` — TEGILMAYDI. Intervyu uchun demo darsda qilingan loyiha, yakunlangan, keraksizlar allaqachon olib tashlangan (foydalanuvchi tomonidan).
- `~/Downloads` — TEGILMAYDI (GitHub'ga backup qilingan bo'lsa ham, local nusxa saqlanadi).
- Faqat `~/Desktop` va `~/Downloads` (va `~/Documents`, `~/Pictures`, `~/Videos`) ga tegiladi, boshqa joylarga tegilmaydi.
- `package.json` bor papkalar — loyiha, avtomatik saralashda chetlab o'tiladi (lekin New Folder ichidagilar qo'lda darajalarga bo'lindi, bu alohida qoida).
- Diskda joy cheklangan (~95GB Ubuntu uchun) — keraksiz o'rnatishlardan saqlanish kerak.
- Global git config o'zgartirilmaydi (`url.git@github.com:.insteadof=https://github.com/` qoidasi turadi) — shu sabab `fayzillofn30-ai` bilan push doim token-embedded HTTPS URL orqali qilinadi (`https://x-access-token:$(gh auth token)@github.com/...`), oddiy `origin` orqali emas.
- GitHub accountlar / SSH aliaslar:
  - `fayzillofn30-ai` — faqat `gh` CLI token (HTTPS), SSH kaliti yo'q.
  - `fayzillo95` — SSH alias `github.com-fayzillo95` (eski account).
  - `ummatovfayzilllo` — SSH alias `github.com-ummatov`.
- Progress holatini shu papkada (`~/Desktop/claude_tasks/`) saqlab borish — foydalanuvchi so'rovi, tarmoq uzilganda davom etish uchun.
