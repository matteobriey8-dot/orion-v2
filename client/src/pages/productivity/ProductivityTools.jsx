import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Chips, Textarea, ResultBox } from '../../components/ui/index.jsx';
import { useAI } from '../../hooks/useAI';

// ── POMODORO ──────────────────────────────────────────────────────────────────
const MODES = [
  { key: 'focus',  label: 'Focus',        duration: 25 * 60, color: '#7C5CFF' },
  { key: 'short',  label: 'Pause courte', duration: 5 * 60,  color: '#22C55E' },
  { key: 'long',   label: 'Pause longue', duration: 15 * 60, color: '#5B8BFF' },
];

const R = 96;
const CIRC = 2 * Math.PI * R;

export function PomodoroPage() {
  const navigate = useNavigate();
  const [mode, setMode]         = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning]   = useState(false);
  const [sessions, setSessions] = useState(0);
  const timerRef = useRef(null);

  const current = MODES.find(m => m.key === mode);
  const total   = current.duration;
  const offset  = CIRC * (1 - timeLeft / total);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const start = () => {
    setRunning(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setRunning(false);
          if (mode === 'focus') setSessions(s => s + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause  = () => { clearInterval(timerRef.current); setRunning(false); };
  const reset  = () => { clearInterval(timerRef.current); setRunning(false); setTimeLeft(current.duration); };
  const skip   = () => { clearInterval(timerRef.current); setRunning(false); setTimeLeft(0); if (mode === 'focus') setSessions(s => s + 1); };

  const switchMode = (k) => {
    clearInterval(timerRef.current); setRunning(false); setMode(k);
    setTimeLeft(MODES.find(m => m.key === k).duration);
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padLeft ? String(Math.floor(s / 60)).padStart(2, '0') : String(Math.floor(s / 60)).toString().padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="tool-page">
      <PageHeader title="🍅 Pomodoro" subtitle="Technique de concentration" onBack={() => navigate('/productivity')} />
      <div className="tool-page-body">

        {/* Sélecteur de mode */}
        <div style={{ display: 'flex', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 4 }}>
          {MODES.map(m => (
            <button key={m.key} onClick={() => switchMode(m.key)} style={{ flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', fontWeight: 600, fontSize: '0.82rem', background: mode === m.key ? m.color : 'transparent', color: mode === m.key ? '#fff' : 'var(--text2)', cursor: 'pointer', transition: 'all 0.2s' }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Cercle timer */}
        <div className="pomodoro-wrapper">
          <div className="pomodoro-circle">
            <svg className="pomodoro-svg" viewBox="0 0 220 220">
              <circle className="pomodoro-track" cx="110" cy="110" r={R} />
              <circle className="pomodoro-progress" cx="110" cy="110" r={R}
                stroke={current.color}
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="pomodoro-center">
              <div className="pomodoro-time" style={{ color: current.color }}>{fmt(timeLeft)}</div>
              <div className="pomodoro-label">{current.label}</div>
            </div>
          </div>

          {/* Contrôles */}
          <div className="pomodoro-controls">
            <button className="pomodoro-btn-secondary" onClick={reset} title="Reset">↺</button>
            <button className="pomodoro-btn-main" onClick={running ? pause : start} style={{ background: current.color }}>
              {running ? '⏸' : '▶'}
            </button>
            <button className="pomodoro-btn-secondary" onClick={skip} title="Skip">⏭</button>
          </div>

          {/* Sessions */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 10 }}>Sessions : {sessions}</div>
            <div className="pomodoro-sessions">
              {[0,1,2,3].map(i => (
                <div key={i} className={`session-dot ${i < (sessions % 4) ? 'done' : ''}`} />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 340 }}>
            {[
              { label: 'Sessions', value: sessions, icon: '✅' },
              { label: 'Temps focus', value: `${sessions * 25} min`, icon: '⏱️' },
              { label: 'Pause suivante', value: sessions % 4 === 3 ? 'Longue' : 'Courte', icon: '☕' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DAY PLANNER IA ────────────────────────────────────────────────────────────
export function DayPlannerPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [goals, setGoals]   = useState('');
  const [wake, setWake]     = useState('07:00');
  const [sleep, setSleep]   = useState('23:00');

  const times = ['05:00','06:00','07:00','08:00','09:00','10:00','11:00','21:00','22:00','23:00','00:00'];

  const handleGenerate = () => {
    if (!goals.trim()) return;
    generate(`Crée un planning détaillé pour une journée de ${wake} à ${sleep}.
Objectifs du jour : ${goals}
Format : liste d'activités avec horaires précis (ex: 07:00 - Réveil & routine matinale (20 min)).
Inclus : travail, pauses, repas, détente. Sois réaliste et efficace. Uniquement le planning, sans introduction.`, 'Day Planner');
  };

  return (
    <div className="tool-page">
      <PageHeader title="🗓️ Day Planner IA" subtitle="Génère ta journée parfaite" onBack={() => navigate('/productivity')} />
      <div className="tool-page-body">
        <div style={{ background: 'rgba(124,92,255,0.08)', border: '1px solid rgba(124,92,255,0.2)', borderRadius: 14, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20 }}>✦</span>
          <p style={{ fontSize: '0.875rem', color: 'var(--text2)', margin: 0 }}>Décris tes objectifs du jour, ORION planifie ta journée parfaite avec des horaires précis.</p>
        </div>

        {/* Horaires */}
        <div style={{ display: 'flex', gap: 12 }}>
          {[['Réveil', wake, setWake], ['Coucher', sleep, setSleep]].map(([label, val, set]) => (
            <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text2)', fontWeight: 500 }}>{label}</label>
              <select className="select" value={val} onChange={e => set(e.target.value)}>
                {times.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          ))}
        </div>

        <Textarea label="Tes objectifs du jour" value={goals} onChange={e => setGoals(e.target.value)} placeholder="Ex: Finir le rapport, sport 1h, appel client 14h, préparer présentation..." style={{ minHeight: 100 }} />

        {error && <div className="alert alert-error">{error}</div>}

        <Button full loading={loading} onClick={handleGenerate} disabled={!goals.trim()}>
          ✦ Générer mon planning
        </Button>

        <ResultBox result={result} onRegenerate={handleGenerate} />
      </div>
    </div>
  );
}

// ── PLACEHOLDER GÉNÉRIQUE ─────────────────────────────────────────────────────
export function ProductivityPlaceholder({ icon, title, description }) {
  const navigate = useNavigate();
  return (
    <div className="tool-page">
      <PageHeader title={`${icon} ${title}`} onBack={() => navigate('/productivity')} />
      <div className="tool-page-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 80, height: 80, background: 'rgba(124,92,255,0.1)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>{icon}</div>
          <h2>{title}</h2>
          <p style={{ maxWidth: 300 }}>{description}</p>
          <span style={{ background: 'rgba(124,92,255,0.1)', color: 'var(--accent)', padding: '6px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>Disponible prochainement</span>
        </div>
      </div>
    </div>
  );
}
