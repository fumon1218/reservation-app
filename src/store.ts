import { create } from 'zustand';

// 사용자 상태 등급
export type UserStatus = 'visitor' | 'pending' | 'approved' | 'host';

export interface User {
    uid: string;
    email: string;
    name: string;      // 담당자 이름으로 활용
    phone?: string;    // 전화번호
    orgName?: string;  // 소속기관명
    zipCode?: string;  // 우편번호
    address?: string;  // 기본 주소
    status: UserStatus;
}

export interface Reservation {
    id: string;
    userId: string;
    userName: string;
    date: string; // ISO 8601 string or yyyy-MM-dd
    time: string;
    status: 'confirmed' | 'cancelled';
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    date: string;
    author: string;
}

interface AuthState {
    currentUser: User | null;
    users: User[]; // Mock database of users
    reservations: Reservation[]; // Mock database of reservations
    notices: Notice[]; // Mock database of notices

    // Actions
    login: (email: string) => void;
    logout: () => void;
    register: (email: string, name: string, phone: string, orgName: string, zipCode: string, address: string) => void;
    approveUser: (uid: string) => void;
    addReservation: (userId: string, userName: string, date: string, time: string) => void;
    addNotice: (title: string, content: string, author: string) => void;
    deleteNotice: (id: string) => void;
}

export const useStore = create<AuthState>((set) => ({
    currentUser: null,

    // 초기 더미 데이터 세팅 (테스트용 호스트 계정 포함)
    users: [
        { uid: 'host-123', email: 'host@admin.com', name: '관리자', phone: '010-0000-0000', orgName: '운영원', zipCode: '00000', address: '내부', status: 'host' },
        { uid: 'user-456', email: 'test@user.com', name: '테스터(승인됨)', phone: '010-1111-2222', orgName: 'OO학교', zipCode: '12345', address: '테스트시 테스트동', status: 'approved' },
        { uid: 'user-789', email: 'wait@user.com', name: '대기자', phone: '010-3333-4444', orgName: 'XX교육관', zipCode: '54321', address: '대기시 대기동', status: 'pending' },
    ],
    reservations: [],
    notices: [
        {
            id: 'notice-1',
            title: '강원특수교육원 강릉분원 예약 앱 오픈 안내',
            content: '환영합니다! 강릉분원 시설 예약을 위한 전용 애플리케이션이 정식 오픈되었습니다.\n이용 전 반드시 회원가입 후 호스트의 승인을 받아주시기 바랍니다.',
            date: new Date().toISOString().split('T')[0],
            author: '관리자'
        },
        {
            id: 'notice-2',
            title: '시설 이용 수칙 및 주의사항',
            content: '1. 기관 기자재 파손 시 전액 배상 책임이 있습니다.\n2. 사용 후에는 다음 신청자를 위해 반드시 뒷정리를 해주세요.\n3. 예약 취소는 최소 2일 전까지 앱을 통해 진행해 주시기 바랍니다.',
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            author: '관리자'
        }
    ],

    login: (email) => set((state) => {
        const user = state.users.find(u => u.email === email);
        if (user) {
            return { currentUser: user };
        }
        alert('존재하지 않는 이메일입니다.');
        return state;
    }),

    logout: () => set({ currentUser: null }),

    register: (email, name, phone, orgName, zipCode, address) => set((state) => {
        if (state.users.some(u => u.email === email)) {
            alert('이미 존재하는 이메일입니다.');
            return state;
        }
        const newUser: User = {
            uid: Math.random().toString(36).substr(2, 9),
            email,
            name,
            phone,
            orgName,
            zipCode,
            address,
            status: 'pending' // 신규 가입자는 항상 대기 상태
        };
        alert('가입이 완료되었습니다. 호스트의 승인을 기다려주세요.');
        return {
            users: [...state.users, newUser],
            currentUser: newUser
        };
    }),

    approveUser: (uid) => set((state) => ({
        users: state.users.map(u =>
            u.uid === uid ? { ...u, status: 'approved' as UserStatus } : u
        ),
        // 현재 사용자가 변경된 사용자라면 세션 업데이트
        currentUser: state.currentUser?.uid === uid
            ? { ...state.currentUser, status: 'approved' as UserStatus }
            : state.currentUser
    })),

    addReservation: (userId, userName, date, time) => set((state) => {
        const isConflict = state.reservations.some(r => r.date === date && r.time === time);
        if (isConflict) {
            alert('이미 예약된 시간입니다.');
            return state;
        }

        const newRes: Reservation = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            userName,
            date,
            time,
            status: 'confirmed'
        };

        alert('예약이 성공적으로 완료되었습니다!');
        return { reservations: [...state.reservations, newRes] };
    }),

    addNotice: (title, content, author) => set((state) => {
        const newNotice: Notice = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            content,
            date: new Date().toISOString().split('T')[0],
            author
        };
        return { notices: [newNotice, ...state.notices] };
    }),

    deleteNotice: (id) => set((state) => ({
        notices: state.notices.filter(n => n.id !== id)
    }))
}));
