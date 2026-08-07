# 5. Use case'lar

Reja mavhum qolmasligi uchun — hozir mavjud, real vaziyatlarga bog'langan
qo'llanish holatlari.

## UC1 — Orcestor'ning 4 nusxasini birlashtirish

Tizimning **birinchi haqiqiy sinov maydoni** shu bo'ladi: `zdes-backend`,
`zdes-frontend`, `zdes-frontend/Gpt_task`, `zdes/orcestor` — to'rttasidagi
`requirements.MD`/`prompt.md` farqlarini solishtirib, standing-rules
jadvaliga bitta `topic="orcestor-standard"` sifatida kiritish. Muvaffaqiyat
mezoni: to'rtta nusxa o'rniga bitta schema, boshqa loyihalar shundan meros
oladi.

## UC2 — zdes Faza 2 davomida sessiya uzilishi

`zdes/orcestor/README.MD`da yozilganidek, Faza 2 (frontend integratsiya)
hozir alohida, parallel sessiya sifatida davom etmoqda. Agar bu sessiya
o'rtada uzilib qolsa (yoki 5-prompt chegarasiga yetib `/clear` bo'lsa),
keyingi sessiya to'liq `tasklist.md` + `backend_crud_review/*.md`ni qayta
o'qimasdan, faqat oxirgi checkpoint + tegishli standing rule'lar bilan
davom etishi kerak.

## UC3 — Uzun status.md fayllarini checkpoint formatiga siqish

`github-backup/status.md` yonida 3 ta `.err*` fayl bor — bu aslida
muvaffaqiyatsiz urinishlarning xom logi, hech qachon tozalanmagan. Yangi
tizimda bunday xom loglar DB'ga kirmaydi — faqat AGY/Claude tomonidan
**xulosalangan** checkpoint kiradi (xom log fayl darajasida qolishi mumkin,
lekin context-reload'ga tushmaydi).

## UC4 — Yangi loyiha ochilganda qoidalarni avtomatik yuklash

Hozir har yangi sessiyada `backup-plan/overview.md`dagi "Muhim qoidalar"
bo'limini (masalan git account qoidalari, qaysi papkalarga tegilmasligi)
qo'lda o'qish kerak. Standing-rules jadvali bo'lsa, `project="backup-plan"`
bo'yicha bitta so'rov shu qoidalarni to'liq, qisqa holda qaytaradi —
bir necha yuz qatorlik faylni to'liq o'qish shart bo'lmaydi.

## UC5 — Token sarfi taqsimotini keyingi haftada qayta o'lchash

Joriy holat (1.3-bo'lim): 80% context-load. Tizim qurilgach, xuddi shu
o'lchov (session boshiga sarflangan token, foizga bo'lib) qayta olinadi —
bu rejaning **muvaffaqiyat mezoni**: agar context-load ulushi sezilarli
pasaymasa, arxitektura noto'g'ri deb topiladi va 4-fayldagi taxminlar
qayta ko'riladi.
