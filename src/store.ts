import { create } from 'zustand';

// 사용자 상태 등급
export type UserStatus = 'visitor' | 'pending' | 'approved' | 'host';

export interface User {
    uid: string;
    email: string;
    name: string;
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

interface AuthState {
    currentUser: User | null;
    users: User[]; // Mock database of users
    reservations: Reservation[]; // Mock database of reservations

    // Actions
    login: (email: string) => void;
    logout: () => void;
    register: (email: string, name: string) => void;
    approveUser: (uid: string) => void;
    addReservation: (userId: string, userName: string, date: string, time: string) => void;
}

export const useStore = create<AuthState>((set) => ({
    currentUser: null,

    // 초기 더미 데이터 세팅 (테스트용 호스트 계정 포함)
    users: [
        { uid: 'host-123', email: 'host@admin.com', name: '관리자', status: 'host' },
        { uid: 'user-456', email: 'test@user.com', name: '테스터(승인됨)', status: 'approved' },
        { uid: 'user-789', email: 'wait@user.com', name: '대기자', status: 'pending' },
    ],
    reservations: [],

    login: (email) => set((state) => {
        const user = state.users.find(u => u.email === email);
        if (user) {
            return { currentUser: user };
        }
        alert('존재하지 않는 이메일입니다.');
        return state;
    }),

    logout: () => set({ currentUser: null }),

    register: (email, name) => set((state) => {
        if (state.users.some(u => u.email === email)) {
            alert('이미 존재하는 이메일입니다.');
            return state;
        }
        const newUser: User = {
            uid: Math.random().toString(36).substr(2, 9),
            email,
            name,
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
    })
}));
