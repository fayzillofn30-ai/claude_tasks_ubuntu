# CHUQUR TAHLIL: telegram_app_front_end & telegram_app_backend Loyihasi

**Sana:** 2026-yil 3-avgust  
**Loyiha Nomi:** `telegram_app_front_end` (Frontend) va `telegram_app_backend` (Backend API)  
**Dasturchi Yozgan Source Code:** `src/soket/soket.gateway.ts`, `src/soket/soket.service.ts`, `prisma/schema.prisma`

---

## 1. DASTURCHINING UNIKAL WEBSOCKETS VA REAL-TIME CHAT LOGIKASI

### 1.1. Multi-Device Session Connection & Handshake Extraction Engine (`ChatGateway`)
* **Source Code:** `src/soket/soket.gateway.ts` (Lines 18-38)
* **Koddagi Yechim:**
  Dasturchi bitta foydalanuvchining bir nechta qurilmalaridan (Multi-Device) ulanishini boshqaruvchi WebSockets Handshake algoritmini yozgan:
  ```typescript
  handleConnection(client: Socket) {
      const userId = client.handshake.query.userId as string;
      const deviceId = client.handshake.query.deviceId as string;

      this.socketService.addConnection(userId, deviceId, client);

      client.on("typing", (data : {userId: string, chatId: string}) => {
          this.socketService.onTypingByUserIdUser(userId, data);
      });
      client.on("typing_stop", (data : {userId: string, chatId: string}) => {
          this.socketService.sendToUser(userId, data, "typing_stop");
      });
  }

  handleDisconnect(client: Socket) {
      const userId = client.handshake.query.userId as string;
      const deviceId = client.handshake.query.deviceId as string;
      this.socketService.removeConnection(userId, deviceId, client.id);
  }
  ```
* **Mexanizm:** Client ulanayotganda `handshake.query` orqali `userId` va `deviceId` avtomatik ajratib olinadi va `socketService.addConnection` sessiyalar registri xaritasiga (Session Map) qo'shiladi.

### 1.2. Real-Time Chat Status Event Broadcaster (`typing` & `typing_stop`)
* **Source Code:** `src/soket/soket.gateway.ts` (Lines 24-30)
* **Koddagi Yechim:** Foydalanuvchi xabar yozayotganda (`typing`), qarama-qarshi suhbatdoshga real-vaqtda `"typing"` va `"typing_stop"` hodisalarini signal shaklida yuborish mantiqi.

---

## 2. CALL CHAIN VA BOG'LIQLIK

```text
Client Connection (Handshake with query params: userId, deviceId)
  ↓
ChatGateway.handleConnection(client)
  ↓
SessionsService.addConnection(userId, deviceId, client)
  ↓
Client Event: "typing"
  ↓
SessionsService.onTypingByUserIdUser(userId, data) → Target User Client Socket Event Emit
```

---

## 3. XULOSA
8-oy Telegram klon bitiruv loyihasida dasturchi WebSockets (Socket.io) orqali Multi-device session tracking hamda real-vaqtdagi `typing` va chat holatlari boshqaruvini mukammal arxitektura qilgan.
