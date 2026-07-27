# APT/Docker/Snap tozalash — diagnostika va reja (2026-07-27)

Maqsad: diskni bo'shatish (92GB'dan 29GB bo'sh, 68% band) — mentorlik darslarida
tizim qotmasligi uchun, [[performance-debug]] mavzusining davomi emas, alohida sabab
(disk joyi, extension muammosi emas).

## Tahlil usuli
- `dpkg-query -W` — barcha paketlar hajm bo'yicha saralandi.
- `apt-mark showmanual` — 81 ta qo'lda o'rnatilgan paket (dependency emas).
- `systemctl is-active` — qaysi xizmatlar haqiqatan ishlab turibdi tekshirildi.
- `docker system df`, `snap list --all`, `du -sh` — Docker/Snap/home hajmlari.

## Foydalanuvchi bilan kelishilgan yakuniy qaror

**Saqlanadi:** `code` (VSCode), `nodejs`, `google-chrome-stable`, `mysql-server`
(+core), `postgresql` (+16), `libreoffice` (+core/common/style), `fonts-noto-*`,
npm globallar (`antigravity-usage`, `@angular/cli`, `@nestjs/cli`, `firebase-tools`,
`bun`, `pnpm`, `yarn` va h.k. — apt emas, tegilmaydi), `bleachbit`, `mpv`,
xitoycha/koreyscha/yaponcha IBus kiritish paketlari (`libpinyin*`, `libchewing3*`,
`m17n-db`, `ibus-table-cangjie*`, `libopencc*`, `libmarisa0`, `libotf1`), `yt-dlp`,
`nmap`, `radeontop`.

**O'chiriladi (foydalanuvchi tasdiqladi — kerak bo'lsa qayta o'rnatiladi):**
- `nginx` + `python3-certbot-nginx` + `certbot` — ishlatilmaydi (active edi, lekin kerak emas).
- `rabbitmq-server` (+ erlang-* zanjiri, avtomatik) — ishlatilmaydi (active edi).
- `redis` + `redis-server` + `redis-tools` — ishlatilmaydi.
- `cloudflare-warp` — ishlatilmaydi (210MB).
- `docker-ce` + `docker-ce-cli` + `containerd.io` — qayta o'rnatiladi, avval
  `docker system prune -a --volumes` bilan barcha image/volume/build-cache
  (~7GB: 1.7G image + 914M volume + 4.4G build cache) tozalanadi.

**Qoshimcha xavfsiz tozalash (hech narsani buzmaydi):**
- 27 ta `rc` holatidagi paket — eski yadrolarning (6.11, 6.14 x6, 6.17.0-14/20)
  qoldiq config fayllari, binary'lari allaqachon o'chirilgan.
- `/var/cache/apt/archives` — 689MB `.deb` yuklab olingan kesh.
- Snap'dagi `disabled` (eski) revizyalar — core20/22/24, snapd, telegram-desktop,
  cups, mesa-2404, gnome runtime'lari, snap-store, snapd-desktop-integration,
  firmware-updater, gnome-42-2204.

**Aniqlanmagan/kelishilmagan (qaror qilinmagan, tegilmadi):** `copyq` — foydalanuvchi
javobida tilga olinmadi, o'chirish/saqlash ro'yxatiga kiritilmagan, keyingi safar aniqlashtirilsin.

## Bajarilishi kerak bo'lgan komandalar (sudo parol talab qiladi — foydalanuvchi `!` orqali o'zi ishga tushiradi)

```bash
# 1. Eski yadro qoldiqlarini tozalash
sudo apt purge -y $(dpkg -l | grep '^rc' | awk '{print $2}')

# 2. Kerak bo'lmagan xizmat/dasturlarni o'chirish
sudo apt purge -y nginx nginx-common python3-certbot-nginx certbot \
  rabbitmq-server redis redis-server redis-tools cloudflare-warp \
  docker-ce docker-ce-cli containerd.io

# 3. Docker ma'lumotlarini bo'shatish (image/volume/build-cache)
docker system prune -a --volumes -f

# 4. Ortiqcha qoldiqlarni tozalash (erlang-*, docker-buildx-plugin va h.k. avtomatik)
sudo apt autoremove -y --purge

# 5. APT keshni tozalash
sudo apt-get clean

# 6. Snap'dagi eski (disabled) revizyalarni o'chirish
snap list --all | awk '/disabled/{print $1, $3}' | while read name rev; do
  sudo snap remove "$name" --revision="$rev"
done
```

## Holat
⏳ **KUTILMOQDA** — komandalar foydalanuvchiga berildi, hali ishga tushirilmagan.
Ishga tushirilgach, natija (bo'shagan disk joyi, xato bo'lsa) shu faylga qo'shiladi.
