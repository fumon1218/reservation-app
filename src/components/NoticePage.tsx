import React, { useState } from 'react';
import { useStore } from '../store';
import { Megaphone, MessageSquarePlus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export const NoticePage: React.FC = () => {
    const { notices, currentUser, addNotice, deleteNotice } = useStore();
    const isHost = currentUser?.status === 'host';

    const [isWriting, setIsWriting] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleToggleExpand = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }
        addNotice(newTitle, newContent, currentUser?.name || '관리자');
        setNewTitle('');
        setNewContent('');
        setIsWriting(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <header className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-brand-500">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
                        <Megaphone size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800">공지사항</h1>
                        <p className="text-sm text-slate-500 mt-1">강원특수교육원 강릉분원의 최신 소식을 확인하세요.</p>
                    </div>
                </div>

                {isHost && (
                    <button
                        onClick={() => setIsWriting(!isWriting)}
                        className={`flex items-center gap-2 px-4 py-2 font-bold rounded-xl transition-all ${isWriting ? 'bg-slate-200 text-slate-600' : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md'}`}
                    >
                        {isWriting ? '작성 취소' : <><MessageSquarePlus size={18} /> 새 공지 작성</>}
                    </button>
                )}
            </header>

            {/* Admin Write Form */}
            {isHost && isWriting && (
                <div className="glass-card p-6 border-2 border-brand-100 animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">제목</label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                className="w-full px-4 py-2 bg-white/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                placeholder="공지사항 제목을 입력하세요"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">내용</label>
                            <textarea
                                value={newContent}
                                onChange={e => setNewContent(e.target.value)}
                                className="w-full px-4 py-2 bg-white/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 h-32 resize-none"
                                placeholder="공지할 상세 내용을 입력하세요 (줄바꿈 지원)"
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg shadow-sm transition-colors">
                                공지 등록하기
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Notice List */}
            <div className="space-y-3">
                {notices.length === 0 ? (
                    <div className="text-center py-12 glass-card">
                        <Megaphone size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">등록된 공지사항이 없습니다.</p>
                    </div>
                ) : (
                    notices.map(notice => (
                        <div key={notice.id} className="glass-card overflow-hidden border border-slate-200/60 transition-all duration-200 hover:border-brand-200">
                            <button
                                onClick={() => handleToggleExpand(notice.id)}
                                className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 focus:outline-none"
                            >
                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                    <h3 className={`text-base md:text-lg font-bold truncate ${expandedId === notice.id ? 'text-brand-700' : 'text-slate-800'}`}>
                                        {notice.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                        <span>{notice.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        <span>{notice.author}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {isHost && (
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('정말 이 공지사항을 삭제하시겠습니까?')) deleteNotice(notice.id);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="삭제"
                                        >
                                            <Trash2 size={18} />
                                        </span>
                                    )}
                                    <div className={`p-1 rounded-full transition-colors ${expandedId === notice.id ? 'bg-brand-50 text-brand-600' : 'text-slate-400 group-hover:bg-slate-50'}`}>
                                        {expandedId === notice.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>
                            </button>

                            {/* Expanded Content */}
                            {expandedId === notice.id && (
                                <div className="p-4 md:p-6 bg-slate-50/50 border-t border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-top-2">
                                    {notice.content}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
