import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TreePine, GitBranch, Search, Download, Users, Shield, Zap, ChevronRight } from 'lucide-react';
import BackgroundBlobs from '../components/BackgroundBlobs';
import Footer from '../components/Footer';

const features = [
  { icon: TreePine, title: 'Visual Tree Editor', desc: 'Drag, drop and connect family members on an infinite canvas with React Flow.' },
  { icon: GitBranch, title: 'Relationship Mapping', desc: 'Define 15+ relationship types and visualize how everyone is connected.' },
  { icon: Search, title: 'Path Finder', desc: 'Discover exactly how any two people are related using BFS graph traversal.' },
  { icon: Download, title: 'Export Options', desc: 'Export your family tree as PNG, PDF, or JSON for backup and sharing.' },
  { icon: Users, title: 'Member Profiles', desc: 'Store photos, birthdates, notes, and contact info for each family member.' },
  { icon: Shield, title: 'Secure & Private', desc: 'JWT authentication, bcrypt hashing, and rate limiting protect your data.' },
];

const testimonials = [
  { name: 'Sarah Mitchell', role: 'Family Historian', text: 'Tree-Map helped me trace 6 generations of my family in an afternoon. The path finder is absolutely magical.' },
  { name: 'Raj Patel', role: 'Genealogy Enthusiast', text: 'The visual interface is stunning. I\'ve tried many genealogy tools and nothing comes close to this.' },
  { name: 'Elena Kovacs', role: 'Family Archivist', text: 'Finally a tool that makes complex family relationships easy to understand and share.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Landing() {
  return (
    <div className="min-h-screen relative">
      <BackgroundBlobs />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <TreePine size={18} color="#fff" />
          </div>
            <span style={{ fontFamily: 'Cinzel', fontSize: 22, color: '#3b82f6' }}>Tree-Map</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 rounded-xl text-sm transition-colors" style={{ color: '#8888aa' }}>Sign in</Link>
          <Link
            to="/register"
            className="px-5 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-20 pb-32">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-8" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6' }}>
            <Zap size={12} /> Now with AI relationship suggestions
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Cinzel', background: 'linear-gradient(135deg, #fff 40%, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Your Family's<br />Story, Visualized
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: '#8888aa' }}>
            Create beautiful interactive family trees, discover hidden connections, and explore how family members are related — all with an easy drag-and-drop canvas.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-medium text-sm glow-blue transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}
            >
              Start Building <ChevronRight size={16} />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-medium text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#e8e8f0', border: '1px solid rgba(59,130,246,0.15)' }}
            >
              Sign in
            </Link>
          </div>
        </motion.div>

        {/* Preview card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 max-w-4xl mx-auto rounded-2xl p-8 relative overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          {/* Mock tree visualization */}
          <div className="relative h-64 flex items-center justify-center">
            {[
              { label: 'Grandpa John', x: '50%', y: '5%', gender: 'male' },
              { label: 'Dad Robert', x: '30%', y: '40%', gender: 'male' },
              { label: 'Uncle Tom', x: '70%', y: '40%', gender: 'male' },
              { label: 'You', x: '20%', y: '78%', gender: 'other' },
              { label: 'Sister Amy', x: '42%', y: '78%', gender: 'female' },
            ].map((node) => (
              <div key={node.label} className="absolute" style={{ left: node.x, top: node.y, transform: 'translate(-50%, 0)' }}>
                <div
                  className="px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap"
                  style={{
                    background: 'rgba(10,10,18,0.9)',
                    border: `1px solid ${node.gender === 'female' ? '#3b82f6' : node.gender === 'male' ? '#4fa3ff' : '#a78bfa'}`,
                    color: '#e8e8f0',
                    boxShadow: `0 0 12px ${node.gender === 'female' ? 'rgba(59,130,246,0.3)' : node.gender === 'male' ? 'rgba(79,163,255,0.3)' : 'rgba(167,139,250,0.3)'}`,
                  }}
                >
                  {node.label}
                </div>
              </div>
            ))}
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.4 }}>
              <line x1="50%" y1="18%" x2="30%" y2="40%" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="50%" y1="18%" x2="70%" y2="40%" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="30%" y1="53%" x2="20%" y2="78%" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="30%" y1="53%" x2="42%" y2="78%" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
            </svg>
          </div>
          <p className="text-xs text-center mt-2" style={{ color: '#8888aa' }}>Interactive family tree — drag, connect, explore</p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" {...fadeUp}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Cinzel', color: '#e8e8f0' }}>Everything You Need</h2>
          <p className="text-base" style={{ color: '#8888aa' }}>A complete genealogy platform built for modern families</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl transition-all hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.1)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <f.icon size={20} color="#3b82f6" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#e8e8f0' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#8888aa' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 px-6 py-24" style={{ background: 'rgba(59,130,246,0.02)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Cinzel', color: '#e8e8f0' }}>Loved by Families Worldwide</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fadeUp} transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.1)' }}>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#c0c0d8' }}>"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#e8e8f0' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: '#3b82f6' }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center px-6 py-24">
        <motion.div {...fadeUp}>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Cinzel', color: '#e8e8f0' }}>Start Your Family Story</h2>
          <p className="mb-10" style={{ color: '#8888aa' }}>Free to use. No credit card required.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-medium glow-pink-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', fontSize: 16 }}
          >
            Create Your Tree <ChevronRight size={18} />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
