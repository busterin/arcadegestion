const path = require("path");
const http = require("http");
const express = require("express");
const { WebSocketServer, WebSocket } = require("ws");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.resolve(__dirname)));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/versus" });

const clients = new Map();
const waiting = new Set();
const matches = new Map();

function sendTo(clientId, payload) {
  const ws = clients.get(clientId);
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify(payload));
}

function removeFromWaiting(clientId) {
  waiting.delete(clientId);
}

function breakMatch(clientId, notify = true) {
  const opponentId = matches.get(clientId);
  if (!opponentId) return;

  matches.delete(clientId);
  matches.delete(opponentId);
  if (notify) {
    sendTo(opponentId, {
      type: "vs_leave",
      from: clientId,
      to: opponentId,
      ts: Date.now()
    });
  }
}

function tryMatchPlayers() {
  const ids = [...waiting];
  while (ids.length >= 2) {
    const a = ids.shift();
    const b = ids.shift();

    waiting.delete(a);
    waiting.delete(b);

    const wsA = clients.get(a);
    const wsB = clients.get(b);
    if (!wsA || !wsB || wsA.readyState !== WebSocket.OPEN || wsB.readyState !== WebSocket.OPEN) {
      continue;
    }

    matches.set(a, b);
    matches.set(b, a);

    sendTo(a, {
      type: "vs_match_found",
      from: "server",
      to: a,
      opponentId: b,
      opponentProfile: wsB.profile || null,
      ts: Date.now()
    });

    sendTo(b, {
      type: "vs_match_found",
      from: "server",
      to: b,
      opponentId: a,
      opponentProfile: wsA.profile || null,
      ts: Date.now()
    });
  }
}

function relayToOpponent(fromId, msg) {
  const toId = msg.to || matches.get(fromId);
  if (!toId) return;

  sendTo(toId, {
    ...msg,
    from: fromId,
    to: toId,
    ts: Date.now()
  });
}

wss.on("connection", (ws) => {
  ws.clientId = null;
  ws.profile = null;

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (!msg || typeof msg !== "object") return;

    if (msg.type === "vs_register") {
      if (!msg.from) return;
      ws.clientId = msg.from;
      clients.set(ws.clientId, ws);
      return;
    }

    if (!ws.clientId) return;

    if (msg.type === "vs_looking") {
      ws.profile = msg.profile || null;
      removeFromWaiting(ws.clientId);
      waiting.add(ws.clientId);
      tryMatchPlayers();
      return;
    }

    if (msg.type === "vs_cancel") {
      removeFromWaiting(ws.clientId);
      return;
    }

    if (msg.type === "vs_mission_resolved" || msg.type === "vs_match_end") {
      relayToOpponent(ws.clientId, msg);
      return;
    }

    if (msg.type === "vs_leave") {
      breakMatch(ws.clientId, true);
    }
  });

  ws.on("close", () => {
    if (!ws.clientId) return;
    clients.delete(ws.clientId);
    removeFromWaiting(ws.clientId);
    breakMatch(ws.clientId, true);
  });
});

server.listen(PORT, () => {
  console.log(`Arcade Gestion server running on http://0.0.0.0:${PORT}`);
});
