import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';

const genderColors = {
  male: 'linear-gradient(135deg, #4fa3ff, #2563eb)',
  female: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  other: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
};

function PersonNode({ data, selected, isConnectTarget }) {
  const { person, onEdit, onDelete } = data;
  const [hovered, setHovered] = useState(false);

  const initials = person.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div 
      style={{ width: 180, height: 80, position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl p-4 cursor-pointer overflow-hidden relative"
          style={{
            background: 'rgba(10,10,18,0.95)',
            border: selected ? '2px solid #3b82f6' : isConnectTarget ? '2px solid #10b981' : '1px solid rgba(59,130,246,0.2)',
            boxShadow: selected ? '0 0 24px rgba(59,130,246,0.4)' : '0 4px 24px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(20px)',
            width: 180,
            height: 80,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{
                background: person.photo
                  ? 'transparent'
                  : genderColors[person.gender] || genderColors.male,
              }}
            >
              {person.photo ? (
                <img src={person.photo} alt={person.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: '#e8e8f0' }}>{person.name}</p>
              <p className="text-xs" style={{ color: '#8888aa' }}>{person.gender || 'other'}</p>
            </div>
          </div>

          <AnimatePresence>
            {(hovered || selected) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-4"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(person);
                  }}
                  className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 hover:bg-blue-500/40 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete ${person.name}?`)) {
                      onDelete?.(person.id);
                    }
                  }}
                  className="p-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/40 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      <Handle type="target" position={Position.Top} id="top" style={{ width: 14, height: 14, background: '#3b82f6', border: '2px solid #1e3a8a', zIndex: 10 }} />
      <Handle type="source" position={Position.Top} id="top" style={{ width: 14, height: 14, background: 'transparent', border: 'none', zIndex: 11 }} />
      <Handle type="target" position={Position.Bottom} id="bottom" style={{ width: 14, height: 14, background: 'transparent', border: 'none', zIndex: 10 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ width: 14, height: 14, background: '#3b82f6', border: '2px solid #1e3a8a', zIndex: 11 }} />
      <Handle type="target" position={Position.Left} id="left" style={{ width: 14, height: 14, background: 'transparent', border: 'none', zIndex: 10 }} />
      <Handle type="source" position={Position.Left} id="left" style={{ width: 14, height: 14, background: '#3b82f6', border: '2px solid #1e3a8a', zIndex: 11 }} />
      <Handle type="target" position={Position.Right} id="right" style={{ width: 14, height: 14, background: '#3b82f6', border: '2px solid #1e3a8a', zIndex: 10 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ width: 14, height: 14, background: 'transparent', border: 'none', zIndex: 11 }} />
    </div>
  );
}

export default memo(PersonNode);
