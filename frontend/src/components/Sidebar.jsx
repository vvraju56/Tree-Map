import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TreePine, LayoutDashboard, Settings, LogOut, GitFork, Menu, X } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trees', icon: TreePine, label: 'My Trees' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
    setIsOpen(false);
  };

  const handleNavClick = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-menu-btn fixed top-4 left-4 z-50 p-2 rounded-xl"
        style={{ background: 'rgba(10,10,18,0.9)', border: '1px solid rgba(59,130,246,0.2)' }}
      >
        {isOpen ? <X size={24} color="#3b82f6" /> : <Menu size={24} color="#3b82f6" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: isOpen ? 0 : -80, opacity: isOpen ? 1 : 0 }}
        className="fixed left-0 top-0 h-full w-64 z-20 flex flex-col lg:relative lg:translate-x-0 lg:opacity-100"
        style={{
          background: 'rgba(10,10,18,0.95)',
          borderRight: '1px solid rgba(59,130,246,0.12)',
          backdropFilter: 'blur(20px)',
        }}
      >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'rgba(59,130,246,0.12)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <TreePine size={18} color="#fff" />
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: '#3b82f6' }}>Tree-Map</span>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 mx-4 mt-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', color: '#fff' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: '#e8e8f0' }}>{user?.name}</p>
            <p className="text-xs" style={{ color: '#8888aa' }}>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 mt-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={handleNavClick}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all"
                style={{
                  background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                  color: isActive ? '#3b82f6' : '#8888aa',
                }}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="p-4 space-y-2 border-t" style={{ borderColor: 'rgba(59,130,246,0.12)' }}>
        <a href="https://github.com/vvraju56" target="_blank" rel="noreferrer"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-colors"
          style={{ color: '#8888aa' }}>
          <GitFork size={16} />
          <span>GitHub</span>
        </a>
        <motion.button
          whileHover={{ x: 4 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-colors"
          style={{ color: '#8888aa' }}
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </motion.button>
      </div>
    </motion.aside>
    </>
  );
}
