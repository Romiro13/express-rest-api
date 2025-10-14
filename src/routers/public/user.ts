import { getZodErrorMessages } from "@/lib/zod-erros.ts";
import { userForCreateSchema, userSchemaBase } from "@/models/user.ts";
import { createUser } from "@/services/user.ts";
import { Router } from "express";

export const publicUserRouter: Router = Router();

publicUserRouter.post("/", async (req, res) => {
  const userData = await userSchemaBase.safeParseAsync(req.body);

  if (!userData.success) {
    return res.status(400).json({
      code: 400,
      message: "Erro de input do body",
      errors: getZodErrorMessages(userData.error),
    });
  }

  try {
    const data = await userForCreateSchema.parseAsync(userData.data);
    const user = await createUser(data);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: "Erro ao tentar salvar no banco de dados.",
      errors: [error],
    });
  }
});
