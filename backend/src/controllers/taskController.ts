import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userId = req.userId!;
    const { title, description } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        userId,
      },
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating task' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userId = req.userId!;
    const taskId = parseInt(req.params.id);
    const { title, description, completed } = req.body;

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
      },
    });

    res.json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating task' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const taskId = parseInt(req.params.id);

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting task' });
  }
};

