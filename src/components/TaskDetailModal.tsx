import React, { useState, useRef } from 'react';
import { X, Plus, Circle, CheckCircle2, Calendar, Repeat } from 'lucide-react';
import { Task, Subtask, Category, TaskColor } from '../types';
import { DatePicker } from './DatePicker';
import { CategoryPicker } from './CategoryPicker';

interface TaskDetailModalProps {
    task: Task;
    categories: Category[];
    onAddCategory: (name: string, color: TaskColor) => Promise<Category | undefined>;
    onDeleteCategory: (id: string) => void;
    onClose: () => void;
    onUpdate: (updatedTask: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, categories, onAddCategory, onDeleteCategory, onClose, onUpdate }) => {
    const [subtaskText, setSubtaskText] = useState('');
    const [isAddingSubtask, setIsAddingSubtask] = useState(false);

    // Pickers State
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [datePickerPos, setDatePickerPos] = useState({ top: 0, left: 0 });
    const [categoryPickerPos, setCategoryPickerPos] = useState({ top: 0, left: 0 });

    const dateTriggerRef = useRef<HTMLButtonElement>(null);
    const categoryTriggerRef = useRef<HTMLButtonElement>(null);

    const handleToggleSubtask = (subtaskId: string) => {
        const updatedSubtasks = task.subtasks?.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
        ) || [];
        onUpdate({ ...task, subtasks: updatedSubtasks });
    };

    const handleAddSubtask = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!subtaskText.trim()) return;

        const newSubtask: Subtask = {
            id: crypto.randomUUID(),
            text: subtaskText,
            completed: false
        };

        const currentSubtasks = task.subtasks || [];
        onUpdate({ ...task, subtasks: [...currentSubtasks, newSubtask] });
        setSubtaskText('');
        setIsAddingSubtask(false);
    };

    const handleDeleteSubtask = (subtaskId: string) => {
        const updatedSubtasks = task.subtasks?.filter(st => st.id !== subtaskId) || [];
        onUpdate({ ...task, subtasks: updatedSubtasks });
    };

    const toggleDatePicker = () => {
        if (!showDatePicker && dateTriggerRef.current) {
            const rect = dateTriggerRef.current.getBoundingClientRect();
            // Position to the left of the button to try and avoid modal boundaries if modal is centered
            setDatePickerPos({ top: rect.bottom + 8, left: rect.left - 150 });
            setShowCategoryPicker(false);
        }
        setShowDatePicker(!showDatePicker);
    };

    const toggleCategoryPicker = () => {
        if (!showCategoryPicker && categoryTriggerRef.current) {
            const rect = categoryTriggerRef.current.getBoundingClientRect();
            setCategoryPickerPos({ top: rect.bottom + 8, left: rect.left - 150 });
            setShowDatePicker(false);
        }
        setShowCategoryPicker(!showCategoryPicker);
    };

    const currentCategory = categories.find(c => c.id === task.categoryId);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(2px)'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: '#2C2B2A',
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                maxHeight: '85vh',
                borderRadius: '16px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'visible',
                color: 'var(--text-primary)',
            }} onClick={e => e.stopPropagation()}>

                <div style={{ padding: '2rem 3rem', overflowY: 'auto', flex: 1 }}>
                    {/* Top Row: Date & Category Pickers */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '1rem' }}>

                        {/* Date Picker */}
                        <div style={{ position: 'relative' }}>
                            <button
                                ref={dateTriggerRef}
                                onClick={toggleDatePicker}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: (task.date || task.time) ? 'var(--accent-red)' : 'var(--text-secondary)',
                                    background: 'rgba(255,255,255,0.03)',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Calendar size={14} />
                                {task.date ? new Date(task.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Fecha'}
                                {task.time && <span style={{ opacity: 0.8 }}>({task.time})</span>}
                                {task.repeat && task.repeat !== 'none' && <Repeat size={12} />}
                            </button>

                            {showDatePicker && (
                                <DatePicker
                                    initialDate={task.date}
                                    initialTime={task.time}
                                    initialRepeat={task.repeat}
                                    initialCustomRepeat={task.customRepeat}
                                    onClose={() => setShowDatePicker(false)}
                                    onSelectDate={(d, t, r, cr) => {
                                        onUpdate({ ...task, date: d, time: t, repeat: r, customRepeat: cr });
                                    }}
                                    position={datePickerPos}
                                />
                            )}
                        </div>

                        {/* Category Picker */}
                        <div style={{ position: 'relative' }}>
                            <button
                                ref={categoryTriggerRef}
                                onClick={toggleCategoryPicker}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: currentCategory ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    background: 'rgba(255,255,255,0.03)',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Plus size={14} style={{ color: 'var(--accent-red)' }} />
                                {currentCategory ? currentCategory.name : 'Grupo'}
                            </button>

                            {showCategoryPicker && (
                                <CategoryPicker
                                    categories={categories}
                                    selectedCategoryId={task.categoryId}
                                    onSelect={(id) => {
                                        const cat = categories.find(c => c.id === id);
                                        if (cat) onUpdate({ ...task, categoryId: cat.id, color: cat.color });
                                    }}
                                    onAddCategory={onAddCategory}
                                    onDeleteCategory={(id) => {
                                        onDeleteCategory(id);
                                        if (task.categoryId === id) {
                                            onUpdate({ ...task, categoryId: undefined });
                                        }
                                    }}
                                    onClose={() => setShowCategoryPicker(false)}
                                    position={categoryPickerPos}
                                />
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div
                            style={{
                                marginTop: '4px',
                                cursor: 'pointer',
                                color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                            }}
                            onClick={() => onUpdate({ ...task, completed: !task.completed })}
                        >
                            <Circle size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <input
                                type="text"
                                value={task.text}
                                onChange={(e) => onUpdate({ ...task, text: e.target.value })}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                    width: '100%',
                                    outline: 'none',
                                    marginBottom: '0.5rem',
                                    padding: 0
                                }}
                            />
                            <textarea
                                value={task.description || ''}
                                onChange={(e) => onUpdate({ ...task, description: e.target.value })}
                                placeholder="Descripción"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    width: '100%',
                                    resize: 'none',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    minHeight: '1.5em'
                                }}
                                rows={1}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = target.scrollHeight + 'px';
                                }}
                            />
                        </div>
                    </div>

                    {/* Subtasks */}
                    <div style={{ marginLeft: '2.5rem', marginBottom: '2rem' }}>
                        {task.subtasks?.map(st => (
                            <div key={st.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.5rem 0',
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                            }} className="group">
                                <button
                                    onClick={() => handleToggleSubtask(st.id)}
                                    style={{ color: st.completed ? 'var(--accent-green)' : 'var(--text-secondary)' }}
                                >
                                    {st.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                </button>
                                <span style={{
                                    flex: 1,
                                    textDecoration: st.completed ? 'line-through' : 'none',
                                    color: st.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                                    fontSize: '0.95rem'
                                }}>
                                    {st.text}
                                </span>
                                <button
                                    onClick={() => handleDeleteSubtask(st.id)}
                                    style={{
                                        cursor: 'pointer',
                                        color: 'var(--text-secondary)',
                                        opacity: 0.5,
                                        transition: 'opacity 0.2s',
                                        padding: '4px'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
                                    title="Eliminar subtarea"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}

                        <div style={{ marginTop: '1rem' }}>
                            {isAddingSubtask ? (
                                <form
                                    onSubmit={handleAddSubtask}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        padding: '0.8rem 1rem',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <Circle size={18} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                                    <input
                                        autoFocus
                                        type="text"
                                        value={subtaskText}
                                        onChange={e => setSubtaskText(e.target.value)}
                                        placeholder="Nueva subtarea"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-primary)',
                                            flex: 1,
                                            fontSize: '0.95rem',
                                            outline: 'none'
                                        }}
                                        onBlur={() => !subtaskText && setIsAddingSubtask(false)}
                                    />
                                </form>
                            ) : (
                                <button
                                    onClick={() => setIsAddingSubtask(true)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        width: '100%',
                                        padding: '0.8rem 1rem',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.95rem',
                                        fontWeight: 400,
                                        transition: 'all 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                    }}
                                >
                                    <Plus size={20} style={{ color: 'var(--accent-red)' }} />
                                    <span>Añadir subtarea</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
