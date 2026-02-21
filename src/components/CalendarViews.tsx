import { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addWeeks,
    subWeeks,
    addDays,
    subDays,
    addYears,
    subYears,
    eachMonthOfInterval,
    startOfYear,
    endOfYear,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewsProps {
    viewMode: 'year' | 'month' | 'week' | 'day';
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

export const CalendarViews: React.FC<CalendarViewsProps> = ({
    viewMode,
    selectedDate,
    onSelectDate,
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrev = () => {
        if (viewMode === 'year') setCurrentDate(subYears(currentDate, 1));
        else if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
        else if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
        else if (viewMode === 'day') setCurrentDate(subDays(currentDate, 1));
    };

    const handleNext = () => {
        if (viewMode === 'year') setCurrentDate(addYears(currentDate, 1));
        else if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
        else if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
        else if (viewMode === 'day') setCurrentDate(addDays(currentDate, 1));
    };

    const getHeaderLabel = () => {
        if (viewMode === 'year') return format(currentDate, 'yyyy년');
        if (viewMode === 'month') return format(currentDate, 'yyyy년 M월');
        if (viewMode === 'week') {
            const start = startOfWeek(currentDate, { weekStartsOn: 0 });
            const end = endOfWeek(currentDate, { weekStartsOn: 0 });
            return `${format(start, 'M월 d일')} - ${format(end, 'M월 d일')}`;
        }
        return format(currentDate, 'yyyy년 M월 d일 (EEEE)', { locale: ko });
    };

    const renderYearView = () => {
        const months = eachMonthOfInterval({
            start: startOfYear(currentDate),
            end: endOfYear(currentDate),
        });

        return (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full">
                {months.map((month) => (
                    <button
                        key={month.toString()}
                        onClick={() => {
                            setCurrentDate(month);
                            onSelectDate(month);
                        }}
                        className={`p-4 rounded-xl border transition-all ${isSameMonth(selectedDate, month)
                            ? 'bg-brand-500 text-white border-brand-600 shadow-md'
                            : 'bg-white hover:bg-brand-50 border-slate-200 text-slate-700'
                            }`}
                    >
                        {format(month, 'M월')}
                    </button>
                ))}
            </div>
        );
    };

    const renderMonthView = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = 'd';
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

        // Week header
        const daysHeader = weekDays.map((d, i) => (
            <div key={i} className="text-center font-semibold text-slate-500 py-2">
                {d}
            </div>
        ));

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;
                days.push(
                    <div
                        className={`p-2 w-full flex justify-center`}
                        key={day.toString()}
                    >
                        <button
                            onClick={() => onSelectDate(cloneDay)}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-105 ${!isSameMonth(day, monthStart)
                                ? 'text-slate-300'
                                : isSameDay(day, selectedDate)
                                    ? 'bg-brand-500 text-white shadow-md font-bold'
                                    : 'text-slate-700 hover:bg-brand-100'
                                }`}
                        >
                            <span className={isSameDay(day, new Date()) && !isSameDay(day, selectedDate) ? 'text-brand-600 font-bold' : ''}>
                                {formattedDate}
                            </span>
                        </button>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 w-full gap-1 mb-1" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }

        return (
            <div className="w-full">
                <div className="grid grid-cols-7 w-full gap-1 mb-2 bg-slate-50/50 rounded-lg">
                    {daysHeader}
                </div>
                <div>{rows}</div>
            </div>
        );
    };

    const renderWeekView = () => {
        const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
        const endDate = endOfWeek(currentDate, { weekStartsOn: 0 });
        const days = eachDayOfInterval({ start: startDate, end: endDate });
        const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

        return (
            <div className="grid grid-cols-7 gap-2 w-full">
                {days.map((day, i) => (
                    <div key={day.toString()} className="flex flex-col items-center">
                        <span className="text-sm font-medium text-slate-500 mb-2">{weekDays[i]}</span>
                        <button
                            onClick={() => onSelectDate(day)}
                            className={`w-12 h-16 flex items-center justify-center rounded-2xl transition-all hover:scale-105 border ${isSameDay(day, selectedDate)
                                ? 'bg-brand-500 text-white border-brand-600 shadow-md'
                                : 'bg-white text-slate-700 hover:bg-brand-50 hover:border-brand-200 border-slate-200'
                                }`}
                        >
                            <span className={`text-lg ${isSameDay(day, selectedDate) ? 'font-bold' : ''}`}>
                                {format(day, 'd')}
                            </span>
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const renderDayView = () => {
        return (
            <div className="flex flex-col items-center justify-center py-8 w-full">
                <div className="w-32 h-32 rounded-3xl bg-brand-50 flex items-center justify-center shadow-inner border border-brand-100 mb-6">
                    <span className="text-5xl font-black text-brand-600 tracking-tighter">
                        {format(currentDate, 'd')}
                    </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-700">
                    {format(currentDate, 'yyyy년 M월')}
                </h3>
                <p className="text-slate-500 font-medium mt-1">
                    {format(currentDate, 'EEEE', { locale: ko })}
                </p>
            </div>
        );
    };

    return (
        <div className="w-full animate-in flex flex-col items-center">
            <div className="flex w-full items-center justify-between mb-8 px-4">
                <button
                    onClick={handlePrev}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                    {getHeaderLabel()}
                </h2>
                <button
                    onClick={handleNext}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="w-full max-w-2xl px-2">
                {viewMode === 'year' && renderYearView()}
                {viewMode === 'month' && renderMonthView()}
                {viewMode === 'week' && renderWeekView()}
                {viewMode === 'day' && renderDayView()}
            </div>
        </div>
    );
};
