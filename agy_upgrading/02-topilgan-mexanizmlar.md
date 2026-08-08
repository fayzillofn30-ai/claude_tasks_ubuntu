# 2. Topilgan mexanizmlar (2026-08-08 tadqiqot)

Bu bo'lim — rasmiy Antigravity hujjatlari (`antigravity.google/docs`) va bir
nechta community manba asosida shu kuni WebSearch orqali aniqlangan, **hali
amalda sinovdan o'tkazilmagan** mexanizmlar ro'yxati. Tekshirilmagan taxminlar
uchun qarang: [`04-taxminlar-va-tekshirish.md`](./04-taxminlar-va-tekshirish.md).

## 2.1 Execution mode — Muammo 1'ga bevosita javob

| Rejim | Xatti-harakat |
|---|---|
| `request-review` (**default**) | Har bir fayl yozishdan OLDIN pauza, syntax-highlighted diff preview ko'rsatiladi, tasdiq so'raladi |
| `accept-edits` | `Shift+Tab` bilan `request-review`dan tezkor o'tiladi — barcha kutilayotgan o'zgarishlar avtomatik tasdiqlanadi |
| `turbo` | Agent har doim avtomatik ijro etadi, faqat aniq taqiqlanmagan bo'lsa |

Manba: [Choose an execution mode](https://antigravity.google/docs/cli/modes)

**Taxmin (tekshirilmagan):** Foydalanuvchida hozir `turbo` yoki `accept-edits`
yoqilgan bo'lishi ehtimoli bor — shu sabab Muammo 1 ("darhol edit qiladi")
kuzatilgan. Qarang [4.1-band](./04-taxminlar-va-tekshirish.md#41-execution-mode-hozir-qaysi-holatda).

## 2.2 `/plan` prefiksi — Plan mode

CLI'da Plan mode yoqilganda, promptga avtomatik `/plan` prefiksi qo'shiladi.
Bu holatda agent:
1. Faqat **read-only** vositalar bilan tegishli fayllarni tekshiradi.
2. Strukturaviy ijro rejasini (execution outline) taqdim etadi.
3. Kod yozishdan OLDIN foydalanuvchi tasdig'ini kutadi.

Ayniqsa murakkab refaktoring, ko'p-fayllik arxitektura o'zgarishlari yoki
notanish kod bazasini tekshirishda tavsiya etiladi.

Manba: [Choose an execution mode](https://antigravity.google/docs/cli/modes)

## 2.3 Artifact Review sozlamasi

`Request Review` qilib qo'yilsa, agent artifact (Task List/Implementation
Plan)dagi rejaga asosan harakat qilishdan oldin har doim tasdiq so'raydi.

Manba: [Artifact Review](https://antigravity.google/docs/artifact-review),
[Permissions](https://antigravity.google/docs/permissions)

## 2.4 Qoidalar (rules) fayllarining joylashuvi — Muammo 2'ga infratuzilma

| Daraja | Joylashuv |
|---|---|
| Global (barcha loyihalarga) | `~/.gemini/GEMINI.md` |
| Loyiha-darajasida | `GEMINI.md` yoki `AGENT.md` (loyiha ildizida), yoki `.antigravityrules` |
| Workspace/qoida papkasi | `.agent/rules/*.md` |

Manba: [Context Management Strategies for Google Antigravity](https://datalakehousehub.com/blog/2026-03-context-management-google-antigravity/)

## 2.5 Context tizimi — uch ustun

Antigravity'ning o'zi context'ni uchta mexanizm orqali boshqaradi:
- **Skills** — qayta ishlatiluvchi qobiliyat (Claude Code'dagi skill konseptiga o'xshash).
- **Knowledge Items** — doimiy xotira.
- **Artifacts** — ishning shaffof hujjatlashuvi: **Task List** (kod yozishdan
  oldingi struktura reja), **Implementation Plan** (arxitektura o'zgarishlari),
  **Walkthrough** (task tugagach yaratiladigan xulosa — screenshot/video bilan
  tasdiqlangan).

Workflow: **PLANNING → EXECUTION → VERIFICATION** — bu Antigravity'ning o'ziga
xos ishlash tsikli, har bosqich alohida artifact yaratadi.

Manba: [Google Antigravity Docs — Artifacts](https://antigravity.google/docs/artifacts),
[Build with Google Antigravity — Google Developers Blog](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)

## 2.6 Community pattern — Memory Bank

`orcestor`dagi "checkpoint + standing rules + memory" uch qatlamli modeliga
juda o'xshash, tayyor community shablon bor: strukturalangan fayllar
(`activeContext.md`, `progress.md`, `decisions.md` va h.k.) — agentni har
seansda shu fayllarni o'qib, keyin javob berishga majburlaydi.

Manba: [prosman/antigravity-memory-bank (GitHub)](https://github.com/prosman/antigravity-memory-bank)

**Eslatma:** bu `new_fixing_orcestration_system`dagi "small context backup"
konsepsiyasiga deyarli bir xil g'oya — faqat Antigravity ekotizimida allaqachon
community tomonidan qurilgan versiyasi. Ikkala reja o'rtasida kelajakda
konsolidatsiya imkoniyati bor (qarang [5-bo'lim](./05-xulosa-va-keyingi-qadamlar.md)).
