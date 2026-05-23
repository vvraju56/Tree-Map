import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ to, className = '' }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => to ? navigate(to) : navigate(-1)}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:scale-105 ${className}`}
      style={{ 
        background: 'rgba(59,130,246,0.1)', 
        border: '1px solid rgba(59,130,246,0.2)',
        color: '#3b82f6'
      }}
    >
      <ArrowLeft size={16} />
      <span>Back</span>
    </button>
  );
}