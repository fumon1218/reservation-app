import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { ReservationPage } from './components/ReservationPage';
import { AdminPanel } from './components/AdminPanel';
import { NoticePage } from './components/NoticePage';
import { StatusPage } from './components/StatusPage';
import { useStore } from './store';

// 보호된 라우트용 컴포넌트
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useStore();

  if (currentUser?.status !== 'host') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ReservationPage />} />
          <Route path="status" element={<StatusPage />} />
          <Route path="notice" element={<NoticePage />} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <AdminPanel />
                </div>
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
