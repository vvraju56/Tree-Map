import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TreePine, Users, Clock, ArrowRight, Trash2 } from 'lucide-react';
import useTreeStore from '../store/treeStore';
import Sidebar from '../components/Sidebar';
import BackButton from '../components/BackButton';
import BackgroundBlobs from '../components/BackgroundBlobs';
import toast from 'react-hot-toast';

export default function Trees() {
  const { trees, fetchTrees, deleteTree, loading } = useTreeStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrees();
  }, [fetchTrees]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this tree?')) return;
    const res = await deleteTree(id);
    if (res.success) toast.success('Tree deleted');
    else toast.error(res.message);
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
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Cinzel', color: '#e8e8f0' }}>My Trees</h1>
          <p style={{ color: '#8888aa' }}>View and manage all your family trees in one place.</p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : trees.length === 0 ? (
          <div className="text-center py-24">
            <TreePine size={48} color="#3b82f6" style={{ margin: '0 auto 16px', opacity: 0.4 }} />
            <p className="text-lg mb-1" style={{ color: '#e8e8f0' }}>No family trees yet</p>
            <p className="text-sm mb-6" style={{ color: '#8888aa' }}>Create your first tree from the Dashboard.</p>
            <button onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}>
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {trees.map((tree, i) => (
              <motion.div
                key={tree.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => navigate(`/trees/${tree.id}`)}
                className="flex items-center gap-5 p-5 rounded-2xl cursor-pointer transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.1)' }}
                whileHover={{ borderColor: 'rgba(59,130,246,0.3)', x: 4 }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(59,130,246,0.1)' }}>
                  <TreePine size={22} color="#3b82f6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1 truncate" style={{ color: '#e8e8f0' }}>{tree.title}</h3>
                  {tree.description && <p className="text-xs truncate mb-2" style={{ color: '#8888aa' }}>{tree.description}</p>}
                  <div className="flex items-center gap-4 text-xs" style={{ color: '#8888aa' }}>
                    <span className="flex items-center gap-1"><Users size={11} /> {tree.members?.length || 0} members</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> Updated {new Date(tree.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={e => handleDelete(tree.id, e)}
                    className="p-2 rounded-xl hover:bg-red-500/20 transition-colors"
                    style={{ color: '#8888aa' }}>
                    <Trash2 size={15} />
                  </button>
                  <ArrowRight size={18} color="#3b82f6" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
