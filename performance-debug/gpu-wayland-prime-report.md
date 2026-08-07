# Ubuntu Wayland + AMD Hybrid Graphics — GPU tanlash muammosi bo'yicha bayonot

**Sana:** 2026-07-27
**Tizim:** Ubuntu 24.04, Wayland, Acer Nitro 5 (Ryzen 5, AMD Radeon Vega 8 iGPU + AMD Radeon RX560X 4GB dGPU, mux-siz/muxless)

## Muammo

`DRI_PRIME=1` Mesa/OpenGL darajasida (`glxinfo`) to'g'ri ishlaydi va RX560X'ni tanlaydi, lekin Wayland ostidagi Electron/Qt ilovalar (VS Code, Chrome, Telegram) baribir Vega 8 (`renderD129`) da ishlab qolaverdi.

## Tekshiruvlar va natijalar

### 1. Render node'lar aniqlandi
```
renderD128 -> RX560X (bus 01, DEVICE=0x67ef, Polaris 11)
renderD129 -> Vega 8  (bus 05, DEVICE=0x15d8, Picasso/Raven2)
```

### 2. `glxinfo` bilan `DRI_PRIME=1` — ishlaydi
Sabab: `glxinfo` compositor bilan buffer almashmaydi (dma-buf import shart emas), shuning uchun sof Mesa/client-side PRIME tanlovi ishlaydi.

### 3. Electron/Qt ilovalar (`lsof /dev/dri/renderD*`, `ps` GPU-process argumentlari)
Barchasi (`code`, `chrome`, `telegram-desktop`, shuningdek `Xwayland`, `mutter`) `renderD129` (Vega 8) da ishladi — `DRI_PRIME` ta'sir qilmadi.

### 4. FFmpeg + VA-API — muammosiz
RX560X'da VA-API orqali video encode/decode to'g'ri ishlayapti: CPU encode'ga nisbatan ~4x tezroq, CPU yuklanishi 90-100% o'rniga 15-35%. Sabab: bu jarayon compositor bilan buffer import qilishga muhtoj emas (faqat fayl output).

### 5. GNOME "Launch using Discrete Graphics Card" menyusi
Chrome, VS Code, Telegram uchun bu variant menyuda mavjud edi. Sinab ko'rildi (Telegram misolida):
- `lsof` ikkala render node'ni ham "ochilgan" ko'rsatdi (ambigual)
- `radeontop` bilan real yuklanish solishtirildi: **RX560X — 0.00% gpu, 41MB VRAM (bo'sh)**; **Vega 8 — 4-12% gpu, 457MB VRAM (faol)**
- Xulosa: menyu variant mavjud, lekin **amalda ishlamadi** — Telegram baribir Vega 8'da render qildi.

### 6. `chrome://gpu` tahlili
Command line'da Chrome o'zi avtomatik qo'shgan flag topildi:
```
--render-node-override=/dev/dri/renderD129
```
GPU0 (Vega 8, 0x15d8) — ACTIVE; GPU1 (RX560X, 0x67ef) — passiv.

### 7. Qo'lda override sinovi (hal qiluvchi tajriba)
```bash
google-chrome-stable --render-node-override=/dev/dri/renderD128
```
Natija:
- GPU process haqiqatan `renderD128`ga bog'landi (`ps` bilan tasdiqlandi)
- **Lekin Chrome oynasi butunlay buzildi** — gorizontal chiziqlar, render korruptsiyasi (skrinshotda tasdiqlangan)
- Jarayon darhol o'chirildi, Vega 8'ga (default) qaytarildi

## Tub sabab (root cause)

Wayland'da GPU tanlash **client-side emas, protocol darajasida** hal qilinadi: Mutter compositor `linux-dmabuf` orqali "asosiy device"ni clientlarga signal beradi, va bu odatda **displeyni haydayotgan GPU** (mux-siz tizimda — Vega 8, chunki RX560X hech qanday displey chiqishiga ega emas). Chromium/Electron shu signalga ko'ra `--render-node-override` flag'ini avtomatik belgilaydi.

RX560X'ni majburan tanlash **texnik jihatdan mumkin** (flag orqali), lekin natija — **displey korruptsiyasi**, chunki bu mux-siz AMD-AMD tizimda cross-GPU dma-buf import (bir GPU'da render qilib, boshqasida compositing) Mesa/kernel darajasida ishonchli/barqaror emas (NVIDIA PRIME render offload'dan farqli, u yerda bu yo'l ancha pishiq ishlangan).

## Yakuniy xulosa va tavsiya

1. **GUI render (Chrome, VS Code, Telegram oynalari) — Vega 8'da qolishi kerak.** Buni Wayland+Mutter ostida ishonchli o'zgartirib bo'lmaydi (sinab ko'rilgan usul — displeyni buzadi).
2. **Og'ir ish (video encode/decode) allaqachon to'g'ri GPU'da (RX560X, VA-API orqali) va samarali ishlayapti** — bu qism o'zgartirishga muhtoj emas.
3. Agar GUI ilovalarni haqiqatan RX560X'da ishlatish zarur bo'lsa, yagona ishonchli yo'l — **Xorg sessiyasiga o'tish** (login ekranida "Ubuntu on Xorg"), chunki u yerda `DRI_PRIME` klassik client-side PRIME sifatida ishlaydi, compositor bilan kelishuvga bog'liq emas.
4. Muqobil (agressiv, sinalmagan): BIOS'da "Graphics Mode: Hybrid → Discrete" sozlamasi bo'lsa, RX560X'ni yagona GPU qilib qo'yish mumkin (mux orqali) — lekin bu holda Vega 8 umuman ishlamay qoladi va batareya sarfi oshadi.
5. **Amaliy tavsiya:** hozirgi holatni o'zgartirmaslik — u allaqachon optimal taqsimot (yengil GUI ish — kam quvvatli iGPU'da, og'ir video ish — dGPU'da).
