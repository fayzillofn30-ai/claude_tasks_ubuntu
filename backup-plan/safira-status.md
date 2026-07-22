# safira — holat (2026-07-21)

`~/Desktop/safira` — GitHub'ga ulanmagan/backup qilinmagan deb belgilangan edi
(bosqich 1, 5), lekin aslida `ummatovfayzilllo/safira` repoga ulangan git repo
ekan. Foydalanuvchi so'roviga ko'ra faqat holati tekshirildi va keyin
commit+push qilindi.

## Bajarildi
- 1.7GB hajmning aksariyati `node_modules` (backend 560M + front 629M) va
  `.next` build cache (509M) edi — asl kod ~8.8MB.
- 28 fayl commit qilindi (backend service o'zgarishlari, frontend sahifalar,
  Docker/CI config, task/*.md hujjatlar, `safira_backend/.github/workflows/deploy.yml`
  o'chirildi, root'da `.github/workflows/ci-cd.yml` qo'shildi).
- Push qilindi (SSH orqali, `ummatovfayzilllo` account) — muammosiz o'tdi,
  chunki SSH key auth OAuth "workflow" scope cheklovi (edfix_clone'da uchragan)
  ostiga tushmaydi.
- Hozir: local = remote HEAD (`5cd28bf`), working tree clean.

## Eslatma
`safira` hali ham `~/Desktop`da local turibdi (o'chirilmagan, backup rejasida
"tegilmaydi" deb belgilangan edi) — endi kodi to'liq GitHub'da bo'lsa ham,
papkaning o'zi hali local'da qoladi (foydalanuvchi alohida so'ramaguncha).
