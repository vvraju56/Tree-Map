import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Palette, Shield, Save } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Sidebar from '../components/Sidebar';
import BackButton from '../components/BackButton';
import BackgroundBlobs from '../components/BackgroundBlobs';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function Settings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(59,130,246,0.2)',
    color: '#e8e8f0',
    borderRadius: 12,
    padding: '11px 14px',
    fontSize: 14,
    width: '100%',
    outline: 'none',
  };

  const handleSave = () => {
    toast.success('Settings saved!');
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundBlobs />
      <Sidebar />
      <main className="relative z-10 ml-64 p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <BackButton to="/dashboard" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Cinzel', color: '#e8e8f0' }}>Settings</h1>
          <p style={{ color: '#8888aa' }}>Manage your account settings and preferences.</p>
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar tabs */}
          <div className="w-52 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-left transition-all"
                  style={{
                    background: activeTab === id ? 'rgba(59,130,246,0.1)' : 'transparent',
                    border: activeTab === id ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                    color: activeTab === id ? '#3b82f6' : '#8888aa',
                  }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-xl">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.1)' }}
            >
              {activeTab === 'profile' && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Cinzel', color: '#e8e8f0' }}>Profile</h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', color: '#fff' }}>
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#e8e8f0' }}>{user?.name}</p>
                      <p className="text-xs" style={{ color: '#8888aa' }}>{user?.email}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: '#8888aa' }}>Full Name</label>
                    <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: '#8888aa' }}>Email</label>
                    <input style={inputStyle} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <button onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}>
                    <Save size={15} /> Save Changes
                  </button>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Cinzel', color: '#e8e8f0' }}>Security</h2>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: '#8888aa' }}>Current Password</label>
                    <input style={inputStyle} type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: '#8888aa' }}>New Password</label>
                    <input style={inputStyle} type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: '#8888aa' }}>Confirm New Password</label>
                    <input style={inputStyle} type="password" placeholder="••••••••" />
                  </div>
                  <button onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}>
                    <Shield size={15} /> Update Password
                  </button>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Cinzel', color: '#e8e8f0' }}>Appearance</h2>
          <p className="text-sm" style={{ color: '#8888aa' }}>Choose your preferred theme for Tree-Map.</p>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {[
                      { name: 'Dark Pink', colors: ['#0a0a12', '#3b82f6'] },
                      { name: 'Dark Blue', colors: ['#0a0a12', '#3b82f6'] },
                      { name: 'Dark Violet', colors: ['#0a0a12', '#8b5cf6'] },
                      { name: 'Dark Teal', colors: ['#0a0a12', '#14b8a6'] },
                    ].map((theme, i) => (
                      <button key={theme.name}
                        onClick={() => toast.success(`${theme.name} theme applied!`)}
                        className="p-4 rounded-xl text-left transition-all hover:scale-102"
                        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${i === 0 ? '#3b82f6' : 'rgba(59,130,246,0.1)'}` }}>
                        <div className="flex gap-2 mb-2">
                          {theme.colors.map(c => (
                            <div key={c} className="w-6 h-6 rounded-full" style={{ background: c }} />
                          ))}
                        </div>
                        <p className="text-xs" style={{ color: '#e8e8f0' }}>{theme.name}</p>
                        {i === 0 && <p className="text-xs mt-0.5" style={{ color: '#3b82f6' }}>Active</p>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Cinzel', color: '#e8e8f0' }}>Notifications</h2>
                  {[
                    { label: 'Tree updates', desc: 'Get notified when a shared tree is updated' },
                    { label: 'New connections', desc: 'Alerts when new relationships are added' },
                    { label: 'Weekly digest', desc: 'A weekly summary of your family tree activity' },
                  ].map((item, i) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.08)' }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#e8e8f0' }}>{item.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#8888aa' }}>{item.desc}</p>
                      </div>
                      <button
                        onClick={e => { const b = e.currentTarget; b.dataset.on = b.dataset.on === '1' ? '0' : '1'; b.style.background = b.dataset.on === '1' ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)' : 'rgba(255,255,255,0.1)'; }}
                        className="w-10 h-6 rounded-full transition-all"
                        data-on={i === 0 ? '1' : '0'}
                        style={{ background: i === 0 ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)' : 'rgba(255,255,255,0.1)' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
