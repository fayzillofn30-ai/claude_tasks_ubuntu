# Screen recorder sozlash — demo dars uchun (2026-08-02)

Maqsad: CSS/JS mavzularida VSCode + brauzerda 10-45 daqiqalik demo dars yozib
olish. Talablar: pause/resume, mikrofondan yozish.

## Tegilgan fayllar
- `~/.local/share/obs-pause-toggle/venv/` — YANGI (Python venv, `obsws-python` paketi)
- `~/.local/share/obs-pause-toggle/toggle_pause.py` — YANGI (parolni ichida saqlaydi, `chmod 600`)
- GNOME Custom Shortcut: "OBS Pause/Resume" → `Ctrl+F11` (Settings → Keyboard → Custom Shortcuts; `Ctrl+Alt+P` tavsiya qilingan edi, foydalanuvchi `Ctrl+F11`ga o'zgartirdi)
- OBS WebSocket Server: yoqilgan, port `4455`, parol OBS ichida saqlangan

---

## 1. Muhit tekshiruvi

- RAM juda tor: jami 5.7 GB, sessiya boshida available ~2.3 GB (VSCode + 2 ta Chrome oyna band qilgan). Asosiy cheklov shu — GPU/CPU emas.
- Wi-Fi tezligi test qilindi: ~6.75 MB/s (54 Mbps) — README'dagi eski "40 KB/s" muammosi endi yo'q. Keyin foydalanuvchi LAN kabelga ulandi, tezlik yanada oshdi.
- Ikkita GPU bor: **Vega 8** (iGPU, `card2`/`renderD129`, laptop ekranini — eDP-1 — boshqaradi) va **RX 560X** (dGPU, `card1`/`renderD128`, hech qanday displeyga ulanmagan, idle).

## 2. OBS Studio o'rnatildi — HAL QILINDI

`sudo apt install obs-studio` orqali (foydalanuvchi terminalda o'zi bajardi —
Bash tool'da sudo parol so'ray olmaydi, TTY yo'q). Versiya: `30.0.2+dfsg-3build1`.
VLC ham qo'shimcha sifatida o'rnatildi (dependency).

## 3. VAAPI GPU tanlovi — HAL QILINDI

`vainfo` bilan ikkalasi ham tekshirildi:

| GPU | Render node | H.264 EncSlice | Xulosa |
|---|---|---|---|
| Vega 8 (Picasso, PCI 05:00.0) | `renderD129` | ✅ bor (High profile) | **Tanlandi** |
| RX 560X (Baffin, PCI 01:00.0) | `renderD128` | ✅ bor (High profile) | Ishlatilmadi |

**Qaror: Vega 8 (`renderD129`).** RX 560X hech qanday displeyga ulanmagan —
uni encode uchun ishlatish har bir kadrni PCIe orqali ko'chirishni talab qiladi,
dGPU uyg'onadi (issiqlik/quvvat oshadi — laptopda kuler muammosi bor,
`../performance-debug/status.md`ga qarang), foyda esa yo'q (statik ekran
yozish, o'yin render emas).

OBS sozlamalari: Settings → Output → Advanced → Recording → Encoder: H.264
(VAAPI) → Device: Vega 8 (`renderD129`). Format: **mkv** (crash himoyasi
uchun mp4 emas). Bitrate: 3500 Kbps, CBR, 1080p@30fps.

## 4. "Qora ekran yozilyapti" muammosi — HAL QILINDI

**Sabab:** Scene'ga hech qanday Source qo'shilmagan edi ("No source
selected", "You don't have any sources"), lekin Start Recording allaqachon
bosilgan edi — 45 soniya bo'sh video yozilgan.

**Yechim:** Sources panel → "+" → **Screen Capture (PipeWire)** → ekran/oyna
tanlab qo'shildi. Recording'ni to'xtatib, qayta boshlash kerak bo'ldi.

## 5. Pause/Resume global hotkey Wayland'da ishlamasligi — HAL QILINDI

**Muammo:** OBS Settings → Hotkeys'da "Pause Recording" tugmasi belgilandi
(F9), lekin OBS fokusda bo'lmaganda (masalan VSCode'da turганда) ishlamadi.

**Sabab:** Wayland xavfsizlik modeli — dasturlar (OBS shu jumladan) fokusdan
tashqarida global keyboard shortcut'ni tuta olmaydi (X11'dagidek emas). Bu
OBS'ning cheklovi emas, Wayland kompozitorining arxitekturasi.

**Yechim (tanlangan variant — Wayland'da qolish):**
1. OBS'da **Tools → WebSocket Server Settings** → "Enable WebSocket server" ✅,
   port `4455`, parol generatsiya qilindi.
2. `~/.local/share/obs-pause-toggle/venv/` — alohida Python venv,
   `obsws-python` kutubxonasi o'rnatildi (tizim paketlariga tegilmadi).
3. `~/.local/share/obs-pause-toggle/toggle_pause.py` — `obsws_python.ReqClient`
   orqali ulanadi va `.toggle_record_pause()` chaqiradi. `chmod 600` (parol
   fayl ichida saqlangani uchun).
4. **GNOME Custom Shortcut** (Settings → Keyboard → Custom Shortcuts) —
   Command: venv python + skript path (bitta joy bilan ajratilgan, bitta
   qatorda), Shortcut: `Ctrl+Alt+P`.

**Nega ishlaydi:** GNOME kompozitorining o'zi global keybinding'larga ega
(Wayland cheklovi faqat ilova darajasida — Chrome, OBS, VSCode kabi — GNOME
darajasida emas). Shuning uchun Custom Shortcut orqali istalgan dasturda
turib buyruq yuborish mumkin.

**Tekshirildi va ISHLADI ✅** — `Ctrl+F11` VSCode fokusda turganda ham OBS
recording'ni pause/resume qildi. `get_record_status()` orqali ulanish oldindan
tasdiqlangan edi.

**Yon savol (javob berildi):** WebSocket server va skript haqida qo'shimcha
tozalash kerakmi? — Yo'q. Server OBS bilan birga ochiladi/yopiladi (alohida
service emas, faqat `localhost`ga bog'langan). Skript har bosishda yangi,
qisqa umrli jarayon sifatida ishlab, buyruq yuborib darhol tugaydi — fonda
hech narsa qolmaydi.

---

## Ochiq qolgan
- To'liq 45 daqiqalik demo yozuv hali qilinmagan — RAM yetarliligini amalda
  tekshirish kerak (VSCode + brauzer + OBS bir vaqtda).
