import express from 'express';
import { z } from 'zod';
import { Task } from '../models/Task.js';

const router = express.Router();

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

// Get all tasks
router.get('/', async (req: any, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// Create task
router.post('/', async (req: any, res) => {
  try {
    const taskData = taskSchema.parse(req.body);
    const task = new Task({
      ...taskData,
      userId: req.user.id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to create task' });
    }
  }
});

// Update task
router.patch('/:id', async (req: any, res) => {
  try {
    const taskData = taskSchema.partial().parse(req.body);
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      taskData,
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      res.status(500).json({ message: 'Failed to update task' });
    }
  }
});

// Delete task
router.delete('/:id', async (req: any, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

export const taskRouter = router;