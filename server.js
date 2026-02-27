const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let deviceOnline = false;
let lastState = null;
let lastStateTime = Date.now();
let stats = {
  lying_ms: 0,
  sitting_ms: 0,
  standing_ms: 0,
  walking_ms: 0,
  running_ms: 0
};

// WebSocket connection
wss.on("connection", (ws) => {
  console.log("🟢 ESP32 connected");
  deviceOnline = true;

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    const now = Date.now();

    if(lastState){
      const diff = now - lastStateTime;
      stats[lastState + "_ms"] += diff;
    }

    lastState = data.state;
    lastStateTime = now;

  });

  ws.on("close", () => {
    console.log("🔴 ESP32 disconnected");
    deviceOnline = false;
  });
});

// Static fayllar (index.html shu papkada turibdi)
app.use(express.static(__dirname));

// "/" request kelganda index.html ni qaytarish
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Realtime holat endpoint
app.get("/status", (req, res) => {
  const totalTime = Date.now() - lastStateTime + Object.values(stats).reduce((a,b)=>a+b,0);
  res.json({
    online: deviceOnline,
    current_state: lastState,
    stats,
    totalTime_ms: totalTime
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 WS server running on port ${PORT}`);
});