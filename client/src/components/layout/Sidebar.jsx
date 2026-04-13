import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { section: 'Principal' },
  { path: '/',          icon: '✦',  label: 'Home' },
  { path: '/chat',      icon: '💬', label: 'Chat IA' },

  { section: 'Outils' },
  { path: '/productivity', icon: '✅', label: 'Productivité',   count: 13, color: 'var(--cat-productivity)' },
  { path: '/intelligence', icon: '🧠', label: 'Intelligence IA', count: 12, color: 'var(--cat-intelligence)' },
  { path: '/creation',     icon: '✨', label: 'Création',         count: 12, color: 'var(--cat-creation)' },
  { path: '/lifestyle',    icon: '🌿', label: 'Lifestyle',         count: 20, color: 'var(--cat-lifestyle)' },
  { path: '/outils',       icon: '🔧', label: 'Outils & Info',     count: 15, color: 'var(--cat-outils)' },

  { section: 'Compte' },
  { path: '/profile', icon: '👤', label: 'Mon profil' },
  { path: '/settings', icon: '⚙️', label: 'Paramètres' },
];

export default function Sidebar({ open, onClose }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();

  const handleNav = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'OR';

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={`sidebar-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">✦</div>
          <div>
            <div className="sidebar-brand">ORION</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV.map((item, i) => {
            if (item.section) {
              return (
                <div key={i} className="nav-section-title">
                  {item.section}
                </div>
              );
            }

            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNav(item.path)}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.count && (
                  <span className="nav-item-count">{item.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer utilisateur */}
        <div className="sidebar-footer">
          <div className="user-card" onClick={handleLogout} title="Se déconnecter">
            <div className="user-avatar">{initials}</div>
            <div>
              <div className="user-name">{user?.name || 'Utilisateur'}</div>
              <div className="user-plan">
                {user?.profile === 'student'   ? '🎓 Étudiant'  :
                 user?.profile === 'freelance' ? '💼 Freelance' : '✨ Lifestyle'}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
