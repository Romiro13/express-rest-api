import { Router } from "express";
import { userRouter } from "./user.ts";
import { authRouter } from "./auth.ts";

export const routers: Router = Router();

routers.get("/health", (_req, res) => {
  return res.status(200).json({ message: "ok" });
});

routers.use("/user", userRouter);
routers.use("/auth", authRouter);
