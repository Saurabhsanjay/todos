import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { Task, CreateTaskInput } from '@/types/task';
import api from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export function Dashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery<Task[]>('tasks', async () => {
    const response = await api.get('/tasks');
    return response.data;
  });

  const createTask = useMutation(
    async (data: CreateTaskInput) => {
      const response = await api.post('/tasks', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        setIsCreateDialogOpen(false);
        toast({ title: 'Task created successfully' });
      },
    }
  );

  const updateTask = useMutation(
    async ({ id, data }: { id: string; data: Partial<CreateTaskInput> }) => {
      const response = await api.patch(`/tasks/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        setEditingTask(null);
        toast({ title: 'Task updated successfully' });
      },
    }
  );

  const deleteTask = useMutation(
    async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        toast({ title: 'Task deleted successfully' });
      },
    }
  );

  const toggleComplete = useMutation(
    async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const response = await api.patch(`/tasks/${id}`, { isCompleted });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
      },
    }
  );

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container w-full mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={setEditingTask}
              onDelete={(id) => deleteTask.mutate(id)}
              onToggleComplete={(id, isCompleted) =>
                toggleComplete.mutate({ id, isCompleted })
              }
            />
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={(data) => createTask.mutate(data)}
            isLoading={createTask.isLoading}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              initialData={editingTask}
              onSubmit={(data) =>
                updateTask.mutate({ id: editingTask._id, data })
              }
              isLoading={updateTask.isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}