import React from 'react';
import { useStore } from '../store';
import type { UserStatus } from '../store';
import { Users, CheckCircle, Clock } from 'lucide-react';

export const AdminPanel: React.FC = () => {
    const { users, currentUser, approveUser } = useStore();

    if (currentUser?.status !== 'host') {
        return null;
    }

    const pendingUsers = users.filter(user => user.status === 'pending');
    const otherUsers = users.filter(user => user.status !== 'pending' && user.status !== 'host');

    const getStatusBadge = (status: UserStatus) => {
        switch (status) {
            case 'pending': return <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1"><Clock size={12} />대기 중</span>;
            case 'approved': return <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1"><CheckCircle size={12} />승인됨</span>;
            default: return null;
        }
    };

    return (
        <div className="mt-8 p-6 glass-card border border-brand-200/50">
            <div className="flex items-center gap-2 mb-6 text-brand-700">
                <Users size={24} />
                <h2 className="text-xl font-bold">호스트 전용 패널: 가입 대기자 관리</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">승인 대기 중인 사용자 ({pendingUsers.length})</h3>
                    {pendingUsers.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">현재 승인 대기 중인 이용자가 없습니다.</p>
                    ) : (
                        <ul className="space-y-3">
                            {pendingUsers.map(user => (
                                <li key={user.uid} className="flex flex-col gap-3 p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                                {user.orgName}
                                                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{user.name} 담당자</span>
                                            </span>
                                        </div>
                                        {getStatusBadge(user.status)}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-400 mb-0.5">이메일 계정</span>
                                            <span>{user.email}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-400 mb-0.5">연락처</span>
                                            <span>{user.phone || '미입력'}</span>
                                        </div>
                                        <div className="flex flex-col sm:col-span-2">
                                            <span className="text-xs font-bold text-slate-400 mb-0.5">주소</span>
                                            <span className="truncate" title={user.address ? `[${user.zipCode}] ${user.address}` : '미입력'}>
                                                {user.address ? `[${user.zipCode}] ${user.address}` : '미입력'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-1">
                                        <button
                                            onClick={() => approveUser(user.uid)}
                                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                                        >
                                            <CheckCircle size={16} /> 승인 처리하기
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">일반 이용자 목록</h3>
                    <ul className="space-y-2">
                        {otherUsers.map(user => (
                            <li key={user.uid} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl">
                                <div>
                                    <span className="font-semibold text-slate-700">{user.name}</span>
                                    <span className="text-sm text-slate-400 ml-2">({user.email})</span>
                                </div>
                                {getStatusBadge(user.status)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
