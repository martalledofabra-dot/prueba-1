import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface MiniCalendarProps {
    selectedDate: string; // YYYY-MM-DD
    onDateSelect: (date: string) => void;
}

export function MiniCalendar({ selectedDate, onDateSelect }: MiniCalendarProps) {
    const [viewDate, setViewDate] = useState(() => new Date());

    const days = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        // Adjust for Monday start: Sunday (0) becomes 6, others shift down by 1
        return day === 0 ? 6 : day - 1;
    };

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const changeMonth = (delta: number) => {
        setViewDate(new Date(year, month + delta, 1));
    };

    const handleDateClick = (day: number) => {
        const monthStr = (month + 1).toString().padStart(2, '0');
        const dayStr = day.toString().padStart(2, '0');
        const dateStr = `${year}-${monthStr}-${dayStr}`;
        onDateSelect(dateStr);
    };

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const daysArray = [];
    for (let i = 0; i < firstDay; i++) {
        daysArray.push({ day: '', type: 'empty' });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push({ day: i, type: 'current' });
    }

    return (
        <div style={{ color: 'var(--text-secondary)', userSelect: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>
                    {monthNames[month]} {year}
                </span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <ChevronLeft
                        size={18}
                        style={{ cursor: 'pointer', opacity: 0.7 }}
                        onClick={() => changeMonth(-1)}
                    />
                    <ChevronRight
                        size={18}
                        style={{ cursor: 'pointer', opacity: 0.7 }}
                        onClick={() => changeMonth(1)}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.8rem', textAlign: 'center' }}>
                {days.map(d => (
                    <span key={d} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{d}</span>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '0.5rem', textAlign: 'center' }}>
                {daysArray.map((item, index) => {
                    if (item.type === 'empty') return <div key={index}></div>;

                    const currentItemDateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${item.day.toString().padStart(2, '0')}`;
                    const isSelected = currentItemDateStr === selectedDate;

                    // Check if this item is "Today"
                    const today = new Date();
                    const isToday =
                        today.getDate() === item.day &&
                        today.getMonth() === month &&
                        today.getFullYear() === year;

                    return (
                        <div
                            key={index}
                            onClick={() => handleDateClick(item.day as number)}
                            style={{
                                fontSize: '0.9rem',
                                width: '30px',
                                height: '30px',
                                margin: '0 auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                // If selected, use red bg. If today but not selected, maybe a border or light highlight?
                                // User asked to "redonde el dia en el que estamos" (round the day we are in).
                                // Usually this means a filled circle for today.
                                backgroundColor: isSelected
                                    ? 'var(--accent-red)'
                                    : isToday
                                        ? 'var(--item-active)' // darker circle for today if not selected
                                        : 'transparent',
                                color: isSelected || isToday ? 'white' : 'inherit',
                                cursor: 'pointer',
                                fontWeight: isSelected || isToday ? 600 : 400,
                                border: isToday && !isSelected ? '1px solid var(--accent-red)' : 'none', // Optional border for today
                            }}
                        >
                            {item.day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
