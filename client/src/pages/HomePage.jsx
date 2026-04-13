import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const QUICK_ACTIONS = [
  { icon: '💬', label: 'Chat IA',       path: '/chat',           color: 'var(--accent)' },
  { icon: '✅', label: 'Mes tâches',    path: '/productivity/tasks', color: 'var(--cat-productivity)' },
  { icon: '🎯', label: 'Score de Vie',  path: '/intelligence/lifescore', color: 'var(--cat-intelligence)' },
  { icon: '✍️', label: 'Email IA',      path: '/creation/email', color: 'var(--cat-creation)' },
  { icon: '🏃', label: 'Workout IA',    path: '/lifestyle/workout', color: 'var(--cat-lifestyle)' },
  { icon: '🧮', label: 'Calculatrice',  path: '/outils/calc',    color: 'var(--cat-outils)' },
];

const CATEGORIES = [
  { icon: '✅', label: 'Productivité',   count: 13, path: '/productivity', color: 'var(--cat-productivity)' },
  { icon: '🧠', label: 'Intelligence IA', count: 12, path: '/intelligence', color: 'var(--cat-intelligence)' },
  { icon: '✨', label: 'Création',         count: 12, path: '/creation',     color: 'var(--cat-creation)' },
  { icon: '🌿', label: 'Lifestyle',         count: 20, path: '/lifestyle',    color: 'var(--cat-lifestyle)' },
  { icon: '🔧', label: 'Outils & Info',     count: 15, path: '/outils',       color: 'var(--cat-outils)' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user }  = useAuth();

  const firstName = user?.name?.split(' ')[0] || 'toi';

  return (
    <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,92,255,0.12), rgba(91,139,255,0.06))',
        border: '1px solid rgba(124,92,255,0.2)',
        borderRadius: 20,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text3)', fontWeight: 500 }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
          {getGreeting()}, {firstName} 👋
        </h1>
        <p style={{ color: 'var(--text2)', maxWidth: 480 }}>
          Ton assistant de vie tout-en-un. 72 outils, une IA au cœur de tout.
        </p>
        <div style={{ marginTop: 8 }}>
          <button className="btn btn-primary" onClick={() => navigate('/chat')}>
            💬 Démarrer le Chat IA
          </button>
        </div>
      </div>

      {/* Actions rapides */}
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>Actions rapides</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 10,
        }}>
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.path}
              onClick={() => navigate(a.path)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '16px 12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                color: 'var(--text)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
            >
              <span style={{ fontSize: 24 }}>{a.icon}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Catégories */}
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>
          Toutes les catégories — <span style={{ color: 'var(--accent)' }}>72 outils</span>
        </h2>
        <div className="category-list">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.path}
              className="category-card"
              onClick={() => navigate(cat.path)}
            >
              <div
                className="category-icon"
                style={{ background: `${cat.color}20` }}
              >
                {cat.icon}
              </div>
              <div className="category-info">
                <div className="category-name">{cat.label}</div>
                <div className="category-count">{cat.count} outils</div>
              </div>
              <span style={{ color: 'var(--text3)', fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
