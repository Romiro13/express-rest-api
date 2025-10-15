import { authMiddleware } from '@/middleware/auth.ts';
import { Router } from 'express';
import { privateUserRouter } from './private/user.ts';
import { authRouter } from './public/auth.ts';
import { publicUserRouter } from './public/user.ts';

export const routers: Router = Router();

routers.get('/health', (_req, res) => {
  return res.status(200).json({ message: 'ok' });
});

routers.use('/user', publicUserRouter);
routers.use('/user', authMiddleware, privateUserRouter);
routers.use('/auth', authRouter);
