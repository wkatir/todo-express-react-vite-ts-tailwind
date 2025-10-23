import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const {
      status,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '10',
      categoryId,
      overdue,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId };

    if (status === 'completed') {
      where.completed = true;
    } else if (status === 'pending') {
      where.completed = false;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    if (categoryId) {
      where.categories = {
        some: {
          categoryId: parseInt(categoryId as string),
        },
      };
    }

    if (overdue === 'true') {
      where.dueDate = {
        lt: new Date(),
      };
      where.completed = false;
    }

    const orderByField = sortBy as string;
    const orderDirection = order as 'asc' | 'desc';

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
        orderBy: { [orderByField]: orderDirection },
        skip,
        take: limitNum,
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
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
    const { title, description, dueDate, categoryIds } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
        categories: categoryIds?.length
          ? {
              create: categoryIds.map((categoryId: number) => ({
                category: { connect: { id: categoryId } },
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
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
    const { title, description, completed, dueDate, categoryIds } = req.body;

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

    if (categoryIds !== undefined) {
      await prisma.taskCategory.deleteMany({
        where: { taskId },
      });
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(categoryIds !== undefined && {
          categories: categoryIds.length
            ? {
                create: categoryIds.map((categoryId: number) => ({
                  category: { connect: { id: categoryId } },
                })),
              }
            : undefined,
        }),
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
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

export const getTaskStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const [total, completed, pending, overdue, weekTasks, categoryStats] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, completed: true } }),
      prisma.task.count({ where: { userId, completed: false } }),
      prisma.task.count({
        where: {
          userId,
          completed: false,
          dueDate: { lt: new Date() },
        },
      }),
      prisma.task.groupBy({
        by: ['createdAt'],
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        _count: true,
      }),
      prisma.category.findMany({
        where: { userId },
        include: {
          _count: {
            select: { tasks: true },
          },
        },
      }),
    ]);

    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = weekTasks.filter((task) => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= date && taskDate < nextDate;
      }).reduce((acc, task) => acc + task._count, 0);

      return {
        date: date.toISOString().split('T')[0],
        count,
      };
    });

    res.json({
      stats: {
        total,
        completed,
        pending,
        overdue,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
      weeklyData,
      categoryStats: categoryStats.map((cat) => ({
        name: cat.name,
        count: cat._count.tasks,
        color: cat.color,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching task statistics' });
  }
};

