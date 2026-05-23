import { Globe, GitFork, Link2, TreePine, Heart } from 'lucide-react';

const socialLinks = [
  { href: 'https://vvraju.netlify.app/', icon: Globe, label: 'Website' },
  { href: 'https://github.com/vvraju56', icon: GitFork, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/vishnuraju-v-757b9929b', icon: Link2, label: 'LinkedIn' },
];

const footerCols = [
  { title: 'Features', links: ['Family Trees', 'Relationship Paths', 'Path Finder', 'Export Tools'] },
  { title: 'Resources', links: ['Documentation', 'API Reference', 'Sample Data', 'Tutorials'] },
  { title: 'Support', links: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'] },
];

export default function Footer() {
  return (
    <footer style={{ background: 'rgba(10,10,18,0.95)', borderTop: '1px solid rgba(59,130,246,0.1)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <TreePine size={18} color="#fff" />
              </div>
            <span style={{ fontFamily: 'Cinzel', fontSize: 20, color: '#3b82f6' }}>Tree-Map</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#8888aa' }}>
              Visualize your family story. Connect generations, discover relationships, and preserve your heritage.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  title={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: 'rgba(59,130,246,0.08)',
                    border: '1px solid rgba(59,130,246,0.15)',
                    color: '#8888aa',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.2)'; e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 16px rgba(59,130,246,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; e.currentTarget.style.color = '#8888aa'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {footerCols.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-sm font-semibold mb-4" style={{ color: '#e8e8f0', fontFamily: 'Cinzel' }}>{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm transition-colors" style={{ color: '#8888aa' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
          <p className="text-sm" style={{ color: '#8888aa' }}>
          © 2026 Tree-Map. All rights reserved.
          </p>
          <p className="text-sm flex items-center gap-1.5" style={{ color: '#8888aa' }}>
            Made with <Heart size={14} color="#3b82f6" fill="#3b82f6" /> by{' '}
            <a href="https://vvraju.netlify.app/" target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>VV</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
