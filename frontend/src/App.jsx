import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TreeEditor from './pages/TreeEditor';
import Settings from './pages/Settings';
import Trees from './pages/Trees';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/authStore';

export default function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(14,14,24,0.95)',
            border: '1px solid rgba(59,130,246,0.2)',
            color: '#e8e8f0',
            borderRadius: 12,
            fontSize: 14,
          },
          success: { iconTheme: { primary: '#3b82f6', secondary: '#0a0a12' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#0a0a12' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/trees" element={<ProtectedRoute><Trees /></ProtectedRoute>} />
        <Route path="/trees/:id" element={<ProtectedRoute><TreeEditor /></ProtectedRoute>} />
        <Route path="/shared/:token" element={<TreeEditor />} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
