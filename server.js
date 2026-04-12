const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request', err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Socket.io Event Handlers
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // EXAM STATE CONTROLS (Operator -> Exam Center)
    socket.on('START_EXAM', (data) => {
      console.log('START_EXAM Triggered', data);
      io.emit('EXAM_STARTED', data);
    });

    socket.on('PAUSE_EXAM', () => {
      console.log('PAUSE_EXAM Triggered');
      io.emit('EXAM_PAUSED');
    });

    socket.on('SHOW_QUESTION', (questionData) => {
      console.log('Broadcasting Question', questionData);
      io.emit('ACTIVE_QUESTION', questionData);
    });

    // PROCTORING (Exam Center -> Operator Cheat Monitor)
    socket.on('TAB_SWITCH_DETECTED', (participantData) => {
      console.log('Cheat detected:', participantData);
      io.emit('CHEAT_WARNING', participantData);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  server.once('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Socket.io engine running on same HTTP port`);
  });
});
