# Qo'lda bajariladigan komandalar (sudo parol kerak)

Terminalda nusxalab bo'lmasa: bu faylni VSCode yoki `nano`/`gedit` da oching,
har bir blokni belgilab (mouse bilan tanlab) nusxalang, terminalga joylang (Ctrl+Shift+V).

Docker cache/volume/image tozalash **allaqachon bajarildi** (Claude tomonidan,
sudo kerak bo'lmadi — 6.29GB bo'shadi). Quyidagilar hali qolgan.

## 1. Eski yadro qoldiqlarini tozalash (27 ta `rc` paket)

```
sudo apt purge -y $(dpkg -l | grep '^rc' | awk '{print $2}')
```

## 2. Ishlatilmaydigan xizmatlarni + Docker paketlarini o'chirish

```
sudo apt purge -y nginx nginx-common python3-certbot-nginx certbot rabbitmq-server redis redis-server redis-tools cloudflare-warp docker-ce docker-ce-cli containerd.io
```

## 3. Ortiqcha qoldiqlarni tozalash (erlang-*, docker-buildx-plugin va h.k.)

```
sudo apt autoremove -y --purge
```

## 4. APT keshni tozalash (689MB)

```
sudo apt-get clean
```

## 5. Snap'dagi eski (disabled) revizyalarni o'chirish

```
snap list --all | awk '/disabled/{print $1, $3}' | while read name rev; do sudo snap remove "$name" --revision="$rev"; done
```

---

Barchasini bajargach, Claude'ga xabar bering — natija tekshirilib,
`status.md` "✅ YOPILDI" deb yangilanadi va GitHub'ga push qilinadi.
