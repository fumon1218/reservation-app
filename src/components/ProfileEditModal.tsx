import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { User as UserIcon, X, Search, Building2, Phone, MapPin, Lock } from 'lucide-react';
import DaumPostcode from 'react-daum-postcode';

interface ProfileEditModalProps {
    onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ onClose }) => {
    const { currentUser, updateUserProfile } = useStore();

    // 컴포넌트 마운트 시 초기값 세팅
    const [name, setName] = useState(currentUser?.name || '');
    const [password, setPassword] = useState(currentUser?.password || '');
    const [phone, setPhone] = useState(currentUser?.phone || '');
    const [orgName, setOrgName] = useState(currentUser?.orgName || '');
    const [zipCode, setZipCode] = useState(currentUser?.zipCode || '');
    const [address, setAddress] = useState(currentUser?.address || '');
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    // 로그아웃 등으로 currentUser가 없어지면 자동 닫기
    useEffect(() => {
        if (!currentUser) {
            onClose();
        }
    }, [currentUser, onClose]);

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

        if (!currentUser) return;

        if (!name.trim() || !phone.trim() || !orgName.trim() || !zipCode.trim() || !address.trim() || !password.trim()) {
            alert('비밀번호를 포함한 모든 정보를 정확히 입력해주세요.');
            return;
        }

        updateUserProfile(currentUser.uid, {
            name,
            password,
            phone,
            orgName,
            zipCode,
            address
        });

        alert('회원 정보가 성공적으로 수정되었습니다.');
        onClose();
    };

    if (!currentUser) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white/95 backdrop-blur-md w-full max-w-md rounded-2xl shadow-2xl border border-white/40 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-slate-200/50 bg-white/50 shrink-0 rounded-t-2xl">
                    <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                        <UserIcon size={20} className="text-brand-600" /> 내 정보 수정
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
                                disabled
                                className="w-full px-4 py-2 border border-slate-200 outline-none rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                                value={currentUser.email}
                            />
                            <p className="text-[10px] text-slate-400">아이디(이메일)는 변경할 수 없습니다.</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><Lock size={14} /> 비밀번호 (필수)</label>
                            <input
                                type="password"
                                required
                                placeholder="새 비밀번호 입력 (또는 기존 유지)"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white/70 font-mono"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-200/60 mt-2">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><Building2 size={14} /> 소속기관명</label>
                                <input
                                    type="text"
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
                                        <Search size={16} /> 주소 검색
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    className="w-full px-4 py-2 border border-slate-200 outline-none rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                                    value={address}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><UserIcon size={14} /> 담당자명</label>
                                <input
                                    type="text"
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
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white/70"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 mt-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-colors"
                        >
                            변경 내용 저장
                        </button>
                    </form>
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
