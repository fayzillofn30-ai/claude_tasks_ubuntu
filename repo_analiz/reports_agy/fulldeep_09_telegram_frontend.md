# telegram_app_front_end — Chuqur (Full-Deep) Tahlil Hisoboti

**Sana:** 2026-08-03  
**Qamrab olingan manba fayllar soni:** 86 ta source fayl (konfiguratsiyalar, Next.js App Router sahifalari, UI komponentlar, feature API va hooklar, Zustand store'lar va yordamchi scriptlar).

---

## Kirish

Ushbu hisobot `/home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_front_end/` papkasida joylashgan Next.js va React Query + Socket.io + Zustand stackida qurilgan frontend loyihasining to'liq va manba-fayllar kesimidagi chuqur tahlilidir.

Avvalgi tahlillarda qayd etilgan standart framework andozalari (masalan, oddiy Axios interceptorlar, Next.js standart sahifalari va oddiy useState) va `principles.md` dagi umumiy xususiyatlar chetga surilib, faqat dasturchi (Fayzillo) tomonidan yozilgan **noodatiy, custom, standart bo'lmagan algoritmlar, arxitekturaviy mantiqlar hamda o'ziga xos yechimlar** ajratib olindi.

---

## Topilgan Noodatiy Yechimlar va Custom Logikalar

#### FACT
- Fayl: `src/components/center/SendMessage.tsx` (L24–L46)
- Kod parchasi:
```typescript
const handleTyping = () => {
  if (!socket || !user?.userId || !chat?.id) return

  // Emit "typing" only once until "typing_stop" is sent
  if (!isTypingRef.current) {
    socket.emit("typing", {
      userId: user.userId,
      chatId: chat.id,
    })
    isTypingRef.current = true
  }

  // Reset timeout
  if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

  typingTimeoutRef.current = setTimeout(() => {
    socket.emit("typing_stop", {
      userId: user.userId,
      chatId: chat.id,
    })
    isTypingRef.current = false
  }, 1500) // 1.5s delay before considering as "stopped typing"
}
```

#### OBSERVATION
- Klaviaturada matn yozilayotganda backendga ketma-ket, keraksiz soket eventlari yuborilishini to'suvchi latch-barrier (Ref-based debounced throttle) yaratilgan. Har safar tugma bosilganda faqat 1 marta `typing` yuboriladi, keyin 1.5 soniyalik taymer yangilanib boradi. Foydalanuvchi 1.5s davomida yozishdan to'xtagan taqdirdagina avtomatik `typing_stop` emit qilinadi.

#### NEGA ODATIY EMAS
- Standart chat ilovalarida har bir `onChange` hodisasida soketga xabar yuboriladi yoki tayyor lodash `.debounce` funksiyasi o'rnatiladi. Bu yerda React-ning qayta renderlanishiga ta'sir o'tkazmaydigan `useRef` va `setTimeout` birikmasi orqali tarmoq trafikini tejovchi va state-less ishlovchi custom network throttle mexanizmi yozilgan.

---

#### FACT
- Fayl: `src/features/messages/hooks/useMessages.ts` (L30–L76)
- Kod parchasi:
```typescript
socket.on("create-msg", addMsg);
socket.on("del-msg", delMsg);
socket.on("update-msg", updMsg);

// addMsg implementation:
const addMsg = (msg: Message) => {
  if (msg.message.chatId !== chatId) return;
  qc.setQueryData(["messages", type, chatId], (old: any) => {
    if (!old) return [msg];
    const exists = old.some(
      (m: Message) => m.message.id === msg.message.id
    );
    if (exists) return old;
    return [...old, msg];
  });
};
```

#### OBSERVATION
- Real-time chat xabarlari kelganda, o'chirilganda yoki yangilanganda React Query keshiga serverdan qayta request (refetch/invalidateQueries) yuborilmaydi. Buning o'rniga soket listenerlar ichida `qc.setQueryData` yordamida brauzer xotirasidagi kesh massivi to'g'ridan-to'g'ri va immutable tarzda o'zgartiriladi (update qilinadi).

#### NEGA ODATIY EMAS
- Standart amaliyotda soketdan event kelishi bilan `queryClient.invalidateQueries` chaqirilib, HTTP backendga qayta GET so'rovi yuboriladi. Dasturchi HTTP tarmoq yuklamasini bartaraf etish va zudlik bilan ekranda aks ettirish (zero-latency UI) uchun React Query keshini soket hodisasi ichida bevosita boshqargan.

---

#### FACT
- Fayl: `src/features/messages/api/index.ts` (L5–L26)
- Kod parchasi:
```typescript
export const getMessages = async (chatId: string, type: string) => {
  const url = `messages/${type || ""}/get-all/${chatId}`
  const { data } = await api.get(url);
  return data.messages;
};

export const removeMessage = async (id: string, type: string) => {
  const { data } = await api.delete(`/messages/${type}/remove-one/${id}`);
  return data;
};
```

#### OBSERVATION
- `type` ("groupe", "channel", "user") parametrining qiymatiga qarab REST API endpoint yo'nalishlarini dinamik matnli interpolatsiya yordamida bitta universal dispatch funksiyada shakllantirish yechimi.

#### NEGA ODATIY EMAS
- Odatda guruhlar, kanallar va shaxsiy (1-on-1) chatlar uchun alohida-alohida controller va API xizmatlari (`getUserMessages`, `getGroupMessages`, `getChannelMessages`) yaratiladi. Dasturchi polymorphic API dispatch patternini qo'llagan holda 3 xil chat turining CRUD operatsiyalarini bitta moslashuvchan adapterga jamlagan.

---

#### FACT
- Fayl: `src/app/otp/page.tsx` (L44–L50)
- Kod parchasi:
```typescript
const response = await Auth.sendVerification({ email: email, code: code }, verificationUrl)
const { accessToken, user, routerUrl } = response
localStorage.setItem("accessToken", accessToken)
localStorage.removeItem("sessionToken")

Object.keys(user).forEach((key) => setUser(key, user[key]))
router.push(routerUrl)
```

#### OBSERVATION
- OTP kodi tasdiqlangach, ilovaning qaysi sahifasiga o'tish lozimligi (`/chats`, `/create/profile`, `/`) frontend routerda statik kodlanmagan. Server yuborgan `routerUrl` parametriga asosan Next.js `router.push(routerUrl)` orqali dinamik ravishda navbatdagi routga o'tkaziladi. Shuningdek, `Object.keys(user).forEach` orqali user obyektining xususiyatlari Zustand store-ga dinamik ravishda yoziladi.

#### NEGA ODATIY EMAS
- An'anaviy frontend loyihalarda OTP/Auth tasdiqlanganidan so'ng sahifalar aro o'tish frontend shartli mantiqlari orqali hal qilinadi. Bu yerda backend HATEOAS (Hypermedia as the Engine of Application State) tamoyillariga muvofiq navigatsiya yo'nalishini serverdan dinamik yuboradi.

---

#### FACT
- Fayl: `src/components/SiderBar.tsx` (L85–L93)
- Kod parchasi:
```typescript
const handleUserSelect = async (selectedUser: User) => {
  try {
    const { data } = await api.post(selectedUser.publicUrl);
    setSelectedChat(data);
    setChatType("user");
  } catch (error) {
    console.error("❌ Chat yaratishda xato:", error);
  }
};
```

#### OBSERVATION
- Foydalanuvchilar ro'yxatidan muayyan shaxs tanlanganda chat yaratish uchun statik `/userchats/create` API endpointga emas, aksincha backenddan kelgan `selectedUser.publicUrl` atributidagi dinamik URI yo'nalishiga POST request yuboriladi.

#### NEGA ODATIY EMAS
- Frontend ilovalar odatda backend endpointlarini o'z kodida qat'iy (hardcode) yozib qo'yadi. Bu yerdagi yechim resurslarga murojaat qilish endpointlarini model atributidan o'quvchi HATEOAS yondashuvidir.

---

#### FACT
- Fayl: `src/features/messages/api/dto.ts` (L3–L19)
- Kod parchasi:
```typescript
export const createMessageSchema = Joi.object({
  chatId: Joi.string()
    .uuid()
    .required()
    .description("Chat ID (UserChat jadvalidan)")
    .example("b8f1d9c2-3456-4a21-a7ef-1234567890ab"),
  text: Joi.string()
    .optional()
    .description("Matn xabari")
    .example("Salom, yaxshimisiz?"),
  senderId: Joi.string()
    .optional()
    .description("Yuboruvchi foydalanuvchi ID")
    .example("a1b2c3d4-5678-90ab-cdef-1234567890ab"),
});
```

#### OBSERVATION
- React/Next.js frontend muhitida `Joi` validation kutubxonasidan foydalanib, xabar yuborish shaklidagi ma'lumotlarni UUID va text bo'yicha klient tomonida sinxron validatsiya qilish va `Swagger` uslubidagi `.description()` va `.example()` metadatalarini saqlash mexanizmi.

#### NEGA ODATIY EMAS
- Frontend loyihalarda validatsiya uchun odatda `Zod` yoki `Yup` ishlatiladi. `Joi` va uning `.example()` hamda `.description()` metadatalari backend (NestJS/Express/Swagger) uchun xos bo'lib, dasturchi uni frontend client validation (DTO) va backend formati o'rtasidagi yagona standart sifatida qo'llagan.

---

#### FACT
- Fayl: `src/service/socket.io.ts` (L18–L21)
- Kod parchasi:
```typescript
const socket = io("http://localhost:15976", {
  withCredentials: true,
  query: { userId, deviceId: v4() },
});
```

#### OBSERVATION
- WebSockets ulanishini hosil qilish paytida har bir brauzer sahifasi/oynasi uchun runtime'da `v4()` UUID orqali dinamik `deviceId` generatsiya qilinadi va handshake query parametri sifatiga backendga uzatiladi.

#### NEGA ODATIY EMAS
- Odatda socket ulanishida faqat `token` yoki `userId` yuboriladi. Har bir ochiq tabni alohida virtual qurilma sifatida ajratish va multi-device ulanishlarini to'g'ri yo'naltirish uchun client-side UUID handshake parametri ishlatilgan.

---

#### FACT
- Fayl: `src/app/page.tsx` (L49)
- Kod parchasi:
```typescript
setTimeout(() => socketStore.connect(user.userId), 0);
```

#### OBSERVATION
- Bosh sahifa (Home) render jarayonida socket ulanishini `useEffect` o'rniga komponent tanasida `setTimeout(..., 0)` yordamida hodisalar navbati (macro-task queue) oxiriga joylashtirish va kechiktirib ishga tushirish mantiqi.

#### NEGA ODATIY EMAS
- React arxitekturasida yon ta'sir (side-effect) beruvchi harakatlar `useEffect` ichida bajarilishi zarur. Dasturchi rendering chaqiruv steki to'shilib qolishining oldini olish va React lifecycle-dan mustaqil ravishda asinxron chaqiruv hosil qilish uchun ushbu noodatiy kechiktirish usulidan foydalangan.

---

#### FACT
- Fayl: `src/components/center/RenderMesssage.tsx` (L42 & L48–L49)
- Kod parchasi:
```typescript
const uniqueMessages: string[] = []

{allMessages.map(({ message, sender }) => {
  const isMine = user?.userId === sender.id
  if (uniqueMessages.includes(message.id)) return null
  uniqueMessages.push(message.id)
  // ... render logic
})}
```

#### OBSERVATION
- Chat xabarlarini ekranga chiqarish (mapping) davomida takrorlanuvchi ID ga ega xabarlar uchrasa, ularni filtrlash uchun JSX render sikli ichida local `uniqueMessages` massividan tracking buferi sifatida foydalanilgan.

#### NEGA ODATIY EMAS
- Odatda ma'lumotlarni dublikatlardan tozalash (deduplication) backend javobi olinganda yoki React hook'lari (`useMemo`) darajasida amalga oshiriladi. Render jarayonining o'zi ichida o'zgaruvchi massiv yordamida elementlarni in-place filtrlash va render qilish noodatiy yondashuvdir.

---

## Xulosa

`telegram_app_front_end` loyihasi to'liq tahlil qilinganda **9 ta** aniq va diqqatga sazovor noodatiy yechim hamda custom algoritmlar topildi.

Eng diqqatga sazovor 3 ta yechim:
1. **Debounced Typing Throttle Algorithm (`SendMessage.tsx`)**: Klaviaturada yozish paytida tarmoqqa ortiqcha soket xabarlari ketishini to'suvchi va render siklidan ayri holda ishlovchi state-less `useRef` + `setTimeout` latch-barrier mexanizmi.
2. **React Query In-Memory Direct Socket Mutation Adapter (`useMessages.ts` / `useChats.ts`)**: Soketdan kelgan xabarlar bo'yicha backendga qayta HTTP request yubormasdan, React Query keshini zudlik bilan va real-vaqtda immutable manipulatsiya qilish yechimi.
3. **Dynamic HATEOAS-Driven Authentication & Route Dispatch Flow (`otp/page.tsx` & `SiderBar.tsx`)**: Ilova navigatsiyasi hamda resurs endpointlarini frontendda statik emas, aksincha backend javoblaridagi dinamik URI va routelar orqali boshqarish tamoyili.
