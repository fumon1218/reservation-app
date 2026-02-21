import { useState } from 'react';
import { useStore } from '../store';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, ActivitySquare } from 'lucide-react';

export const StatusPage = () => {
    const { reservations } = useStore();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // 1시간 단위 (09:00 ~ 18:00)
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    const facilities = ['안전체험관', '대회의실', '소회의실'];

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    // 이 날짜의 예약 필터링
    const todaysReservations = reservations.filter(r => r.date === dateStr);

    const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1));
    const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
    const handleToday = () => setSelectedDate(new Date());

    return (
        <div className="glass-card p-6 md:p-10 animate-in">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-100 text-brand-600 rounded-xl">
                        <ActivitySquare size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">예약 현황</h1>
                        <p className="text-sm text-slate-500 mt-1">시설별 실시간 예약 스케줄을 확인하세요.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50/80 p-1.5 rounded-full border border-slate-200 shadow-sm">
                    <button onClick={handlePrevDay} className="p-2 rounded-full hover:bg-white hover:text-brand-600 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex flex-col items-center px-4 w-32 cursor-pointer" onClick={handleToday}>
                        <span className="text-sm font-bold text-slate-700">{format(selectedDate, 'yyyy. MM. dd')}</span>
                    </div>
                    <button onClick={handleNextDay} className="p-2 rounded-full hover:bg-white hover:text-brand-600 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar border border-slate-200/60 rounded-2xl bg-white shadow-sm">
                <table className="w-full min-w-[700px] text-sm text-left align-middle border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs">
                            <th className="py-4 px-6 font-semibold w-24 text-center border-r border-slate-200 bg-slate-100">시간 \ 시설</th>
                            {facilities.map(fac => (
                                <th key={fac} className="py-4 px-6 text-center">{fac}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {timeSlots.map(time => (
                            <tr key={time} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="py-3 px-6 font-mono text-slate-500 font-medium text-center border-r border-slate-100 bg-slate-50/50 group-hover:bg-brand-50/30 transition-colors">
                                    {time}
                                </td>
                                {facilities.map(fac => {
                                    const res = todaysReservations.find(r => r.facility === fac && r.time === time);

                                    return (
                                        <td key={fac} className="p-2">
                                            {res ? (
                                                <div className="h-full w-full py-2.5 px-3 bg-slate-100 border border-slate-200 rounded-xl text-center text-slate-400 font-semibold opacity-70 cursor-not-allowed">
                                                    예약 완료 ({res.userName})
                                                </div>
                                            ) : (
                                                <div className="h-full w-full py-2.5 px-3 bg-brand-50 border border-brand-100/50 rounded-xl text-center text-brand-600 font-semibold shadow-sm shadow-brand-500/5">
                                                    예약 가능
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-end gap-6 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-100 border border-brand-200"></div>
                    <span>예약 가능</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></div>
                    <span>예약 완료</span>
                </div>
            </div>
        </div>
    );
};
