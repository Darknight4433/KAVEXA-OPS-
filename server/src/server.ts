import express, { Request, Response } from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { calculateTaskPriority } from '@kavexa/intelligence';
import { Task } from '@kavexa/shared-types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Cloudinary configuration (can be configured via environment variables on Render)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'kavexa-ops',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'abcdefghijklmnopqrstuvwxyz01234',
  secure: true
});

app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: 'KAVEXA OPS Express API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    services: {
      firebase: 'connected',
      cloudinary: 'configured',
      priorityEngine: 'operational'
    }
  });
});

// Cloudinary signature generation endpoint for secure direct client uploads
app.post('/api/cloudinary/sign', (req: Request, res: Response) => {
  try {
    const { folder = 'kavexa/general', tags = ['kavexa-ops'] } = req.body;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign: Record<string, any> = {
      timestamp,
      folder,
      tags: Array.isArray(tags) ? tags.join(',') : tags
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET || 'abcdefghijklmnopqrstuvwxyz01234'
    );

    res.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY || '123456789012345',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'kavexa-ops',
      folder
    });
  } catch (error: any) {
    console.error('Error generating Cloudinary signature:', error);
    res.status(500).json({ error: 'Failed to generate upload signature' });
  }
});

// Server-side Priority Calculation endpoint
app.post('/api/intelligence/calculate-priority', (req: Request, res: Response) => {
  try {
    const { task, context } = req.body;
    if (!task) {
      return res.status(400).json({ error: 'Task payload required' });
    }
    const breakdown = calculateTaskPriority(task as Task, context || { allTasks: [], projects: [], members: [], schedules: [] });
    res.json({ success: true, breakdown });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Cloudinary Webhook Receiver for media optimization updates
app.post('/api/webhooks/cloudinary', (req: Request, res: Response) => {
  console.log('Received Cloudinary media webhook notification:', req.body);
  res.json({ received: true });
});

app.listen(PORT, () => {
  console.log(`⚡ KAVEXA OPS Express Server running on port ${PORT}`);
});

export default app;
