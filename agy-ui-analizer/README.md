# agy-ui-analizer

Frontend/UI qismini avtomatik screenshot + Gemini Vision API orqali
tahlil qilib, topilgan vizual bug'larni Executer_Agent (`agy`) orqali
tuzatuvchi skill. **Bu — Agy (Antigravity CLI)ning o'z skill tizimi
uchun mo'ljallangan**, Claude Code skill emas (qarang "O'rnatish").
To'liq metodologiya va qarorlar asosi — o'z-o'zidan yetarli, tashqi
manbaga bog'liq emas: [`docs/design-rationale.md`](./docs/design-rationale.md).

## Zanjir — tartib MAJBURIY

```
1. agy-align       → Agy'ning global xatti-harakat qoidalari (~/.gemini/GEMINI.md)
2. orcestor-start   → loyiha-darajasida Orcestor/Executer pipeline'i
3. agy-ui-analizer  → UI review va fix avtomatlashtirish (SHU SKILL)
```

`agy-ui-analizer` boshqa ikkisiga tayanadi — o'zi mustaqil ishga
tushirilsa (1 va 2 o'rnatilmagan holda), fix-dispatch bosqichi
ishonchsiz/xavfliroq bo'ladi. Tafsilot: `SKILL.md`, 0-bosqich.

## Talablar

- **Node.js + npm** — `puppeteer` uchun (`npm install puppeteer`).
- **Python 3** — `google-genai` uchun (alohida `venv` tavsiya etiladi,
  tizim Python'iga to'g'ridan-to'g'ri o'rnatish PEP 668 xatoligi berishi
  mumkin).
- **`GEMINI_API_KEY`** — loyiha `.env`sida (`api_key=...`, yoki
  `GEMINI_API_KEY=...`/`GOOGLE_API_KEY=...`).
- **`agy` (Antigravity CLI)** — Executer_Agent sifatida, `agy-align` va
  (tavsiya etiladi) `orcestor-start` bilan birga.

## O'rnatish

Bu skill **Agy**ning o'z skill papkasiga o'rnatiladi (`agy-align` bilan
bir xil joy) — Claude Code'ning `~/.claude/skills/`iga EMAS:

```bash
cp -r agy-ui-analizer ~/.gemini/antigravity-cli/builtin/skills/agy-ui-analizer
```

O'rnatilgach, `agy -p "/skills"` chiqishida `agy-ui-analizer` ko'rinishi
kerak — shu orqali tekshirish mumkin.

## Qo'lda ishga tushirish (skill orqali emas, to'g'ridan-to'g'ri)

```bash
cd agy-ui-analizer
npm install puppeteer
python3 -m venv venv && ./venv/bin/pip install google-genai

node scripts/review_pages.js http://localhost:4300 ./output 20
./venv/bin/python scripts/analyze_pages.py ./output templates/prompt.md /path/to/.env
```

Natija: `./output/pages.json` (manifest) + har sahifa uchun
`./output/<slug>/{screenshot.png,console.log,gemini_response.md}`.

## Fayllar

| Fayl | Vazifasi |
|---|---|
| `SKILL.md` | To'liq jarayon: old-shart tekshiruvi, 5 bosqich, filtrlash va fix-dispatch qoidalari |
| `docs/design-rationale.md` | Har bir dizayn qarorining sababi va asosi (o'z-o'zidan yetarli) |
| `scripts/review_pages.js` | Crawl + screenshot + konsol logi (Puppeteer) |
| `scripts/analyze_pages.py` | Har sahifa uchun Gemini Vision tahlili |
| `templates/prompt.md` | Standart UI-review prompt (soxta-pozitivlarga qarshi ko'rsatmalar bilan) |
| `templates/.env.example` | API kalit formati namunasi (haqiqiy kalit emas) |
| `config.env.example` | Barcha limitlar (crawl, Gemini RPM, fix-dispatch chegarasi) |

## Nega bu shakl tanlangan (qisqa asos)

To'liq tushuntirish: [`docs/design-rationale.md`](./docs/design-rationale.md).
Qisqacha:
- **Crawling, config-parsing emas** — framework-agnostik, mavjud
  Puppeteer vositasiga mos (bo'lim 1).
- **Gemini javobi filtrlanadi, to'g'ridan-to'g'ri Agy'ga uzatilmaydi** —
  real sinovda Gemini'ning o'zida soxta-pozitiv topilgan (bo'lim 2).
- **Fix-dispatch tor, aniq prompt bilan** — headless `agy -p`ni
  ishonchli boshqarishning yagona isbotlangan usuli shu (bo'lim 3).
