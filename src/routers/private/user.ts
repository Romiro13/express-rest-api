import { getZodErrorMessages } from "@/lib/zod-erros.ts";
import { userForUpdateSchema } from "@/models/user.ts";
import {
  deleteUser,
  findMany,
  findOneById,
  updateUser,
} from "@/services/user.ts";
import { Router } from "express";

export const privateUserRouter: Router = Router();

privateUserRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      code: 400,
      message: "Bad Request",
      errors: ["id é obrigatório."],
    });
  }

  try {
    const user = await findOneById(id);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: "Erro ao tentar buscar no banco de dados.",
      errors: [error],
    });
  }
});

privateUserRouter.get("/", async (_req, res) => {
  return res.status(200).json(await findMany());
});

privateUserRouter.put("/", async (req, res) => {
  const userData = await userForUpdateSchema.safeParseAsync(req.body);

  if (!userData.success) {
    return res.status(400).json({
      code: 400,
      message: "Erro de input do body",
      errors: getZodErrorMessages(userData.error),
    });
  }

  try {
    const user = await updateUser(userData.data);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: "Erro ao tentar atualizar no banco de dados.",
      errors: [error],
    });
  }
});

privateUserRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      code: 400,
      message: "Bad Request",
      errors: ["id é obrigatório."],
    });
  }

  try {
    await deleteUser(id);
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      message: "Erro ao tentar deletar no banco de dados.",
      errors: [error],
    });
  }
});
