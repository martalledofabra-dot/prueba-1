import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Trash2 } from 'lucide-react';
import { Category, TaskColor, TASK_COLORS } from '../types';

interface CategoryPickerProps {
    categories: Category[];
    selectedCategoryId?: string;
    onSelect: (categoryId: string) => void;
    onAddCategory: (name: string, color: TaskColor) => Category;
    onDeleteCategory: (id: string) => void;
    onClose: () => void;
    position: { top: number; left: number };
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
    categories,
    selectedCategoryId,
    onSelect,
    onAddCategory,
    onDeleteCategory,
    onClose,
    position
}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newColor, setNewColor] = useState<TaskColor>('blue');

    const handleCreate = () => {
        if (!newName.trim()) return;
        const newCat = onAddCategory(newName, newColor);
        onSelect(newCat.id);
        setIsCreating(false);
        setNewName('');
        onClose();
    };

    const pickerElement = (
        <>
            <div
                style={{ position: 'fixed', inset: 0, zIndex: 2100, backgroundColor: 'transparent' }}
                onClick={onClose}
            />
            <div
                style={{
                    position: 'fixed',
                    top: position.top,
                    left: position.left,
                    width: '240px',
                    backgroundColor: '#2C2B2A',
                    border: '1px solid var(--divider)',
                    borderRadius: '12px',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
                    zIndex: 2101,
                    padding: '0.5rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {isCreating ? (
                    <div style={{ padding: '0.8rem 0.5rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.4rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                                NOMBRE
                            </label>
                            <input
                                type="text"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="Nombre del grupo"
                                autoFocus
                                style={{
                                    width: '100%',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid var(--divider)',
                                    borderRadius: '8px',
                                    padding: '0.6rem',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem',
                                    outline: 'none'
                                }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleCreate();
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.6rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                                COLOR DEL GRUPO
                            </label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {(Object.keys(TASK_COLORS) as TaskColor[]).map(c => (
                                    <div
                                        key={c}
                                        onClick={() => setNewColor(c)}
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            backgroundColor: TASK_COLORS[c].border,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'transform 0.1s',
                                            transform: newColor === c ? 'scale(1.15)' : 'scale(1)',
                                            boxShadow: newColor === c ? '0 0 0 2px #2C2B2A, 0 0 0 4px ' + TASK_COLORS[c].border : 'none'
                                        }}
                                    >
                                        {newColor === c && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={handleCreate}
                                disabled={!newName.trim()}
                                style={{
                                    flex: 1,
                                    padding: '0.6rem',
                                    backgroundColor: !newName.trim() ? 'rgba(100, 100, 80, 0.4)' : 'var(--accent-red)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: !newName.trim() ? 'not-allowed' : 'pointer',
                                    opacity: !newName.trim() ? 0.6 : 1
                                }}
                            >
                                Crear
                            </button>
                            <button
                                onClick={() => setIsCreating(false)}
                                style={{
                                    padding: '0.6rem',
                                    backgroundColor: 'transparent',
                                    color: 'var(--text-secondary)',
                                    border: '1px solid var(--divider)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div
                            style={{
                                padding: '0.5rem 0.6rem',
                                color: 'var(--text-secondary)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                marginBottom: '0.2rem'
                            }}
                        >
                            Grupo
                        </div>

                        <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                            {categories.map(cat => (
                                <div
                                    key={cat.id}
                                    onClick={() => { onSelect(cat.id); onClose(); }}
                                    style={{
                                        padding: '0.6rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        color: 'var(--text-primary)',
                                        background: selectedCategoryId === cat.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                                        margin: '1px 0'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = selectedCategoryId === cat.id ? 'rgba(255,255,255,0.08)' : 'transparent'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: TASK_COLORS[cat.color].border, flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteCategory(cat.id);
                                        }}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            display: 'flex',
                                            opacity: 0.4,
                                            transition: 'opacity 0.2s'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-red)'; e.currentTarget.style.opacity = '1'; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.opacity = '0.4'; }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div style={{ height: '1px', background: 'var(--divider)', margin: '0.4rem 0' }} />
                        <div
                            onClick={() => setIsCreating(true)}
                            style={{
                                padding: '0.7rem 0.6rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                color: 'var(--accent-red)',
                                fontWeight: 600,
                                fontSize: '0.95rem'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(214, 109, 79, 0.05)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <Plus size={18} />
                            <span>Nuevo Grupo</span>
                        </div>
                    </>
                )}
            </div>
        </>
    );

    return createPortal(pickerElement, document.body);
};
