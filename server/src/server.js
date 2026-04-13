require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const mongoose   = require('mongoose');
const path       = require('path');

const authRoutes  = require('./routes/auth.routes');
const chatRoutes  = require('./routes/chat.routes');
const toolsRoutes = require('./routes/tools.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// ── Sécurité ──────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || '*' }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

// ── Routes API ────────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({
  ok: true, service: 'orion-server', version: '2.0.0',
  time: new Date().toISOString(),
}));

app.use('/api/auth',  authRoutes);
app.use('/api/chat',  chatRoutes);
app.use('/api/tools', toolsRoutes);

// ── Servir le client React en production ──────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });
}

app.use(errorMiddleware);

// ── MongoDB ───────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/orion';

mongoose.connect(MONGO_URI)
  .then(() => console.log('🍃 MongoDB connecté'))
  .catch(err => console.warn('⚠️  MongoDB non connecté :', err.message));

// ── Démarrage ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 ORION v2 server on http://localhost:${PORT}`);
});
