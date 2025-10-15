import { hashPwd } from '@/services/user.ts';
import z from 'zod/v4';

export const userSchemaBase = z.object({
  email: z.email('Email inválido.'),
  name: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres.'),
  pwd: z.string().trim().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

export const userForCreateSchema = userSchemaBase.transform(async data => {
  return {
    ...data,
    pwd: await hashPwd(data.pwd),
  };
});

export const userForUpdateSchema = userSchemaBase
  .omit({ email: true })
  .partial()
  .extend({ id: z.string() })
  .transform(async data => {
    return {
      ...data,
      pwd: data.pwd ? await hashPwd(data.pwd) : undefined,
    };
  });

export type User = z.infer<typeof userSchemaBase>;
export type UserForCreate = z.infer<typeof userForCreateSchema>;
export type UserForUpdate = z.infer<typeof userForUpdateSchema>;
