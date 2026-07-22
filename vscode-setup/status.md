# VSCode sozlash — mentorlik uchun (2026-07-22)

Maqsad: Windows'dan kelgan mushak xotirasini Linux'da tiklash + dars materiali
tayyorlashni tezlashtirish.

## Tegilgan fayllar
- `~/.config/Code/User/settings.json` — nusxa: sessiya scratchpad'ida `settings.json.bak`
- `~/.config/Code/User/keybindings.json` — YANGI (avval yo'q edi)
- `~/.config/Code/User/snippets/wrap.code-snippets` — YANGI (til-maxsus, 17 ta)
- `~/.config/Code/User/snippets/wrap-text.code-snippets` — YANGI (universal, 16 ta)
- `~/.bashrc` — nusxa: scratchpad'da `bashrc.bak`

---

## 1. Terminal papkasi — HAL QILINDI

**Muammo:** har qanday papkadan "Open in Terminal" qilinsa ham terminal Desktop'da
ochilardi. VSCode terminali ham.

**Sabab:** `~/.bashrc:118` da shartsiz `cd ~/Desktop`. Har bir bash startup'da
bajarilib, terminal ochilgan papkani bekor qilardi.

**Yechim:** `[ "$PWD" = "$HOME" ] && cd ~/Desktop` — faqat bo'sh terminal
(HOME'dan boshlangan) Desktop'ga o'tadi. Test qilindi: papkadan ochilganda o'sha
papkada qoladi ✅, launcher'dan ochilganda Desktop ✅.

## 2. Code Runner terminalda ishlashi — HAL QILINDI

**Sabab:** `"code-runner.runInTerminal": true` xato joyda — `executorMap` ICHIDA
turgan edi. VSCode uni til nomi deb o'qib e'tiborsiz qoldirardi, natijada Code
Runner default holatiga (Output oynasi) qaytardi.

**Yechim:** yuqori darajaga ko'chirildi. Qo'shimcha: `clearPreviousOutput: true`,
`saveFileBeforeRun: true`.

**Yon foyda:** terminalda ishlagani uchun endi `scanf`/`readline` input ishlaydi —
Output oynasida bu umuman ishlamasdi (C darslarida muhim).

## 3. Klaviatura yorliqlari — HAL QILINDI

**Asosiy topilma: GNOME ikkita muhim VSCode kombinatsiyasini o'g'irlaydi.**

| Kombinatsiya | VSCode (Linux default) | GNOME uni nima qilgan |
|---|---|---|
| `Ctrl+Shift+Alt+↑/↓` | Copy Line Up/Down | `move-to-workspace-up/down` |
| `Ctrl+Alt+↑/↓` | Add Cursor Above/Below | `switch-to-workspace-up/down` |

Ustiga-ustak, copy-line Windows'da `Shift+Alt+↑/↓`, Linux'da esa
`Ctrl+Shift+Alt+↑/↓` — default ham boshqacha.

**Yechim:** GNOME'ga TEGILMADI (foydalanuvchi qarori). VSCode tomonda bo'sh
kombinatsiyalarga bog'landi:

| Tugma | Buyruq |
|---|---|
| `Shift+Alt+↑/↓` | copyLinesUp/DownAction (Windows'dagidek) |
| `Ctrl+Shift+↑/↓` | insertCursorAbove/Below (kelishuv — Ctrl+Alt band) |
| `Shift+Alt+F` | formatDocument (Linux default Ctrl+Shift+I ham ishlaydi) |
| `Ctrl+Alt+W` | insertSnippet — o'rash ro'yxatini ochadi |

`Ctrl+Shift+R` (Refactor) — Linux'da ham aynan shu tugma, sozlash kerak emas.

## 4. Kodni blokka o'rash (surround with) — 33 snippet

**Muhim farq:** Refactor (`Ctrl+Shift+R`) = extract to function/variable.
`if`/`for`/`try` ga O'RASH ni TypeScript til-serveri taklif qilmaydi — shuning
uchun snippet orqali qilindi.

**Mexanizm:** `$TM_SELECTED_TEXT` — belgilangan matnni snippet ichiga joylaydi.

| Fayl turi | Nima chiqadi |
|---|---|
| JS/TS | if, if/else, try/catch, for, for...of, while, switch, function, async IIFE |
| C/C++ | if, if/else, for, while, switch, try/catch, #ifdef |
| **Hamma fayl** (md, txt, json...) | 16 ta universal — quyida |

### Regex transform — qator-ba-qator prefiks

Oddiy `> $TM_SELECTED_TEXT` faqat BIRINCHI qatorga prefiks qo'yadi (VSCode ko'p
qatorli matnda faqat otstupni moslashtiradi, belgi prefiksini emas). Yechim —
snippet variable transform:

```
${TM_SELECTED_TEXT/^(.+)/1. $1/gm}
```
`m` => `^` har qator boshiga mos keladi; `g` => hammasini; `(.+)` => bo'sh
qatorlarga tegmaydi. Node'da tekshirildi, VSCode'da foydalanuvchi tasdiqladi ✅.

Shu asosda: `wrap-steps` (1.), `wrap-bullet` (-), `wrap-task` (- [ ]),
`wrap-quote` (>), `wrap-note` (sarlavhali eslatma bloki).

**Eslatma:** `wrap-steps` har qatorga `1.` qo'yadi — bu ATAYLAB. Markdown "lazy
numbering": render'da 1,2,3 bo'lib chiqadi, lekin qadam qo'shganda/o'rnini
almashtirganda qayta raqamlash kerak emas. Haqiqiy o'suvchi raqam snippetda
imkonsiz (regexda hisoblagich yo'q) — extension kerak bo'lardi.

### Boshqa universal snippetlar
kod bloki (```), inline (`), **qalin**, *kursiv*, [havola](), `<details>`
(mashq javobini yashirish uchun — dars materialida qulay), "qo'shtirnoq",
(qavs), [kvadrat], {figurali}, HTML teg.

## 5. cpptools — o'chirilmadi, sozlandi

Tafsilot: `../performance-debug/status.md`. Qisqasi: Code Runner uchun cpptools
KERAK EMAS (u shunchaki `gcc` chaqiradi), lekin IntelliSense/debug uchun
qoldirildi va `C_Cpp.files.exclude` ga node_modules qo'shildi.

---

## Foydali, lekin sozlanmagan (bilib qo'yish uchun)
- `Shift+Alt+I` — har bir belgilangan qator oxiriga kursor qo'yadi. Keyin `Home`
  bosilsa hammasi qator boshiga o'tadi. Snippetsiz prefiks qo'shishning universal
  usuli. Foydalanuvchi sinab ko'rdi, ishlaydi ✅.
- `editor.autoSurround` — matnni belgilab `"` yoki `(` bossangiz avtomatik
  o'raydi. VSCode'da standart yoqilgan, snippet kerak emas.
- `Ctrl+K Ctrl+S` — yorliqlar ro'yxati; o'ngdagi record tugmasi bosilgan tugma
  qaysi buyruqqa borishini ko'rsatadi (GNOME o'g'irlaganini aniqlashda foydali).

## Ochiq qolgan
- `amd_pstate=active` kernel param + reboot — tizim sekinligi uchun yagona qolgan
  vosita (`../performance-debug/status.md` ga qarang). Foydalanuvchi tasdig'i kutilmoqda.
