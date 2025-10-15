import { getZodErrorMessages } from '@/lib/zod-erros.ts';
import { userSchemaBase } from '@/models/user.ts';
import { login } from '@/services/user.ts';
import { Router } from 'express';

export const authRouter: Router = Router();

authRouter.post('/login', async (req, res) => {
  const parsed = await userSchemaBase.safeParseAsync(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      code: 400,
      message: 'Bad Request',
      errors: getZodErrorMessages(parsed.error),
    });
  }

  const token = await login(parsed.data);

  if (!token) {
    res.status(401).json({
      code: 401,
      message: 'Unauthorized',
      errors: ['email ou senha inválido.'],
    });
  }

  return res.status(200).json({ token });
});
