import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Task, Category, TASK_COLORS } from '../types';

interface TaskItemProps {
    task: Task;
    category?: Category;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onClick?: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, category, onToggle, onDelete, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Map task colors to our CSS variables or hex values
    const getAccentColor = (color: string) => {
        switch (color) {
            case 'blue': return 'var(--accent-blue)';
            case 'green': return 'var(--accent-green)';
            case 'orange': return 'var(--accent-orange)';
            case 'pink': return 'var(--accent-red)'; // mapping pink to red for now or keep separate
            case 'purple': return '#BF5AF2';
            default: return 'var(--accent-blue)';
        }
    };

    const accentColor = getAccentColor(task.color);

    return (
        <div
            className="task-item"
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--divider)',
                transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                onClick={() => onToggle(task.id)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    marginRight: '1rem',
                    padding: '4px',
                }}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
            >
                <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: `1.5px solid ${task.completed ? accentColor : 'var(--text-secondary)'}`,
                    backgroundColor: task.completed ? accentColor : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {task.completed && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    )}
                </div>
            </button>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }} onClick={onClick}>
                <span style={{
                    color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    fontSize: '1rem',
                    transition: 'color 0.2s',
                    cursor: 'pointer',
                }}>
                    {task.text}
                </span>

                {/* Description or Subtask Summary or Category */}
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {category && (
                        <span style={{
                            fontSize: '0.75rem',
                            color: TASK_COLORS[category.color].border,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontWeight: 500,
                            padding: '1px 6px',
                            backgroundColor: TASK_COLORS[category.color].bg,
                            borderRadius: '4px'
                        }}>
                            {category.name}
                        </span>
                    )}

                    {task.description && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                            {task.description}
                        </span>
                    )}

                    {task.subtasks && task.subtasks.length > 0 && (
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--accent-green)', // Or text-secondary depending on preference, green implies progress
                            display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9H18M6 15H18" /> {/* Simple lines icon representing hierarchy */}
                            </svg>
                            {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                        </span>
                    )}
                </div>
            </div>

            <button
                onClick={() => onDelete(task.id)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.2s',
                    padding: '0.5rem',
                }}
                aria-label="Delete task"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
};
