import React, { useState } from 'react';
import { useStore } from '../store';
import { LogIn, UserPlus, X, Search, Building2, Phone, MapPin } from 'lucide-react';
import DaumPostcode from 'react-daum-postcode';

interface AuthModalProps {
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [orgName, setOrgName] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [address, setAddress] = useState('');
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    const { login, register } = useStore();

    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') extraAddress += data.bname;
            if (data.buildingName !== '') extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        setZipCode(data.zonecode);
        setAddress(fullAddress);
        setIsPostcodeOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoginMode) {
            if (!email.trim() || !password.trim()) {
                alert('이메일과 비밀번호를 입력해주세요.');
                return;
            }
            login(email, password);
        } else {
            if (!email.trim() || !password.trim() || !name.trim() || !phone.trim() || !orgName.trim() || !zipCode.trim() || !address.trim()) {
                alert('모든 가입 정보를 입력해주세요.');
                return;
            }
            register(email, password, name, phone, orgName, zipCode, address);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white/95 backdrop-blur-md w-full max-w-md rounded-2xl shadow-2xl border border-white/40 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-slate-200/50 bg-white/50 shrink-0 rounded-t-2xl">
                    <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                        {isLoginMode ? <><LogIn size={20} className="text-brand-600" /> 로그인</> : <><UserPlus size={20} className="text-brand-600" /> 회원가입 (예약 대기)</>}
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200/50 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">이메일 계정 (로그인 ID)</label>
                            <input
                                type="email"
                                required
                                placeholder="예: user@example.com"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white/70"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">비밀번호</label>
                            <input
                                type="password"
                                required
                                placeholder="비밀번호를 입력하세요"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white/70"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        {!isLoginMode && (
                            <div className="space-y-4 pt-4 border-t border-slate-200/60 mt-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">필수 상세 정보</h3>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><Building2 size={14} /> 소속기관명</label>
                                    <input
                                        type="text"
                                        placeholder="기관명을 정확히 입력해주세요"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white/70"
                                        value={orgName}
                                        onChange={e => setOrgName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><MapPin size={14} /> 주소</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            placeholder="우편번호"
                                            readOnly
                                            className="w-1/3 px-4 py-2 border border-slate-200 outline-none rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                                            value={zipCode}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsPostcodeOpen(true)}
                                            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Search size={16} /> 우편번호 찾기
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="기본 주소가 이곳에 자동 입력됩니다"
                                        readOnly
                                        className="w-full px-4 py-2 border border-slate-200 outline-none rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                                        value={address}
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><UserPlus size={14} /> 담당자명</label>
                                    <input
                                        type="text"
                                        placeholder="예: 홍길동"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white/70"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><Phone size={14} /> 연락처</label>
                                    <input
                                        type="tel"
                                        placeholder="예: 010-0000-0000"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white/70"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 mt-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-colors"
                        >
                            {isLoginMode ? '로그인' : '가입하기 및 승인 대기'}
                        </button>
                    </form>

                    <div className="pt-4 mt-6 border-t border-slate-200/60 text-center">
                        <button
                            type="button"
                            onClick={() => setIsLoginMode(!isLoginMode)}
                            className="text-sm text-slate-500 hover:text-brand-600 hover:underline font-bold transition-colors"
                        >
                            {isLoginMode ? '권한이 필요한가요? 새로 가입하기' : '이미 승인된 계정이 있나요? 로그인'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Daum Postcode Nested Modal */}
            {isPostcodeOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] border border-slate-200">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 shrink-0">
                            <h3 className="font-bold text-slate-800">우편번호 찾기</h3>
                            <button onClick={() => setIsPostcodeOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden relative bg-white">
                            <DaumPostcode
                                onComplete={handleComplete}
                                style={{ width: '100%', height: '100%' }}
                                autoClose={false}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
