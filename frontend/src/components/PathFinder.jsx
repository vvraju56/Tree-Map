import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, X, ArrowRight } from 'lucide-react';
import { findRelationshipPath } from '../utils/relationshipEngine';

export default function PathFinder({ members, relationships, onClose }) {
  const [personA, setPersonA] = useState('');
  const [personB, setPersonB] = useState('');
  const [result, setResult] = useState(null);

  const handleFind = () => {
    if (!personA || !personB) return;
    const res = findRelationshipPath(members, relationships, personA, personB);
    setResult(res);
  };

  const getMember = (id) => members.find((m) => m.id === id);

  const selectStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(59,130,246,0.2)',
    color: '#e8e8f0',
    borderRadius: 12,
    padding: '8px 12px',
    fontSize: 13,
    width: '100%',
    outline: 'none',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(10,10,18,0.96)',
        border: '1px solid rgba(59,130,246,0.2)',
        width: 280,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitBranch size={16} color="#3b82f6" />
          <span className="text-sm font-semibold" style={{ color: '#e8e8f0' }}>Path Finder</span>
        </div>
        <button onClick={onClose} style={{ color: '#8888aa' }}><X size={14} /></button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs mb-1 block" style={{ color: '#8888aa' }}>Person A</label>
          <select style={selectStyle} value={personA} onChange={(e) => { setPersonA(e.target.value); setResult(null); }}>
            <option value="" style={{ background: '#0a0a12' }}>Select...</option>
            {members.map((m) => <option key={m.id} value={m.id} style={{ background: '#0a0a12' }}>{m.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs mb-1 block" style={{ color: '#8888aa' }}>Person B</label>
          <select style={selectStyle} value={personB} onChange={(e) => { setPersonB(e.target.value); setResult(null); }}>
            <option value="" style={{ background: '#0a0a12' }}>Select...</option>
            {members.filter(m => m.id !== personA).map((m) => <option key={m.id} value={m.id} style={{ background: '#0a0a12' }}>{m.name}</option>)}
          </select>
        </div>

        <button
          onClick={handleFind}
          disabled={!personA || !personB}
          className="w-full py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: personA && personB ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(255,255,255,0.06)',
            color: personA && personB ? '#fff' : '#8888aa',
          }}
        >
          Find Relationship
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
          >
            <p className="text-xs mb-2" style={{ color: '#8888aa' }}>Relationship</p>
            <p className="text-base font-semibold mb-3" style={{ color: '#3b82f6', fontFamily: 'Cinzel' }}>
              {result.label}
            </p>

            {result.path && result.path.length > 0 && (
              <div>
                <p className="text-xs mb-2" style={{ color: '#8888aa' }}>Path:</p>
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)', color: '#e8e8f0' }}>
                    {getMember(personA)?.name}
                  </span>
                  {result.path.map((step, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <ArrowRight size={10} color="#3b82f6" />
                      <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)', color: '#e8e8f0' }}>
                        {getMember(step.to)?.name}
                      </span>
                    </span>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: '#8888aa' }}>
                  {result.path.map(s => s.type).join(' → ')}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
