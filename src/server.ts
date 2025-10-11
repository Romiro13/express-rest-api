import express from "express";
import { routers } from "./routers/index.ts";

const app = express();

app.use(express.json());

app.use(routers);

app.listen(3000, () => console.log("Server on..."));
