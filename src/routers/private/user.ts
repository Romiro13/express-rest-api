import { findMany } from "@/services/user.ts";
import { Router } from "express";

export const privateUserRouter: Router = Router();

privateUserRouter.get("/", async (_req, res) => {
  return res.status(200).json(await findMany());
});
