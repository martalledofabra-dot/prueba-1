import { useState, useEffect } from 'react';
import { Task, TaskColor } from './types';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { LayoutList } from 'lucide-react';

function App() {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem('daily-tasks');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('daily-tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (text: string, color: TaskColor) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            text,
            completed: false,
            color,
            createdAt: Date.now(),
        };
        setTasks([newTask, ...tasks]);
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const activeTasks = tasks.filter(t => !t.completed).length;

    return (
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 1rem' }}>
            <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                <h1 style={{
                    margin: 0,
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    background: 'linear-gradient(to right, #a78bfa, #2dd4bf)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 10px rgba(139, 92, 246, 0.3))'
                }}>
                    <LayoutList size={40} color="#a78bfa" style={{ WebkitTextFillColor: 'initial' }} />
                    Daily Focus
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {activeTasks} {activeTasks === 1 ? 'task' : 'tasks'} remaining
                </p>
            </header>

            <main>
                <TaskForm onAdd={addTask} />
                <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
            </main>
        </div>
    )
}

export default App
