import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2 } from 'lucide-react';

const RELATION_TYPES = [
  'father', 'mother', 'son', 'daughter',
  'brother', 'sister', 'husband', 'wife',
  'grandfather', 'grandmother', 'grandson', 'granddaughter',
  'uncle', 'aunt', 'nephew', 'niece', 'cousin',
];

export default function RelationshipModal({ isOpen, onClose, onSave, members, connectParams }) {
  const [source, setSource] = useState(() => connectParams?.source || '');
  const [target, setTarget] = useState(() => connectParams?.target || '');
  const [relationType, setRelationType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!source || !target || !relationType || source === target) return;
    onSave({ 
      source, 
      target, 
      relationType,
      sourceHandle: connectParams?.sourceHandle,
      targetHandle: connectParams?.targetHandle
    });
    setSource(''); setTarget(''); setRelationType('');
    onClose();
  };

  const selectStyle = {
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md rounded-2xl p-6 z-10"
            style={{
              background: 'rgba(14,14,24,0.98)',
              border: '1px solid rgba(59,130,246,0.2)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontFamily: 'Cinzel', fontSize: 18, color: '#3b82f6' }}>Add Relationship</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: '#8888aa' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: '#8888aa' }}>From Person</label>
                <select style={selectStyle} value={source} onChange={(e) => setSource(e.target.value)} required>
                  <option value="" style={{ background: '#0a0a12' }}>Select person...</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id} style={{ background: '#0a0a12' }}>
                      {m.type === 'union' ? '⚪ Union Point' : m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <Link2 size={14} color="#3b82f6" />
                </div>
              </div>

              <div>
                <label className="text-xs mb-1.5 block" style={{ color: '#8888aa' }}>Relationship Type</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {RELATION_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRelationType(type)}
                      className="py-1.5 px-2 rounded-lg text-xs capitalize transition-all"
                      style={{
                        background: relationType === type ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${relationType === type ? '#3b82f6' : 'rgba(59,130,246,0.1)'}`,
                        color: relationType === type ? '#3b82f6' : '#8888aa',
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom type..."
                  value={RELATION_TYPES.includes(relationType) ? '' : relationType}
                  onChange={(e) => setRelationType(e.target.value)}
                  style={selectStyle}
                />
              </div>

              <div>
                <label className="text-xs mb-1.5 block" style={{ color: '#8888aa' }}>To Person</label>
                <select style={selectStyle} value={target} onChange={(e) => setTarget(e.target.value)} required>
                  <option value="" style={{ background: '#0a0a12' }}>Select person...</option>
                  {members.filter(m => m.id !== source).map((m) => (
                    <option key={m.id} value={m.id} style={{ background: '#0a0a12' }}>
                      {m.type === 'union' ? '⚪ Union Point' : m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#8888aa', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}>
                  Connect
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
