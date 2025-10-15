import { validarToken } from "@/lib/jwt.ts";
import type { Request, Response, NextFunction } from "express";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization && !authorization?.startsWith("Bearer "))
    return res.status(404).json({
      code: 404,
      message: "Não autorizado.",
      errors: [
        `Header authorization não foi definido ou não começa com 'Bearer '.`,
      ],
    });

  const token = authorization.split(" ")[1];

  if (!token)
    return res.status(404).json({
      code: 404,
      message: "Não autorizado.",
      errors: ["Authorization sem token"],
    });

  try {
    await validarToken(token);
  } catch (err) {
    return res
      .status(404)
      .json({ code: 404, message: "Erro ao validar token", errors: [err] });
  }

  next();
}
