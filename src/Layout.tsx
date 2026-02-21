import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, User as UserIcon, Calendar, Settings, Info, Megaphone } from 'lucide-react';
import { useStore } from './store';
import { AuthModal } from './components/AuthModal';
import { ReleaseNotesModal } from './components/ReleaseNotesModal';

export const Layout = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isReleaseNotesOpen, setIsReleaseNotesOpen] = useState(false);
    const { currentUser, logout } = useStore();
    const location = useLocation();

    useEffect(() => {
        // 버전 업데이트 확인 로직
        const lastSeen = localStorage.getItem('lastSeenVersion');
        if (lastSeen !== __APP_VERSION__) {
            setIsReleaseNotesOpen(true);
        }
    }, []);

    const handleCloseReleaseNotes = () => {
        localStorage.setItem('lastSeenVersion', __APP_VERSION__);
        setIsReleaseNotesOpen(false);
    };

    const isHost = currentUser?.status === 'host';
    const isAdminPage = location.pathname === '/admin';

    return (
        <div className="min-h-screen p-4 md:p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-6 relative">

                {/* Top Navbar */}
                <nav className="flex items-center justify-between glass-card p-3 md:px-6 z-10 w-full mb-4">
                    <div className="flex items-center gap-1 md:gap-4">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold ${location.pathname === '/' ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <Calendar size={18} />
                            <span className="hidden sm:inline">예약 캘린더</span>
                        </Link>

                        <Link
                            to="/notice"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold ${location.pathname === '/notice' ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <Megaphone size={18} />
                            <span className="hidden sm:inline">공지사항</span>
                        </Link>

                        {isHost && (
                            <Link
                                to="/admin"
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold ${isAdminPage ? 'bg-amber-50 text-amber-700' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                <Settings size={18} />
                                <span className="hidden sm:inline">호스트 관리</span>
                                <span className="flex sm:hidden">관리자</span>
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        {currentUser ? (
                            <div className="flex items-center gap-3 bg-white/50 border border-slate-200 px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-sm">
                                <span className="flex items-center gap-2 text-slate-700">
                                    <UserIcon size={16} />
                                    <span className="font-bold text-slate-800">{currentUser.name}</span>
                                    <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${currentUser.status === 'host' ? 'bg-amber-100 text-amber-700' :
                                        currentUser.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                                        }`}>
                                        {currentUser.status}
                                    </span>
                                </span>
                                <button
                                    onClick={() => {
                                        logout();
                                        if (isAdminPage) window.location.hash = '#/'; // 관리자일 때 로그아웃하면 홈으로
                                    }}
                                    className="p-1 md:p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                    title="로그아웃"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="glass-button px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-sm font-bold"
                            >
                                로그인 / 예약 신청
                            </button>
                        )}
                    </div>
                </nav>

                {/* Page Content Rendered Here */}
                <div className="space-y-8">
                    <Outlet context={{ requireLogin: () => setIsAuthModalOpen(true) }} />
                </div>

                <footer className="relative flex items-center justify-center text-slate-400 text-sm py-6 mt-8 border-t border-slate-200/40">
                    <div className="text-center">
                        &copy; {new Date().getFullYear()} 강원특수교육원 강릉분원. All rights reserved.
                    </div>
                    <button
                        onClick={() => setIsReleaseNotesOpen(true)}
                        className="absolute right-4 flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand-600 bg-white/50 hover:bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/60 shadow-sm transition-all cursor-pointer group"
                        title="업데이트 내역 보기"
                    >
                        <Info size={14} className="group-hover:text-brand-500 transition-colors" />
                        <span>v{__APP_VERSION__}</span>
                    </button>
                </footer>
            </div>

            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
            <ReleaseNotesModal isOpen={isReleaseNotesOpen} onClose={handleCloseReleaseNotes} />
        </div>
    );
};
