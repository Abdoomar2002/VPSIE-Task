import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./db.js";
import authRouter from "./routes/auth.js";
import tasksRouter from "./routes/tasks.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});

const port = process.env.PORT || 4000;
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(port, () => console.log(`API running on :${port}`));
  } catch (e) {
    console.error("Failed to start server:", e?.message || e);
    process.exit(1);
  }
}
start();
