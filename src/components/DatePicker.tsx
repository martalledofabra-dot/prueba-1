import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Sun, Clock, Repeat, Edit2 } from 'lucide-react';
import { Task, CustomRepeat } from '../types';

interface DatePickerProps {
    onClose: () => void;
    onSelectDate: (dateStr: string, time?: string, repeat?: Task['repeat'], customRepeat?: CustomRepeat) => void;
    initialDate?: string;
    initialTime?: string;
    initialRepeat?: Task['repeat'];
    initialCustomRepeat?: CustomRepeat;
    position: { top: number; left: number };
}

export const DatePicker: React.FC<DatePickerProps> = ({
    onClose,
    onSelectDate,
    initialDate,
    initialTime,
    initialRepeat = 'none',
    initialCustomRepeat,
    position
}) => {
    const [viewDate, setViewDate] = useState(() => initialDate ? new Date(initialDate) : new Date());
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [selectedTime, setSelectedTime] = useState(initialTime);
    const [selectedRepeat, setSelectedRepeat] = useState<Task['repeat']>(initialRepeat);
    const [selectedCustomRepeat, setSelectedCustomRepeat] = useState<CustomRepeat | undefined>(initialCustomRepeat);

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showRepeatPicker, setShowRepeatPicker] = useState(false);
    const [showCustomRepeatUI, setShowCustomRepeatUI] = useState(false);
    const [isManualTime, setIsManualTime] = useState(false);

    const timeListRef = useRef<HTMLDivElement>(null);

    const days = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'];

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; // Monday start
    };

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const changeMonth = (delta: number) => {
        setViewDate(new Date(year, month + delta, 1));
    };

    const handleDayClick = (dayNum: number) => {
        const monthStr = (month + 1).toString().padStart(2, '0');
        const dayStr = dayNum.toString().padStart(2, '0');
        const newDate = `${year}-${monthStr}-${dayStr}`;
        setSelectedDate(newDate);
        onSelectDate(newDate, selectedTime, selectedRepeat, selectedCustomRepeat);
    };

    const handleQuickSelect = (option: 'tomorrow' | 'weekend' | 'nextWeek' | 'noDate') => {
        const d = new Date();
        if (option === 'tomorrow') {
            d.setDate(d.getDate() + 1);
        } else if (option === 'weekend') {
            d.setDate(d.getDate() + (6 - d.getDay() + 7) % 7);
        } else if (option === 'nextWeek') {
            d.setDate(d.getDate() + (1 - d.getDay() + 7) % 7 + 7);
        }

        if (option === 'noDate') {
            setSelectedDate('');
            onSelectDate('', selectedTime, selectedRepeat, selectedCustomRepeat);
        } else {
            const monthStr = (d.getMonth() + 1).toString().padStart(2, '0');
            const dayStr = d.getDate().toString().padStart(2, '0');
            const newDate = `${d.getFullYear()}-${monthStr}-${dayStr}`;
            setSelectedDate(newDate);
            onSelectDate(newDate, selectedTime, selectedRepeat, selectedCustomRepeat);
        }
    };

    const daysArray = [];
    for (let i = 0; i < firstDay; i++) {
        daysArray.push({ day: null });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push({ day: i });
    }

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const repeatOptions: { label: string; value: Task['repeat'] }[] = [
        { label: 'No repetir', value: 'none' },
        { label: 'Diariamente', value: 'daily' },
        { label: 'Semanalmente', value: 'weekly' },
        { label: 'Mensualmente', value: 'monthly' }
    ];

    // Generate time slots every 15 minutes
    const timeSlots: string[] = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
            const hh = h.toString().padStart(2, '0');
            const mm = m.toString().padStart(2, '0');
            timeSlots.push(`${hh}:${mm}`);
        }
    }

    // Scroll selected time into view when picker opens
    useEffect(() => {
        if (showTimePicker && selectedTime && !isManualTime && timeListRef.current) {
            const selectedElement = timeListRef.current.querySelector(`[data-time="${selectedTime}"]`);
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'center' });
            }
        }
    }, [showTimePicker, selectedTime, isManualTime]);

    const handleCustomRepeatConfirm = (rule: CustomRepeat) => {
        setSelectedRepeat('custom');
        setSelectedCustomRepeat(rule);
        if (selectedDate) onSelectDate(selectedDate, selectedTime, 'custom', rule);
        setShowCustomRepeatUI(false);
        setShowRepeatPicker(false);
    };

    const pickerElement = (
        <>
            {/* Backdrop */}
            <div
                style={{ position: 'fixed', inset: 0, zIndex: 2100, backgroundColor: 'transparent' }}
                onClick={onClose}
            />

            {/* Popover Content */}
            <div
                style={{
                    position: 'fixed',
                    top: position.top,
                    left: position.left,
                    backgroundColor: '#2C2B2A',
                    border: '1px solid var(--divider)',
                    borderRadius: '12px',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
                    width: '300px',
                    zIndex: 2101,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    overflow: 'visible'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header: Selected Date Display */}
                <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--divider)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--accent-red)', fontSize: '1rem' }}>
                        {selectedDate ? new Date(selectedDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Sin fecha'}
                        {selectedTime && <span style={{ opacity: 0.8, fontSize: '0.9rem' }}> a las {selectedTime}</span>}
                    </span>
                </div>

                {/* Quick Actions */}
                <div style={{ padding: '0.3rem 0' }}>
                    <div onClick={() => handleQuickSelect('tomorrow')} style={quickOptionStyle}>
                        <Sun size={18} color="#fbbf24" style={{ marginRight: '0.75rem' }} />
                        <span style={{ flex: 1 }}>Mañana</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            {new Date(Date.now() + 86400000).toLocaleDateString('es-ES', { weekday: 'short' })}
                        </span>
                    </div>
                </div>

                <div style={{ height: '1px', background: 'var(--divider)', margin: '0.2rem 0' }} />

                {/* Calendar Header */}
                <div style={{ padding: '1rem 1.25rem 0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>{monthNames[month]} {year}</span>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <ChevronLeft size={20} style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => changeMonth(-1)} />
                            <ChevronRight size={20} style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => changeMonth(1)} />
                        </div>
                    </div>

                    {/* Weekdays */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.75rem', textAlign: 'center' }}>
                        {days.map(d => (
                            <span key={d} style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>{d}</span>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '0.5rem', textAlign: 'center' }}>
                        {daysArray.map((item, index) => {
                            const dateStr = item.day ? `${year}-${(month + 1).toString().padStart(2, '0')}-${item.day.toString().padStart(2, '0')}` : '';
                            const isSelected = dateStr === selectedDate;

                            const todaySync = new Date();
                            const isToday = item.day === todaySync.getDate() && month === todaySync.getMonth() && year === todaySync.getFullYear();

                            return (
                                <div
                                    key={index}
                                    onClick={() => item.day && handleDayClick(item.day)}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        margin: '0 auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.9rem',
                                        cursor: item.day ? 'pointer' : 'default',
                                        borderRadius: '50%',
                                        backgroundColor: isSelected ? 'var(--accent-red)' : 'transparent',
                                        color: isSelected ? 'white' : isToday ? 'var(--accent-red)' : 'var(--text-primary)',
                                        fontWeight: isToday || isSelected ? 600 : 400,
                                        border: isToday && !isSelected ? '1px solid var(--accent-red)' : 'none',
                                    }}
                                >
                                    {item.day}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div style={{ height: '1px', background: 'var(--divider)', margin: '0.75rem 0' }} />

                {/* Functional Options: Time and Repeat */}
                <div style={{ padding: '0.75rem 1.25rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => { setShowTimePicker(!showTimePicker); setShowRepeatPicker(false); setIsManualTime(false); }}
                            style={selectedTime ? activeBottomButtonStyle : bottomButtonStyle}
                        >
                            <Clock size={16} style={{ marginRight: '0.5rem' }} /> {selectedTime || 'Hora'}
                        </button>
                        {showTimePicker && (
                            <div style={timeDropdownStyle}>
                                <div style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--divider)', marginBottom: '4px' }}>
                                    {isManualTime ? (
                                        <input
                                            type="time"
                                            value={selectedTime || ''}
                                            onChange={(e) => {
                                                setSelectedTime(e.target.value);
                                                if (selectedDate) onSelectDate(selectedDate, e.target.value, selectedRepeat, selectedCustomRepeat);
                                            }}
                                            style={manualTimeInputStyle}
                                            autoFocus
                                        />
                                    ) : (
                                        <div
                                            onClick={() => setIsManualTime(true)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', flex: 1, padding: '4px' }}
                                        >
                                            <Edit2 size={12} /> Personalizada
                                        </div>
                                    )}
                                </div>
                                <div style={{ maxHeight: '180px', overflowY: 'auto' }} ref={timeListRef}>
                                    {timeSlots.map(time => (
                                        <div
                                            key={time}
                                            data-time={time}
                                            onClick={() => {
                                                setSelectedTime(time);
                                                if (selectedDate) onSelectDate(selectedDate, time, selectedRepeat, selectedCustomRepeat);
                                                setShowTimePicker(false);
                                            }}
                                            style={{
                                                padding: '0.6rem 1rem',
                                                cursor: 'pointer',
                                                fontSize: '0.95rem',
                                                borderRadius: '6px',
                                                background: selectedTime === time ? 'rgba(214, 109, 79, 0.15)' : 'transparent',
                                                color: selectedTime === time ? 'var(--accent-red)' : 'var(--text-primary)',
                                                fontWeight: selectedTime === time ? 600 : 400
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = selectedTime === time ? 'rgba(214, 109, 79, 0.15)' : 'rgba(255,255,255,0.05)'}
                                            onMouseLeave={e => e.currentTarget.style.background = selectedTime === time ? 'rgba(214, 109, 79, 0.15)' : 'transparent'}
                                        >
                                            {time}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ borderTop: '1px solid var(--divider)', marginTop: '4px' }}>
                                    <button
                                        onClick={() => {
                                            setSelectedTime(undefined);
                                            if (selectedDate) onSelectDate(selectedDate, undefined, selectedRepeat, selectedCustomRepeat);
                                            setShowTimePicker(false);
                                        }}
                                        style={clearButtonStyleDetailed}
                                    >
                                        Quitar hora
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => { setShowRepeatPicker(!showRepeatPicker); setShowTimePicker(false); setShowCustomRepeatUI(false); }}
                            style={selectedRepeat !== 'none' ? activeBottomButtonStyle : bottomButtonStyle}
                        >
                            <Repeat size={16} style={{ marginRight: '0.5rem' }} />
                            {selectedRepeat === 'none' ? 'Repetir' :
                                selectedRepeat === 'custom' ? 'Personalizado' :
                                    repeatOptions.find(o => o.value === selectedRepeat)?.label}
                        </button>
                        {showRepeatPicker && (
                            <div style={{ ...dropdownStyle, width: '160px', right: 0, left: 'auto' }}>
                                {repeatOptions.map(opt => (
                                    <div
                                        key={opt.value}
                                        onClick={() => {
                                            setSelectedRepeat(opt.value);
                                            setSelectedCustomRepeat(undefined);
                                            if (selectedDate) onSelectDate(selectedDate, selectedTime, opt.value, undefined);
                                            setShowRepeatPicker(false);
                                        }}
                                        style={{
                                            padding: '0.5rem 0.75rem',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            borderRadius: '6px',
                                            background: selectedRepeat === opt.value ? 'rgba(255,255,255,0.1)' : 'transparent'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={e => e.currentTarget.style.background = selectedRepeat === opt.value ? 'rgba(255,255,255,0.1)' : 'transparent'}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                                <div style={{ height: '1px', background: 'var(--divider)', margin: '4px 0' }} />
                                <div
                                    onClick={() => setShowCustomRepeatUI(true)}
                                    style={{
                                        padding: '0.5rem 0.75rem',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        borderRadius: '6px',
                                        color: 'var(--accent-red)',
                                        fontWeight: 600
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(214, 109, 79, 0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    Personalizar...
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Custom Repeat Sub-Panel (Animated slide would be nice, but simple overlay here) */}
                {showCustomRepeatUI && (
                    <div style={customRepeatOverlayStyle}>
                        <CustomRepeatPanel
                            onClose={() => setShowCustomRepeatUI(false)}
                            onConfirm={handleCustomRepeatConfirm}
                            initial={selectedCustomRepeat}
                        />
                    </div>
                )}
            </div>
        </>
    );

    return createPortal(pickerElement, document.body);
};

// --- Custom Repeat Components ---

const CustomRepeatPanel: React.FC<{ onClose: () => void, onConfirm: (rule: CustomRepeat) => void, initial?: CustomRepeat }> = ({ onClose, onConfirm, initial }) => {
    const [every, setEvery] = useState(initial?.every || 1);
    const [unit, setUnit] = useState<CustomRepeat['unit']>(initial?.unit || 'week');
    const [weekdays, setWeekdays] = useState<number[]>(initial?.weekdays || []);
    const [endType, setEndType] = useState<'never' | 'on' | 'after'>(initial?.end?.type || 'never');
    const [endDate, setEndDate] = useState(initial?.end?.date || '');
    const [endCount, setEndCount] = useState(initial?.end?.count || 1);

    const toggleWeekday = (idx: number) => {
        if (weekdays.includes(idx)) setWeekdays(weekdays.filter(d => d !== idx));
        else setWeekdays([...weekdays, idx].sort());
    };

    const weekdayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

    return (
        <div style={{ padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', fontWeight: 600 }}>Repetir</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.9rem' }}>Cada</span>
                <input
                    type="number"
                    value={every}
                    onChange={e => setEvery(parseInt(e.target.value) || 1)}
                    style={customNumberInputStyle}
                />
                <select
                    value={unit}
                    onChange={e => setUnit(e.target.value as any)}
                    style={customSelectStyle}
                >
                    <option value="day">días</option>
                    <option value="week">semanas</option>
                    <option value="month">meses</option>
                    <option value="year">años</option>
                </select>
            </div>

            {unit === 'week' && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>En</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {weekdayNames.map((name, i) => (
                            <button
                                key={name}
                                onClick={() => toggleWeekday(i)}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    border: '1px solid var(--divider)',
                                    background: weekdays.includes(i) ? 'var(--accent-red)' : 'transparent',
                                    color: weekdays.includes(i) ? 'white' : 'var(--text-primary)',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Termina</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={radioLabelStyle}>
                        <input type="radio" checked={endType === 'never'} onChange={() => setEndType('never')} style={radioInputStyle} />
                        Nunca
                    </label>
                    <label style={radioLabelStyle}>
                        <input type="radio" checked={endType === 'on'} onChange={() => setEndType('on')} style={radioInputStyle} />
                        En
                        <input
                            type="date"
                            disabled={endType !== 'on'}
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            style={{ ...customDateInputStyle, opacity: endType === 'on' ? 1 : 0.5 }}
                        />
                    </label>
                    <label style={radioLabelStyle}>
                        <input type="radio" checked={endType === 'after'} onChange={() => setEndType('after')} style={radioInputStyle} />
                        Después de
                        <input
                            type="number"
                            disabled={endType !== 'after'}
                            value={endCount}
                            onChange={e => setEndCount(parseInt(e.target.value) || 1)}
                            style={{ ...customNumberInputSmallerStyle, opacity: endType === 'after' ? 1 : 0.5 }}
                        />
                        veces
                    </label>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
                <button onClick={onClose} style={panelCancelButtonStyle}>Cancelar</button>
                <button
                    onClick={() => onConfirm({ every, unit, weekdays, end: { type: endType, date: endDate, count: endCount } })}
                    style={panelConfirmButtonStyle}
                >
                    Listo
                </button>
            </div>
        </div>
    );
};

// Internal styles
const quickOptionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.25rem',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'background-color 0.1s',
};

const bottomButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.6rem',
    borderRadius: '10px',
    border: '1px solid var(--divider)',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s'
};

const activeBottomButtonStyle: React.CSSProperties = {
    ...bottomButtonStyle,
    color: 'var(--accent-red)',
    borderColor: 'var(--accent-red)',
    backgroundColor: 'rgba(214, 109, 79, 0.05)',
    fontWeight: 600
};

const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    width: '150px',
    backgroundColor: '#383736',
    border: '1px solid var(--divider)',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    marginBottom: '10px',
    zIndex: 2200
};

const timeDropdownStyle: React.CSSProperties = {
    ...dropdownStyle,
    width: '160px',
    padding: '4px'
};

const manualTimeInputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--divider)',
    borderRadius: '6px',
    color: 'white',
    padding: '0.3rem 0.5rem',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    colorScheme: 'dark'
};

const clearButtonStyleDetailed: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textAlign: 'center',
    width: '100%',
    padding: '0.6rem',
    borderRadius: '4px'
};

const customRepeatOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#2C2B2A',
    borderRadius: '12px',
    zIndex: 2300,
};

const customNumberInputStyle: React.CSSProperties = {
    width: '60px',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--divider)',
    borderRadius: '6px',
    color: 'white',
    padding: '0.4rem',
    fontSize: '0.9rem',
    outline: 'none'
};

const customNumberInputSmallerStyle: React.CSSProperties = {
    ...customNumberInputStyle,
    width: '45px',
    margin: '0 8px'
};

const customSelectStyle: React.CSSProperties = {
    flex: 1,
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--divider)',
    borderRadius: '6px',
    color: 'white',
    padding: '0.4rem',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer'
};

const customDateInputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--divider)',
    borderRadius: '6px',
    color: 'white',
    padding: '0.3rem',
    fontSize: '0.85rem',
    marginLeft: '8px',
    outline: 'none',
    colorScheme: 'dark'
};

const radioLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    cursor: 'pointer'
};

const radioInputStyle: React.CSSProperties = {
    marginRight: '10px',
    accentColor: 'var(--accent-red)'
};

const panelCancelButtonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    cursor: 'pointer'
};

const panelConfirmButtonStyle: React.CSSProperties = {
    padding: '0.5rem 1.25rem',
    background: 'var(--accent-red)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer'
};
