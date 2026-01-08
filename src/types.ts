export interface Task {
    id: string;
    text: string;
    completed: boolean;
    color: TaskColor;
    categoryId?: string;
    createdAt: number;
    date: string;
    time?: string;
    repeat?: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
    customRepeat?: CustomRepeat;
    description?: string;
    subtasks?: Subtask[];
}

export interface CustomRepeat {
    every: number;
    unit: 'day' | 'week' | 'month' | 'year';
    weekdays?: number[]; // 0-6, where 0 is Monday or Sunday? The preview has Do, Lu...
    end?: {
        type: 'never' | 'on' | 'after';
        date?: string;
        count?: number;
    };
}

export interface Category {
    id: string;
    name: string;
    color: TaskColor;
    icon?: string; // Optional icon name for now
}

export interface Subtask {
    id: string;
    text: string;
    completed: boolean;
}

export type TaskColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'yellow' | 'teal' | 'indigo' | 'gray';

export const TASK_COLORS: Record<TaskColor, { bg: string; border: string; glow: string }> = {
    // Mapping keys to Saturated Earthy aesthetic
    blue: { bg: 'rgba(148, 140, 85, 0.15)', border: '#948C55', glow: 'rgba(148, 140, 85, 0.5)' }, // Richer Olive
    purple: { bg: 'rgba(163, 140, 122, 0.15)', border: '#A38C7A', glow: 'rgba(163, 140, 122, 0.5)' }, // Warm Taupe
    green: { bg: 'rgba(100, 140, 100, 0.15)', border: '#648C64', glow: 'rgba(100, 140, 100, 0.5)' }, // Forest Green
    orange: { bg: 'rgba(214, 109, 79, 0.15)', border: '#D66D4F', glow: 'rgba(214, 109, 79, 0.5)' }, // Vibrant Terracota
    pink: { bg: 'rgba(230, 182, 162, 0.15)', border: '#E6B6A2', glow: 'rgba(230, 182, 162, 0.5)' }, // Saturated Rose
    yellow: { bg: 'rgba(214, 180, 79, 0.15)', border: '#D6B44F', glow: 'rgba(214, 180, 79, 0.5)' }, // Mustard
    teal: { bg: 'rgba(79, 214, 200, 0.15)', border: '#4FD6C8', glow: 'rgba(79, 214, 200, 0.5)' }, // Teal
    indigo: { bg: 'rgba(85, 94, 148, 0.15)', border: '#555E94', glow: 'rgba(85, 94, 148, 0.5)' }, // Indigo
    gray: { bg: 'rgba(128, 128, 128, 0.15)', border: '#808080', glow: 'rgba(128, 128, 128, 0.5)' }, // Gray
};
