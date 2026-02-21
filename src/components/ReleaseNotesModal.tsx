import React from 'react';
import { Sparkles, X, CheckCircle2 } from 'lucide-react';

interface ReleaseNotesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ isOpen, onClose }) => {
    const currentVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white/90 backdrop-blur-md w-full max-w-md rounded-2xl shadow-2xl border border-white/40 overflow-hidden flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200/50 bg-gradient-to-r from-brand-50 to-white">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-brand-500 rounded-lg text-white">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-800 leading-tight">새로운 업데이트 안내</h2>
                            <p className="text-xs font-bold text-brand-600">버전 {currentVersion}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-6 text-sm">

                        <section>
                            <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
                                👤 v1.4.0 (내 정보 수정 기능)
                            </h3>
                            <ul className="space-y-2.5 text-slate-600">
                                <li className="flex gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>우측 상단의 본인 <strong>계정 이름(아이콘)</strong>을 클릭하면 내 정보를 편리하게 수정할 수 있습니다.</span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>로그인 시 사용한 비밀번호는 물론이고, 소속기관명 및 연락처 등 가입 당시의 정보를 자유롭게 갱신할 수 있습니다.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
                                🔒 v1.3.1 (비밀번호 보안 추가)
                            </h3>
                            <ul className="space-y-2.5 text-slate-600">
                                <li className="flex gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>회원가입 및 로그인에 <strong>비밀번호(Password)</strong> 체계가 전면 도입되어 보안이 강화되었습니다.</span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>관리자 계정(`host@admin.com`)은 이제 커스텀 설정된 비밀번호를 통해 보호됩니다.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
                                🎉 v1.2.0 (회원가입 폼 고도화)
                            </h3>
                            <ul className="space-y-2.5 text-slate-600">
                                <li className="flex gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>회원가입 시 <strong>우편번호 검색(Daum)</strong>을 통해 정확한 소속기관 주소를 입력할 수 있게 되었습니다.</span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>가입 양식에 담당자 이름, 연락처, 소속기관명 필수 입력 항목이 추가되었습니다.</span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>관리자 패널에서 가입 대기자의 <strong>상세 정보(조직, 연락처 등)</strong>를 한눈에 확인할 수 있도록 UI가 개선되었습니다.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
                                🌟 v1.1.0 (디자인 업데이트)
                            </h3>
                            <ul className="space-y-2.5 text-slate-600">
                                <li className="flex gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>메인 예약 페이지 상단에 <strong>강원특수교육원 강릉분원의 조감도 이미지</strong>가 와이드 배경으로 적용되었습니다.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
                                🚀 v1.0.0 (Phase 2)
                            </h3>
                            <ul className="space-y-2.5 text-slate-600">
                                <li className="flex gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span><strong>호스트 전용 관리자 탭</strong>이 완전히 분리되었습니다. (우측 상단 탭 확인)</span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span><strong>가상(Mock) 로그인 및 권한 검사</strong> 로직이 적용되어 호스트의 승인을 거쳐야 예약이 가능합니다.</span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>우측 하단에 예약 앱의 <strong>버전 표시 기능</strong>이 추가되었습니다. (클릭 시 이 창 표시)</span>
                                </li>
                            </ul>
                        </section>

                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md transition-colors"
                    >
                        확인했습니다
                    </button>
                </div>

            </div>
        </div>
    );
};
