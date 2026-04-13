import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

const PROFILES = [
  { id: 'student',   emoji: '🎓', label: 'Étudiant',  desc: 'Notes, révisions, planning' },
  { id: 'freelance', emoji: '💼', label: 'Freelance', desc: 'Projets, devis, finances' },
  { id: 'lifestyle', emoji: '✨', label: 'Lifestyle',  desc: 'Bien-être, sport, quotidien' },
];

export default function LoginPage() {
  const [tab, setTab]       = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  // Login fields
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [name, setName]         = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass]   = useState('');
  const [profile, setProfile]   = useState('lifestyle');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Remplis tous les champs.'); return; }
    setLoading(true); setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Email ou mot de passe incorrect.');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !regEmail || !regPass) { setError('Remplis tous les champs.'); return; }
    if (regPass.length < 6) { setError('Mot de passe trop court (6 caractères min).'); return; }
    setLoading(true); setError('');
    try {
      await register(name, regEmail, regPass, profile);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 16px',
            boxShadow: 'var(--shadow-accent)',
          }}>✦</div>
          <h1 style={{ fontSize: '2rem', letterSpacing: 4, fontWeight: 800 }}>ORION</h1>
          <p style={{ color: 'var(--text3)', fontSize: '0.875rem', marginTop: 4 }}>
            Ton assistant de vie tout-en-un
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: 4,
          marginBottom: 24,
        }}>
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              style={{
                flex: 1,
                padding: '9px 0',
                borderRadius: 10,
                border: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                background: tab === t ? 'var(--accent)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--text2)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {t === 'login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: '0.875rem',
            color: 'var(--danger)',
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* Formulaires */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 24,
        }}>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="ton@email.com" />
              <Input label="Mot de passe" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 4 }} disabled={loading}>
                {loading ? <span className="spinner" /> : 'Se connecter'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input label="Prénom et nom" value={name} onChange={setName} placeholder="Jean Dupont" />
              <Input label="Email" type="email" value={regEmail} onChange={setRegEmail} placeholder="ton@email.com" />
              <Input label="Mot de passe" type="password" value={regPass} onChange={setRegPass} placeholder="6 caractères minimum" />

              {/* Profil */}
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: 8, fontWeight: 500 }}>Ton profil</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {PROFILES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProfile(p.id)}
                      style={{
                        flex: 1,
                        padding: '10px 6px',
                        borderRadius: 10,
                        border: `2px solid ${profile === p.id ? 'var(--accent)' : 'var(--border)'}`,
                        background: profile === p.id ? 'var(--accent-soft)' : 'var(--surface2)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{p.emoji}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: profile === p.id ? 'var(--accent)' : 'var(--text2)' }}>
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 4 }} disabled={loading}>
                {loading ? <span className="spinner" /> : 'Créer mon compte'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text2)' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
}
