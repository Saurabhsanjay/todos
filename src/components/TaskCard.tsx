import { Task } from '@/types/task';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, isCompleted: boolean) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={task.isCompleted}
            onCheckedChange={(checked) => onToggleComplete(task._id, checked as boolean)}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              <Badge variant="secondary" className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            </div>
            {task.description && (
              <p className="mt-2 text-sm text-gray-600">{task.description}</p>
            )}
            {task.dueDate && (
              <p className="mt-2 text-sm text-gray-500">
                Due: {format(new Date(task.dueDate), 'PPP')}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(task._id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}