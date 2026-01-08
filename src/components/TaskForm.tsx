import React, { useState, useRef } from 'react';
import { Calendar, Folder, Repeat } from 'lucide-react';
import { TaskColor, Category, TASK_COLORS, Task, CustomRepeat } from '../types';
import { DatePicker } from './DatePicker';
import { CategoryPicker } from './CategoryPicker';

interface TaskFormProps {
    onAdd: (text: string, color: TaskColor, date?: string, description?: string, categoryId?: string, time?: string, repeat?: Task['repeat'], customRepeat?: CustomRepeat) => void;
    categories: Category[];
    onAddCategory: (name: string, color: TaskColor) => Promise<Category | undefined>;
    onDeleteCategory: (id: string) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAdd, categories, onAddCategory, onDeleteCategory }) => {
    const [text, setText] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<string | undefined>(undefined);
    const [time, setTime] = useState<string | undefined>(undefined);
    const [repeat, setRepeat] = useState<Task['repeat']>('none');
    const [customRepeat, setCustomRepeat] = useState<CustomRepeat | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Pickers state
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [datePickerPos, setDatePickerPos] = useState({ top: 0, left: 0 });
    const [categoryPickerPos, setCategoryPickerPos] = useState({ top: 0, left: 0 });

    const dateTriggerRef = useRef<HTMLButtonElement>(null);
    const categoryTriggerRef = useRef<HTMLButtonElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!text.trim()) return;

        const color: TaskColor = selectedCategory ? selectedCategory.color : 'blue';
        onAdd(text, color, date, description, selectedCategory?.id, time, repeat, customRepeat);

        // Reset
        setText('');
        setDescription('');
        setDate(undefined);
        setTime(undefined);
        setRepeat('none');
        setCustomRepeat(undefined);
        setSelectedCategory(null);
    };

    const toggleDatePicker = () => {
        if (!showDatePicker && dateTriggerRef.current) {
            const rect = dateTriggerRef.current.getBoundingClientRect();
            setDatePickerPos({ top: rect.bottom + 8, left: rect.left });
            setShowCategoryPicker(false);
        }
        setShowDatePicker(!showDatePicker);
    };

    const toggleCategoryPicker = () => {
        if (!showCategoryPicker && categoryTriggerRef.current) {
            const rect = categoryTriggerRef.current.getBoundingClientRect();
            setCategoryPickerPos({ top: rect.bottom + 8, left: rect.left });
            setShowDatePicker(false);
        }
        setShowCategoryPicker(!showCategoryPicker);
    };

    return (
        <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--divider)',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}>
            {/* Title Input */}
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Nombre de la tarea"
                autoFocus
                style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    outline: 'none',
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            />

            {/* Description Input */}
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción"
                style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'none',
                    minHeight: '24px',
                    marginBottom: '1rem',
                }}
            />

            {/* Action Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {/* Date Trigger */}
                    <div style={{ position: 'relative' }}>
                        <button
                            ref={dateTriggerRef}
                            type="button"
                            onClick={toggleDatePicker}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '6px',
                                border: '1px solid var(--divider)',
                                color: (date || time) ? 'var(--accent-red)' : 'var(--text-secondary)',
                                background: 'transparent',
                                fontSize: '0.85rem',
                                cursor: 'pointer'
                            }}
                        >
                            <Calendar size={16} />
                            {date ? new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Hoy'}
                            {time && <span style={{ marginLeft: '4px', opacity: 0.8 }}>({time})</span>}
                            {repeat !== 'none' && <Repeat size={12} style={{ marginLeft: '4px' }} />}
                        </button>

                        {showDatePicker && (
                            <DatePicker
                                initialDate={date}
                                initialTime={time}
                                initialRepeat={repeat}
                                initialCustomRepeat={customRepeat}
                                onClose={() => setShowDatePicker(false)}
                                onSelectDate={(d, t, r, cr) => {
                                    setDate(d);
                                    setTime(t);
                                    setRepeat(r || 'none');
                                    setCustomRepeat(cr);
                                }}
                                position={datePickerPos}
                            />
                        )}
                    </div>

                    {/* Category Trigger */}
                    <div style={{ position: 'relative' }}>
                        <button
                            ref={categoryTriggerRef}
                            type="button"
                            onClick={toggleCategoryPicker}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '6px',
                                border: '1px solid var(--divider)',
                                color: selectedCategory ? 'var(--text-primary)' : 'var(--text-secondary)',
                                background: 'transparent',
                                fontSize: '0.85rem',
                                cursor: 'pointer'
                            }}
                        >
                            <Folder size={16} color={selectedCategory ? TASK_COLORS[selectedCategory.color].border : undefined} />
                            {selectedCategory ? selectedCategory.name : 'Grupo'}
                        </button>

                        {showCategoryPicker && (
                            <CategoryPicker
                                categories={categories}
                                selectedCategoryId={selectedCategory?.id}
                                onSelect={(id) => {
                                    const cat = categories.find(c => c.id === id);
                                    if (cat) setSelectedCategory(cat);
                                }}
                                onAddCategory={onAddCategory}
                                onDeleteCategory={onDeleteCategory}
                                onClose={() => setShowCategoryPicker(false)}
                                position={categoryPickerPos}
                            />
                        )}
                    </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        type="button"
                        onClick={() => handleSubmit()}
                        disabled={!text.trim()}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            backgroundColor: !text.trim() ? 'rgba(214, 109, 79, 0.5)' : 'var(--accent-red)',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: !text.trim() ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Añadir tarea
                    </button>
                </div>
            </div>
        </div>
    );
};
