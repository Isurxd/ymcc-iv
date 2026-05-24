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
  // Global State for Exam - Moved to top for better scoping
  let isExamRunning = false;
  let examStartedAt = null;
  let durationSeconds = 120 * 60; // Default 2 hours

  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Custom API for Global Exam State
      if (pathname === '/api/exam-live-status') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ isExamRunning, examStartedAt, durationSeconds }));
        return;
      }

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

    // Initial state sync
    socket.emit('EXAM_STATE_SYNC', { isExamRunning, examStartedAt, durationSeconds });

    // EXAM STATE CONTROLS (Operator -> Exam Center)
    socket.on('START_EXAM', (data) => {
      console.log('START_EXAM Triggered', data);
      isExamRunning = true;
      examStartedAt = data.timestamp || Date.now();
      durationSeconds = data.durationSeconds || durationSeconds;
      io.emit('EXAM_STARTED', { examStartedAt, durationSeconds });
      io.emit('EXAM_STATE_SYNC', { isExamRunning, examStartedAt, durationSeconds });
    });

    socket.on('PAUSE_EXAM', (data) => {
      console.log('PAUSE_EXAM Triggered');
      isExamRunning = false;
      // Optionally adjust durationSeconds based on how much time was used
      if (data && data.durationSeconds !== undefined) {
        durationSeconds = data.durationSeconds;
      }
      examStartedAt = null;
      io.emit('EXAM_PAUSED', { durationSeconds });
      io.emit('EXAM_STATE_SYNC', { isExamRunning, examStartedAt, durationSeconds });
    });

    socket.on('GET_EXAM_STATE', () => {
      socket.emit('EXAM_STATE_SYNC', { isExamRunning, examStartedAt, durationSeconds });
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
