import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

function UnionNode({ selected }) {
  // Center all handles to ensure lines meet at the exact center of the dot
  const handleStyle = {
    width: 10,
    height: 10,
    background: 'transparent',
    border: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 30
  };

  const hiddenHandleStyle = {
    ...handleStyle,
    background: 'transparent',
  };

  return (
    <div 
      className="w-6 h-6 transition-all flex items-center justify-center"
      style={{ 
        position: 'relative'
      }}
    >
      <div
        className="w-2.5 h-2.5 rounded-full"
        style={{
          background: '#3b82f6',
          border: '1.5px solid #fff',
          boxShadow: selected ? '0 0 12px rgba(59,130,246,1)' : '0 0 6px rgba(0,0,0,0.3)',
        }}
      />
      {/* Universal target and source handles for any direction */}
      <Handle type="target" position={Position.Top} id="top" style={handleStyle} />
      <Handle type="source" position={Position.Top} id="top" style={hiddenHandleStyle} />
      <Handle type="target" position={Position.Left} id="left" style={handleStyle} />
      <Handle type="source" position={Position.Left} id="left" style={hiddenHandleStyle} />
      <Handle type="target" position={Position.Right} id="right" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={hiddenHandleStyle} />
      <Handle type="target" position={Position.Bottom} id="bottom" style={hiddenHandleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle} />
    </div>
  );
}

export default memo(UnionNode);
