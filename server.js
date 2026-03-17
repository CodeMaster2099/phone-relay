const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const fs = require('fs');
const path = require('path');

const server = createServer((req, res) => {
  if (req.url === '/phone-hub') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.join(__dirname, 'phone-hub.html')).pipe(res);
  } else if (req.url === '/dashboard') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.join(__dirname, 'dashboard.html')).pipe(res);
  } else {
    res.writeHead(200);
    res.end('phone-relay alive');
  }
});

const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', ws => {
  clients.add(ws);
  console.log('client connected, total:', clients.size);
  ws.on('message', msg => {
    clients.forEach(c => {
      if (c !== ws && c.readyState === 1) c.send(msg);
    });
  });
  ws.on('close', () => {
    clients.delete(ws);
    console.log('client left, total:', clients.size);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('relay running on port', PORT));