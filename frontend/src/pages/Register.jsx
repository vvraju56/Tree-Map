import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TreePine, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';
import BackgroundBlobs from '../components/BackgroundBlobs';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const res = await register(form.name, form.email, form.password);
    if (res.success) {
      toast.success('Account created! Welcome to Tree-Map 🎉');
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <BackgroundBlobs />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <TreePine size={20} color="#fff" />
            </div>
              <span style={{ fontFamily: 'Cinzel', fontSize: 24, color: '#3b82f6' }}>Tree-Map</span>
          </Link>
          <p className="mt-3 text-sm" style={{ color: '#8888aa' }}>Create your free account</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'rgba(14,14,24,0.95)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: '#8888aa' }}>Full Name</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
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
                  placeholder="Min 6 characters"
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
              className="w-full py-3 rounded-xl font-medium text-sm"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#8888aa' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3b82f6' }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
