import React, { useState } from 'react';
import { useStore } from '../store';
import { LogIn, UserPlus, X } from 'lucide-react';

interface AuthModalProps {
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const { login, register } = useStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoginMode) {
            login(email);
        } else {
            if (!name.trim()) {
                alert('이름을 입력해주세요.');
                return;
            }
            register(email, name);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in">
            <div className="bg-white/80 backdrop-blur-md w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-white/40">
                <div className="flex items-center justify-between p-4 border-b border-slate-200/50 bg-white/50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        {isLoginMode ? <><LogIn size={20} /> 로그인</> : <><UserPlus size={20} /> 회원가입(예약신청)</>}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">이메일</label>
                        <input
                            type="email"
                            required
                            placeholder="예: user@example.com"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white/70"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    {!isLoginMode && (
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700">이름</label>
                            <input
                                type="text"
                                placeholder="예: 홍길동"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white/70"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2.5 mt-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-md transition-colors"
                    >
                        {isLoginMode ? '로그인' : '가입하기'}
                    </button>
                </form>

                <div className="px-6 pb-6 text-center">
                    <button
                        type="button"
                        onClick={() => setIsLoginMode(!isLoginMode)}
                        className="text-sm text-brand-600 hover:underline font-medium"
                    >
                        {isLoginMode ? '계정이 없으신가요? 가입하기' : '이미 계정이 있으신가요? 로그인'}
                    </button>
                </div>
            </div>
        </div>
    );
};
