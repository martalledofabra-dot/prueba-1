import { TaskItem } from './TaskItem';
import { Task, Category } from '../types';

interface TaskListProps {
    tasks: Task[];
    categories: Category[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onSelect: (task: Task) => void;
}

export function TaskList({ tasks, categories, onToggle, onDelete, onSelect }: TaskListProps) {
    if (tasks.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    category={categories.find(c => c.id === task.categoryId)}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onClick={() => onSelect(task)}
                />
            ))}
        </div>
    );
};
