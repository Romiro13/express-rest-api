import z from "zod/v4";

export const userSchema = z.object({
  email: z.email("Email inválido."),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres."),
  pwd: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export type User = z.infer<typeof userSchema>;
