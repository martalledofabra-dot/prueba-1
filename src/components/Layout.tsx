import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
    children: ReactNode;
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

export function Layout({ children, selectedDate, onDateSelect }: LayoutProps) {
    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-secondary)' }}>
            <Sidebar
                selectedDate={selectedDate}
                onDateSelect={onDateSelect}
            />
            <main style={{
                flex: 1,
                overflowY: 'auto',
                padding: '2rem 3rem',
                maxWidth: '900px', /* Limit content width for readability */
                margin: '0 auto'
            }}>
                {children}
            </main>
        </div>
    );
}
