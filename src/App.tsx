import { useState } from 'react';
import { CalendarDays, MapPin, LogOut, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarViews } from './components/CalendarViews';
import { TimeSlotPicker } from './components/TimeSlotPicker';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { useStore } from './store';

function App() {
  const [viewMode, setViewMode] = useState<'year' | 'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { currentUser, logout, addReservation } = useStore();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleReserve = () => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      setIsAuthModalOpen(true);
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
      format(selectedDate, 'yyyy-MM-dd'),
      selectedTime
    );
    setSelectedTime(null); // 예약 후 선택 해제
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8 animate-in relative">

        {/* Top Navbar */}
        <div className="absolute top-0 right-0 p-4 font-medium flex items-center gap-4 text-sm z-10">
          {currentUser ? (
            <div className="flex items-center gap-3 glass-card px-4 py-2 border-brand-200">
              <span className="flex items-center gap-2 text-slate-700">
                <UserIcon size={16} />
                <span className="font-bold text-brand-700">{currentUser.name}</span>
                <span className="text-slate-400 capitalize bg-slate-100 px-2 py-0.5 rounded-full text-xs">
                  {currentUser.status}
                </span>
              </span>
              <button
                onClick={logout}
                className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                title="로그아웃"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="glass-button px-5 py-2 rounded-xl text-sm font-bold"
            >
              로그인 / 예약 신청
            </button>
          )}
        </div>

        {/* Header Section */}
        <header className="glass-card p-6 md:p-10 pt-16 md:pt-20 text-center flex flex-col items-center gap-4">
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

        {/* Admin Panel (Host Only) */}
        <AdminPanel />

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

            {viewMode !== 'year' && (
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
                onReserve={handleReserve}
              />
            )}
          </div>
        </main>

        <footer className="text-center text-slate-400 text-sm py-4">
          &copy; {new Date().getFullYear()} 강원특수교육원 강릉분원. All rights reserved.
        </footer>
      </div>

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}

export default App;
