import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { testConnection } from './database/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './modules/auth/authRoutes.js';
import platformAdminRoutes from './modules/platformAdmin/platformAdminRoutes.js';
import shopsRoutes from './modules/shops/shopsRoutes.js';
import usersRoutes from './modules/users/usersRoutes.js';
import inventoryRoutes from './modules/inventory/inventoryRoutes.js';
import transactionsRoutes from './modules/transactions/transactionsRoutes.js';
import placeholdersRoutes from './modules/placeholders/placeholdersRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ensure upload directory exists
const uploadPath = path.resolve(config.uploadDir);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend dev server and direct calls
  credentials: true,
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads serving
app.use('/uploads', express.static(uploadPath));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    app: 'NRXTOO Multi-Tenant Jewellery & Stones Suite API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/platform-admin', platformAdminRoutes);
app.use('/api/shops', shopsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/placeholders', placeholdersRoutes);

// Global Error Handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`✨ NRXTOO Jewellery & Stones Backend API Started ✨`);
  console.log(`   Local Server: http://localhost:${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);

  // Probe Database
  await testConnection();
});

export default app;
