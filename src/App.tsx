import { useState } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import { CalendarViews } from './components/CalendarViews';
import { TimeSlotPicker } from './components/TimeSlotPicker';

function App() {
  const [viewMode, setViewMode] = useState<'year' | 'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null); // 날짜 변경 시 시간 초기화
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8 animate-in">

        {/* Header Section */}
        <header className="glass-card p-6 md:p-10 text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-2xl text-brand-600 mb-2">
            <CalendarDays size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            강원특수교육원 강릉분원 예약 앱
          </h1>
          <p className="text-slate-500 flex items-center gap-2">
            <MapPin size={16} />
            원하시는 날짜와 시간을 선택하여 시설을 예약해 보세요.
          </p>
        </header>

        {/* Main Content Area */}
        <main className="glass-card p-6 md:p-8 min-h-[500px] flex flex-col">

          {/* View Mode Tabs */}
          <div className="flex bg-slate-100/50 p-1 rounded-xl mx-auto mb-8 w-full max-w-md border border-slate-200/50">
            {(['year', 'month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${viewMode === mode
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

          {/* Calendar Area */}
          <div className="flex-1 flex flex-col items-center border border-slate-100 rounded-3xl bg-slate-50/30 p-4 md:p-6 shadow-sm">
            <CalendarViews
              viewMode={viewMode}
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
            />

            {/* Time Slot Area (Only shown if a date doesn't imply broad views like year/month without interaction, but let's show always for demo below the calendar, except maybe for Year view) */}
            {viewMode !== 'year' && (
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
              />
            )}
          </div>
        </main>

        <footer className="text-center text-slate-400 text-sm py-4">
          &copy; {new Date().getFullYear()} 강원특수교육원 강릉분원. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default App;
