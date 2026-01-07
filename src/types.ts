export interface Task {
    id: string;
    text: string;
    completed: boolean;
    color: TaskColor;
    createdAt: number;
}

export type TaskColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink';

export const TASK_COLORS: Record<TaskColor, { bg: string; border: string; glow: string }> = {
    blue: { bg: 'rgba(59, 130, 246, 0.15)', border: '#60a5fa', glow: 'rgba(96, 165, 250, 0.5)' },
    purple: { bg: 'rgba(147, 51, 234, 0.15)', border: '#c084fc', glow: 'rgba(192, 132, 252, 0.5)' },
    green: { bg: 'rgba(34, 197, 94, 0.15)', border: '#4ade80', glow: 'rgba(74, 222, 128, 0.5)' },
    orange: { bg: 'rgba(249, 115, 22, 0.15)', border: '#fb923c', glow: 'rgba(251, 146, 60, 0.5)' },
    pink: { bg: 'rgba(236, 72, 153, 0.15)', border: '#f472b6', glow: 'rgba(244, 114, 182, 0.5)' },
};
