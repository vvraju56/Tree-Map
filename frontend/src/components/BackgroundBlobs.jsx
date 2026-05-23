export default function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="blob w-96 h-96 top-[-10%] left-[-5%]" style={{ background: '#3b82f6' }} />
      <div className="blob w-80 h-80 bottom-[-5%] right-[-5%]" style={{ background: '#7c3aed', animationDelay: '3s', animationDuration: '15s' }} />
      <div className="blob w-64 h-64 top-[40%] right-[15%]" style={{ background: '#3b82f6', opacity: 0.1, animationDelay: '6s' }} />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
