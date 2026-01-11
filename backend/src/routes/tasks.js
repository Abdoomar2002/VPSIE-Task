import { Router } from "express";
import { Op } from "sequelize";
import { Task } from "../models/Task.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const { status, q } = req.query;
    const where = { userId: req.userId };

    if (status) {
      where.status = status;
    }

    if (q) {
      const term = `%${q}%`;
      where[Op.or] = [
        { title: { [Op.like]: term } },
        { description: { [Op.like]: term } },
      ];
    }

    const tasks = await Task.findAll({
      where,
      order: [["updatedAt", "DESC"]],
    });
    res.json(tasks);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    const task = await Task.create({
      title,
      description,
      status,
      userId: req.userId,
    });
    res.status(201).json(task);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id, userId: req.userId } });
    if (!task) return res.status(404).json({ error: "Task not found" });
    const { title, description, status } = req.body;
    await task.update({
      title: title ?? task.title,
      description: description ?? task.description,
      status: status ?? task.status,
    });
    res.json(task);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Task.destroy({ where: { id, userId: req.userId } });
    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
