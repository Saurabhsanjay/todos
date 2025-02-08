export interface Task {
  _id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}