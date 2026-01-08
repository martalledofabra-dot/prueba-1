import { MiniCalendar } from './MiniCalendar';

interface SidebarProps {
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

export function Sidebar({ selectedDate, onDateSelect }: SidebarProps) {
    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            backgroundColor: 'var(--bg-primary)',
            height: '100%',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid var(--divider)',
            flexShrink: 0,
        }}>
            <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
                <MiniCalendar selectedDate={selectedDate} onDateSelect={onDateSelect} />
            </div>
        </aside>
    );
}
