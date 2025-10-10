import { hashPwd } from "@/services/user.ts";
import z from "zod/v4";

export const userSchema = z
  .object({
    email: z.email("Email inválido."),
    name: z.string().trim().min(3, "Nome deve ter no mínimo 3 caracteres."),
    pwd: z.string().trim().min(8, "Senha deve ter no mínimo 8 caracteres"),
    pwd_hash: z.string().optional(),
  })
  .transform(async (data) => {
    return {
      ...data,
      pwd_hash: await hashPwd(data.pwd),
    };
  });

export type User = z.infer<typeof userSchema>;
