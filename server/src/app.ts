import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { config } from './config';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// ==========================================
// Security Middleware
// ==========================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: config.CORS_ORIGIN.includes(',') ? config.CORS_ORIGIN.split(',') : config.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ==========================================
// Body Parsing
// ==========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ==========================================
// Static Files (uploads)
// ==========================================
app.use('/uploads', express.static(path.join(__dirname, '..', config.UPLOAD_DIR)));

// ==========================================
// API Routes
// ==========================================
app.use('/api/v1', routes);

// ==========================================
// 404 Handler
// ==========================================
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
    code: 'NOT_FOUND',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// Global Error Handler
// ==========================================
app.use(errorHandler);

export default app;
