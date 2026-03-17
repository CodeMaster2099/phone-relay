const { createServer } = require('http');
const { WebSocketServer } = require('ws');

const server = createServer((req, res) => {
  res.writeHead(200);
  res.end('phone-relay alive');
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
