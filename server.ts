import http from 'http';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import { initSocketIO } from './server/socket/socketHandler';
import authRoutes from './server/routes/authRoutes';
import userRoutes from './server/routes/userRoutes';
import foodRoutes from './server/routes/foodRoutes';
import analyticsRoutes from './server/routes/analyticsRoutes';
import aiRoutes from './server/routes/aiRoutes';
import { errorHandler } from './server/middleware/errorHandler';
import { ensureDemoDataSeeded } from './server/services/seedData';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Socket.IO configuration with CORS support
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

initSocketIO(io);

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', aiRoutes); // /api/insights

// Centralized error handler for API routes
app.use('/api', errorHandler);

// Ensure demo user "Ravi" is seeded
ensureDemoDataSeeded()
  .then(() => {
    console.log('Demo user "Ravi" and Indian meal seed data verified.');
  })
  .catch((err) => {
    console.error('Error seeding demo data:', err);
  });

// Setup Vite dev server or static file serving
async function setupViteOrStatic() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`NutriTrack AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
