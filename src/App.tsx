import { useState, useEffect } from 'react';
import { Task, TaskColor, Category, CustomRepeat } from './types';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { Layout } from './components/Layout';
import { TaskDetailModal } from './components/TaskDetailModal';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { Session } from '@supabase/supabase-js';
import { LogOut, Loader2 } from 'lucide-react';

function App() {
    // Initialize with today's date in local time YYYY-MM-DD
    const today = new Date().toLocaleDateString('en-CA');
    const [selectedDate, setSelectedDate] = useState<string>(today);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (!session) setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch data when session changes
    useEffect(() => {
        if (session) {
            fetchData();
        } else {
            setTasks([]);
            setCategories([]);
        }
    }, [session]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch categories first
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('*')
                .order('created_at', { ascending: true });

            if (catError) throw catError;
            setCategories(catData.map(c => ({
                id: c.id,
                name: c.name,
                color: c.color as TaskColor
            })));

            // Fetch tasks
            const { data: taskData, error: taskError } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (taskError) throw taskError;
            setTasks(taskData.map(t => ({
                id: t.id,
                text: t.text,
                completed: t.completed,
                color: t.color as TaskColor,
                createdAt: t.created_at,
                date: t.date,
                time: t.time,
                repeat: t.repeat,
                customRepeat: t.custom_repeat,
                description: t.description,
                categoryId: t.category_id,
                subtasks: t.subtasks || []
            })));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogOut = async () => {
        await supabase.auth.signOut();
    };

    const addCategory = async (name: string, color: TaskColor) => {
        if (!session) return;

        try {
            const { data, error } = await supabase
                .from('categories')
                .insert([{
                    name,
                    color,
                    user_id: session.user.id
                }])
                .select()
                .single();

            if (error) throw error;

            const newCategory: Category = {
                id: data.id,
                name: data.name,
                color: data.color as TaskColor
            };
            setCategories([...categories, newCategory]);
            return newCategory;
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const deleteTaskFromSupabase = async (id: string) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);
            if (error) throw error;
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const addTask = async (text: string, color: TaskColor, date?: string, description?: string, categoryId?: string, time?: string, repeat?: Task['repeat'], customRepeat?: CustomRepeat) => {
        if (!session) return;

        const createdAt = Date.now();
        const newTaskData = {
            text,
            completed: false,
            color,
            created_at: createdAt,
            date: date || selectedDate,
            time,
            repeat,
            custom_repeat: customRepeat,
            description,
            category_id: categoryId,
            subtasks: [],
            user_id: session.user.id
        };

        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([newTaskData])
                .select()
                .single();

            if (error) throw error;

            const newTask: Task = {
                id: data.id,
                text: data.text,
                completed: data.completed,
                color: data.color as TaskColor,
                createdAt: data.created_at,
                date: data.date,
                time: data.time,
                repeat: data.repeat,
                customRepeat: data.custom_repeat,
                description: data.description,
                categoryId: data.category_id,
                subtasks: data.subtasks || []
            };
            setTasks([newTask, ...tasks]);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const toggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const updatedCompleted = !task.completed;

        // Optimistic UI
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: updatedCompleted } : t));

        try {
            const { error } = await supabase
                .from('tasks')
                .update({ completed: updatedCompleted })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error toggling task:', error);
            // Revert on error
            setTasks(tasks.map(t => t.id === id ? { ...t, completed: !updatedCompleted } : t));
        }
    };

    const deleteTask = async (id: string) => {
        // Optimistic UI
        setTasks(tasks.filter(t => t.id !== id));
        if (selectedTask?.id === id) setSelectedTask(null);

        await deleteTaskFromSupabase(id);
    };

    const updateTask = async (updatedTask: Task) => {
        // Optimistic UI
        const previousTasks = [...tasks];
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        if (selectedTask?.id === updatedTask.id) {
            setSelectedTask(updatedTask);
        }

        try {
            const { error } = await supabase
                .from('tasks')
                .update({
                    text: updatedTask.text,
                    completed: updatedTask.completed,
                    color: updatedTask.color,
                    date: updatedTask.date,
                    time: updatedTask.time,
                    repeat: updatedTask.repeat,
                    custom_repeat: updatedTask.customRepeat,
                    description: updatedTask.description,
                    category_id: updatedTask.categoryId,
                    subtasks: updatedTask.subtasks
                })
                .eq('id', updatedTask.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating task:', error);
            setTasks(previousTasks);
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setCategories(categories.filter(c => c.id !== id));
            setTasks(tasks.map(t => t.categoryId === id ? { ...t, categoryId: undefined } : t));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const formatDateHeader = (dateStr: string) => {
        const date = new Date(dateStr + 'T12:00:00');
        const todayStr = new Date().toLocaleDateString('en-CA');

        if (dateStr === todayStr) return 'Hoy';

        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
        const formatted = date.toLocaleDateString('es-ES', options);
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    };

    if (loading && !session) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
                <Loader2 className="animate-spin" color="var(--accent-red)" size={40} />
            </div>
        );
    }

    if (!session) {
        return <Auth />;
    }

    const currentTasks = tasks.filter(t => t.date === selectedDate);
    const activeTasksCount = currentTasks.filter(t => !t.completed).length;

    return (
        <Layout selectedDate={selectedDate} onDateSelect={setSelectedDate}>
            <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                    }}>
                        {formatDateHeader(selectedDate)}
                    </h1>
                    <button
                        onClick={handleLogOut}
                        title="Cerrar sesión"
                        style={{
                            color: 'var(--text-secondary)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.color = 'var(--accent-red)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {activeTasksCount} tareas
                    </span>
                    <span style={{ opacity: 0.5 }}>•</span>
                    <span style={{ opacity: 0.8 }}>{session.user.email}</span>
                </div>
            </header>

            <TaskForm
                onAdd={addTask}
                categories={categories}
                onAddCategory={addCategory}
                onDeleteCategory={deleteCategory}
            />

            <div style={{ marginBottom: '1.5rem' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                        <Loader2 className="animate-spin" color="var(--accent-red)" size={30} />
                    </div>
                ) : (
                    <TaskList
                        tasks={currentTasks}
                        categories={categories}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onSelect={setSelectedTask}
                    />
                )}
            </div>

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    categories={categories}
                    onAddCategory={addCategory}
                    onDeleteCategory={deleteCategory}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={updateTask}
                />
            )}
        </Layout>
    );
}

export default App;
