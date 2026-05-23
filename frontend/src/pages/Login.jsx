import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TreePine, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';
import BackgroundBlobs from '../components/BackgroundBlobs';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(res.message);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(59,130,246,0.2)',
    color: '#e8e8f0',
    borderRadius: 12,
    padding: '12px 16px',
    fontSize: 14,
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <BackgroundBlobs />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <TreePine size={20} color="#fff" />
            </div>
              <span style={{ fontFamily: 'Cinzel', fontSize: 24, color: '#3b82f6' }}>Tree-Map</span>
          </Link>
          <p className="mt-3 text-sm" style={{ color: '#8888aa' }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'rgba(14,14,24,0.95)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: '#8888aa' }}>Email</label>
              <input
                type="email"
                style={inputStyle}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-xs mb-1.5 block" style={{ color: '#8888aa' }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  style={{ ...inputStyle, paddingRight: 44 }}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#8888aa' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-medium text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#8888aa' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#3b82f6' }}>Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
