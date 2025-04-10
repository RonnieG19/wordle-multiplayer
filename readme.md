# Wordle Multiplayer

A private multiplayer Wordle game built for you and your colleagues.

## 🧠 Features
- Real-time play using WebSockets (Socket.IO)
- Score system based on guesses + speed
- Host sets number of rounds
- Leaderboard with persistent scoring
- Reset game when complete

---

## 🧪 Run Locally

### Backend
```bash
cd server
npm install
node index.js
```

### Frontend
```bash
cd client
npm install
npm run dev
```

---

## 🌐 Deploy Online

### Backend (Render.com)
1. Create a new Web Service on [https://render.com](https://render.com)
2. Set root directory to `/server`
3. Build Command: `npm install`
4. Start Command: `node index.js`
5. Add CORS and expose port 4000

### Frontend (Vercel.com)
1. Create project with root at `/client`
2. In `client/src/socket.js`, change:
```js
const socket = io("http://localhost:4000");
```
to:
```js
const socket = io("https://your-render-url.com");
```

---

## ✅ You're ready to play!
