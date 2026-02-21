import { format } from 'date-fns';
import { Clock, Lock } from 'lucide-react';
import { useStore } from '../store';

interface TimeSlotPickerProps {
    selectedDate: Date;
    selectedTime: string | null;
    selectedFacility: string;
    onSelectTime: (time: string) => void;
    onReserve: () => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
    selectedDate,
    selectedTime,
    selectedFacility,
    onSelectTime,
    onReserve
}) => {
    const { currentUser, reservations } = useStore();
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    // 현재 선택된 날짜 및 시설의 예약들
    const facilityReservations = reservations.filter(r => r.date === dateStr && r.facility === selectedFacility);

    // 1시간 단위 (09:00 ~ 18:00)
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    const canReserve = currentUser?.status === 'approved' || currentUser?.status === 'host';

    return (
        <div className="w-full mt-10 p-6 md:p-8 rounded-2xl bg-white border border-slate-200/60 shadow-sm animate-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                    <Clock size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">예약 시간 선택</h3>
                    <p className="text-sm text-brand-600 font-bold mb-1">{selectedFacility}</p>
                    <p className="text-sm text-slate-500 font-medium tracking-tight">
                        {format(selectedDate, 'yyyy. MM. dd')} • 1시간 단위
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {timeSlots.map((time) => {
                    const isReserved = facilityReservations.some(r => r.time === time);

                    return (
                        <button
                            key={time}
                            disabled={isReserved}
                            onClick={() => onSelectTime(time)}
                            className={`py-3 px-4 rounded-xl text-center font-semibold transition-all border ${isReserved
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60' // 이미 예약됨
                                : selectedTime === time
                                    ? 'bg-brand-500 text-white border-brand-600 shadow-lg shadow-brand-500/30 scale-105'
                                    : 'bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border-slate-200/80 hover:-translate-y-0.5'
                                }`}
                        >
                            {time}
                            {isReserved && <span className="block text-[10px] mt-0.5 font-bold text-slate-500">예약 마감</span>}
                        </button>
                    );
                })}
            </div>

            {selectedTime && (
                <div className="mt-8 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div>
                        <span className="block text-sm font-semibold opacity-80 mb-0.5">선택된 예약</span>
                        <span className="font-bold text-lg tracking-tight">
                            {format(selectedDate, 'M월 d일')} {selectedTime} <span className="text-emerald-600 ml-1">({selectedFacility})</span>
                        </span>
                    </div>
                    {canReserve ? (
                        <button
                            onClick={onReserve}
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-sm transition-colors"
                        >
                            예약 신청하기
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-600 font-bold rounded-lg text-sm">
                            <Lock size={16} /> 호스트 승인 필요
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
