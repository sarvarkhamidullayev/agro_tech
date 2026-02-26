const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./src/auth/auth.router');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = "mongodb+srv://Coder:Coder97@cluster0.u1jkl64.mongodb.net/playcraft?retryWrites=true&w=majority" ;
console.log("MONGO_URI", MONGO_URI);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Node Auth API', docs: '/api/auth' });
});

app.use('/api/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Topilmadi' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Server xatosi' });
});

mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB ulandi');
  app.listen(PORT, () => console.log(`Server ${PORT} da ishlayapti`));
}).catch((err) => {
  console.error('MongoDB ulanish xatosi:', err);
  process.exit(1);
});
