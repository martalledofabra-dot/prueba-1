import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskColor, TASK_COLORS } from '../types';

interface TaskFormProps {
    onAdd: (text: string, color: TaskColor) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAdd }) => {
    const [text, setText] = useState('');
    const [selectedColor, setSelectedColor] = useState<TaskColor>('blue');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onAdd(text, selectedColor);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What needs to be done?"
                    autoFocus
                />
                <button type="submit" className="btn-primary" aria-label="Add Task">
                    <Plus size={24} />
                </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
                    Color tag:
                </span>
                {(Object.keys(TASK_COLORS) as TaskColor[]).map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: TASK_COLORS[color].border,
                            border: selectedColor === color ? '2px solid white' : '2px solid transparent',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            transform: selectedColor === color ? 'scale(1.2)' : 'scale(1)',
                            boxShadow: selectedColor === color ? `0 0 10px ${TASK_COLORS[color].glow}` : 'none',
                            padding: 0,
                        }}
                        aria-label={`Select ${color} color`}
                    />
                ))}
            </div>
        </form>
    );
};
