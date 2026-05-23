import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, TreePine, Trash2, Edit2, Users, Clock, X } from 'lucide-react';
import useTreeStore from '../store/treeStore';
import useAuthStore from '../store/authStore';
import Sidebar from '../components/Sidebar';
import BackButton from '../components/BackButton';
import BackgroundBlobs from '../components/BackgroundBlobs';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { trees, fetchTrees, createTree, deleteTree, loading } = useTreeStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTrees();
  }, [fetchTrees]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    const res = await createTree(newTitle, newDesc);
    setCreating(false);
    if (res.success) {
      toast.success('Tree created!');
      setShowCreate(false);
      setNewTitle(''); setNewDesc('');
      navigate(`/trees/${res.tree.id}`);
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this tree? This cannot be undone.')) return;
    const res = await deleteTree(id);
    if (res.success) toast.success('Tree deleted');
    else toast.error(res.message);
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(59,130,246,0.2)',
    color: '#e8e8f0',
    borderRadius: 12,
    padding: '10px 14px',
    fontSize: 14,
    width: '100%',
    outline: 'none',
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundBlobs />
      <Sidebar />

      <main className="relative z-10 ml-64 p-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <BackButton to="/" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Cinzel', color: '#e8e8f0' }}>
            Dashboard
          </h1>
          <p style={{ color: '#8888aa' }}>Welcome back, {user?.name?.split(' ')[0]}! Manage your family trees here.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Trees', value: trees.length, icon: TreePine },
            { label: 'Members', value: trees.reduce((a, t) => a + (t.members?.length || 0), 0), icon: Users },
            { label: 'Connections', value: trees.reduce((a, t) => a + (t.relationships?.length || 0), 0), icon: Clock },
          ].map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.1)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon size={18} color="#3b82f6" />
                <span className="text-sm" style={{ color: '#8888aa' }}>{label}</span>
              </div>
              <p className="text-3xl font-bold" style={{ fontFamily: 'Cinzel', color: '#e8e8f0' }}>{value}</p>
            </motion.div>
          ))}
        </div>

        {/* Trees Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ fontFamily: 'Cinzel', color: '#e8e8f0' }}>Your Trees</h2>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}
          >
            <Plus size={16} /> New Tree
          </motion.button>
        </div>

        {/* Trees Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => (
              <div key={i} className="h-40 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : trees.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <TreePine size={48} color="#3b82f6" style={{ margin: '0 auto 16px', opacity: 0.4 }} />
            <p className="text-lg mb-2" style={{ color: '#e8e8f0' }}>No family trees yet</p>
            <p className="text-sm mb-6" style={{ color: '#8888aa' }}>Create your first tree to start mapping your family.</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}
            >
              Create Tree
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trees.map((tree, i) => (
              <motion.div
                key={tree.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigate(`/trees/${tree.id}`)}
                className="p-5 rounded-2xl cursor-pointer transition-all hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.1)' }}
                whileHover={{ borderColor: 'rgba(59,130,246,0.3)', boxShadow: '0 8px 32px rgba(59,130,246,0.1)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                    <TreePine size={20} color="#3b82f6" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/trees/${tree.id}`); }}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                      style={{ color: '#8888aa' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(tree.id, e)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                      style={{ color: '#8888aa' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold mb-1" style={{ color: '#e8e8f0' }}>{tree.title}</h3>
                {tree.description && <p className="text-xs mb-3 line-clamp-2" style={{ color: '#8888aa' }}>{tree.description}</p>}
                <div className="flex items-center gap-4 text-xs" style={{ color: '#8888aa' }}>
                  <span className="flex items-center gap-1"><Users size={12} /> {tree.members?.length || 0} members</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {new Date(tree.updatedAt).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
              onClick={() => setShowCreate(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-2xl p-6 z-10"
              style={{ background: 'rgba(14,14,24,0.98)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 style={{ fontFamily: 'Cinzel', fontSize: 18, color: '#3b82f6' }}>New Family Tree</h2>
                <button onClick={() => setShowCreate(false)} style={{ color: '#8888aa' }}><X size={18} /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: '#8888aa' }}>Tree Name *</label>
                  <input style={inputStyle} placeholder="e.g. Smith Family Tree" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: '#8888aa' }}>Description</label>
                  <textarea style={{ ...inputStyle, resize: 'none', height: 72 }} placeholder="Optional description..." value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowCreate(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm"
                    style={{ background: 'rgba(255,255,255,0.06)', color: '#8888aa', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={creating}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}>
                    {creating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
