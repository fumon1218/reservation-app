import { useState } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarViews } from './CalendarViews';
import { TimeSlotPicker } from './TimeSlotPicker';
import { useStore } from '../store';
import { useOutletContext } from 'react-router-dom';

export const ReservationPage = () => {
    const [viewMode, setViewMode] = useState<'year' | 'month' | 'week' | 'day'>('month');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedFacility, setSelectedFacility] = useState<string>('안전체험관');

    const { currentUser, addReservation } = useStore();
    const { requireLogin } = useOutletContext<{ requireLogin: () => void }>();

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null);
    };

    const handleReserve = () => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            requireLogin();
            return;
        }
        if (currentUser.status !== 'approved' && currentUser.status !== 'host') {
            alert('예약 권한이 없습니다. 호스트의 승인을 기다려주세요.');
            return;
        }
        if (!selectedTime) return;

        addReservation(
            currentUser.uid,
            currentUser.name,
            selectedFacility,
            format(selectedDate, 'yyyy-MM-dd'),
            selectedTime
        );
        setSelectedTime(null);
    };

    const handleFacilitySelect = (facility: string) => {
        setSelectedFacility(facility);
        setSelectedTime(null);
    };

    return (
        <>
            {/* Header Section with Image Background */}
            <header className="relative overflow-hidden rounded-3xl shadow-sm text-center flex flex-col items-center gap-4 animate-in p-8 md:p-14 min-h-[280px] justify-center text-white border border-slate-200/50">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/reservation-app/images/hero-bg.png"
                        alt="강원특수교육원 강릉분원 조감도"
                        className="w-full h-full object-cover"
                    />
                    {/* Dark Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/20" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white mb-4 shadow-lg border border-white/20">
                        <CalendarDays size={40} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-md lg:leading-tight">
                        강원특수교육원 강릉분원 예약 앱
                    </h1>
                    <p className="flex items-center gap-2 mt-4 text-slate-200 text-sm md:text-base font-medium drop-shadow glass-card !border-white/10 !bg-black/30 px-5 py-2">
                        <MapPin size={16} />
                        원하시는 날짜와 시간을 선택하여 시설을 예약해 보세요.
                    </p>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="glass-card p-6 md:p-8 min-h-[500px] flex flex-col animate-in delay-75">

                {/* Facility & View Mode Tabs Container */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between w-full max-w-4xl mx-auto">

                    {/* Facility Tabs */}
                    <div className="flex bg-brand-50/50 p-1 rounded-xl w-full md:w-auto border border-brand-100/50">
                        {['안전체험관', '대회의실', '소회의실'].map((facility) => (
                            <button
                                key={facility}
                                onClick={() => handleFacilitySelect(facility)}
                                className={`flex-1 md:flex-none py-2.5 px-3 md:px-5 rounded-lg text-sm font-bold transition-all ${selectedFacility === facility
                                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 ring-1 ring-brand-700/10'
                                    : 'text-brand-700/70 hover:text-brand-800 hover:bg-brand-100/50'
                                    }`}
                            >
                                {facility}
                            </button>
                        ))}
                    </div>

                    {/* View Mode Tabs */}
                    <div className="flex bg-slate-100/50 p-1 rounded-xl w-full md:w-auto border border-slate-200/50">
                        {(['year', 'month', 'week', 'day'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`flex-1 md:flex-none py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${viewMode === mode
                                    ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-900/5 focus:outline-none focus:ring-2 focus:ring-brand-500/50'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 focus:outline-none'
                                    }`}
                            >
                                {mode === 'year' && '연간'}
                                {mode === 'month' && '월간'}
                                {mode === 'week' && '주간'}
                                {mode === 'day' && '일간'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calendar Area */}
                <div className="flex-1 flex flex-col items-center border border-slate-100 rounded-3xl bg-slate-50/30 p-4 md:p-6 shadow-sm">
                    <CalendarViews
                        viewMode={viewMode}
                        selectedDate={selectedDate}
                        onSelectDate={handleDateSelect}
                    />

                    {viewMode !== 'year' && (
                        <TimeSlotPicker
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            selectedFacility={selectedFacility}
                            onSelectTime={setSelectedTime}
                            onReserve={handleReserve}
                        />
                    )}
                </div>
            </main>
        </>
    );
};
