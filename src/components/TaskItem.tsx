import React from 'react';
import { Trash2, Check, Circle } from 'lucide-react';
import { Task, TASK_COLORS } from '../types';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    const colorStyles = TASK_COLORS[task.color];

    return (
        <div
            className="task-item"
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                marginBottom: '0.75rem',
                borderRadius: '12px',
                backgroundColor: task.completed ? 'rgba(30, 41, 59, 0.4)' : colorStyles.bg,
                border: `1px solid ${task.completed ? 'transparent' : colorStyles.border}`,
                transition: 'all 0.3s ease',
                opacity: task.completed ? 0.6 : 1,
                transform: task.completed ? 'scale(0.98)' : 'scale(1)',
            }}
        >
            <button
                onClick={() => onToggle(task.id)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    marginRight: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    color: task.completed ? '#94a3b8' : colorStyles.border,
                }}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
            >
                {task.completed ? <Check size={24} /> : <Circle size={24} />}
            </button>

            <span
                style={{
                    flex: 1,
                    fontSize: '1.1rem',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#94a3b8' : '#f8fafc',
                    fontWeight: 500,
                }}
            >
                {task.text}
            </span>

            <button
                onClick={() => onDelete(task.id)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#ef4444',
                    opacity: 0.7,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                aria-label="Delete task"
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
};
