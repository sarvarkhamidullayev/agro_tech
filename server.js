const path = require('path');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json()); // 🔥 SHART

// CORS ruxsat berish (frontend uchun)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// "/" ga kelgan so'rovda index.html yuborish
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let lastData = {};

app.post('/data', (req, res) => {
  lastData = req.body;
  console.log("ESP32 dan keldi:", lastData);
  res.json({ ok: true });
});

app.get('/data', (req, res) => {
  console.log("data olgani");
  res.json(lastData);
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishlayapti`);
});
