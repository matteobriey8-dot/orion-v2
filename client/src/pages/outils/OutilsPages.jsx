import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Chips, ResultBox } from '../../components/ui/index.jsx';
import { useAI } from '../../hooks/useAI';

function useLocal(key, init) {
  const [v, setV] = useState(() => { try { return JSON.parse(localStorage.getItem(key)) ?? init; } catch { return init; } });
  const set = (x) => { const n = typeof x === 'function' ? x(v) : x; setV(n); localStorage.setItem(key, JSON.stringify(n)); };
  return [v, set];
}

// ── HUB ───────────────────────────────────────────────────────────────────────
const TOOLS = [
  { icon: '🧮', label: 'Calculatrice',     path: '/outils/calc',       sub: 'Calculs rapides' },
  { icon: '🔄', label: 'Convertisseur',    path: '/outils/converter',  sub: 'Unités, devises, tailles' },
  { icon: '⏱️', label: 'Minuteur',         path: '/outils/timer',      sub: 'Timer + chronomètre' },
  { icon: '🎲', label: 'Générateur',       path: '/outils/generator',  sub: 'Mots de passe, UUID, couleurs' },
  { icon: '📌', label: 'Notes Rapides',    path: '/outils/quicknote',  sub: 'Capture ultra-rapide' },
  { icon: '📱', label: 'QR Code',          path: '/outils/qrcode',     sub: 'Génère des QR codes' },
  { icon: '📈', label: 'Finance IA',       path: '/outils/finance',    sub: 'Conseils financiers' },
  { icon: '₿',  label: 'Crypto',           path: '/outils/crypto',     sub: 'Info et analyse crypto' },
  { icon: '💳', label: 'Budget',           path: '/outils/budget',     sub: 'Gestion budget mensuel' },
  { icon: '🎓', label: 'Mode Étudiant',    path: '/outils/student',    sub: 'Fiches, révisions' },
  { icon: '💼', label: 'Mode Freelance',   path: '/outils/freelance',  sub: 'Devis, contrats, TJM' },
  { icon: '📰', label: 'Actualités IA',    path: '/outils/news',       sub: 'Résumé actu' },
  { icon: '⚖️', label: 'Aide Juridique',   path: '/outils/legal',      sub: 'Questions légales' },
  { icon: '💻', label: 'Assistant Code',   path: '/outils/code',       sub: 'Aide programmation' },
  { icon: '🌍', label: 'Traducteur',       path: '/outils/translate',  sub: 'Traduction instantanée' },
];

export function OutilsHub() {
  const navigate = useNavigate();
  return (
    <div className="tool-page">
      <PageHeader title="🔧 Outils & Info" subtitle="15 outils du quotidien" />
      <div className="tool-page-body">
        <div className="hub-grid">
          {TOOLS.map((t) => (
            <div key={t.path} className="hub-card" onClick={() => navigate(t.path)}>
              <div className="hub-card-icon" style={{ background: 'rgba(91,139,255,0.12)', fontSize: 22 }}>{t.icon}</div>
              <div>
                <div className="hub-card-label">{t.label}</div>
                <div className="hub-card-sub">{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── CALCULATRICE ──────────────────────────────────────────────────────────────
export function CalcPage() {
  const navigate = useNavigate();
  const [display, setDisplay] = useState('0');
  const [expr, setExpr]       = useState('');
  const [prev, setPrev]       = useState(0);
  const [op, setOp]           = useState('');
  const [newInput, setNewInput] = useState(false);

  const press = (key) => {
    if (key === 'C') { setDisplay('0'); setExpr(''); setPrev(0); setOp(''); setNewInput(false); return; }
    if (key === '⌫') { setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0'); return; }
    if (key === '%') { setDisplay(d => String(parseFloat(d) / 100)); return; }
    if (key === '+/-') { setDisplay(d => d.startsWith('-') ? d.slice(1) : '-' + d); return; }
    if (['+', '-', '×', '÷'].includes(key)) {
      setPrev(parseFloat(display)); setOp(key); setExpr(display + ' ' + key); setNewInput(true); return;
    }
    if (key === '=') {
      if (!op) return;
      const cur = parseFloat(display);
      const res = op === '+' ? prev + cur : op === '-' ? prev - cur : op === '×' ? prev * cur : cur !== 0 ? prev / cur : 0;
      setExpr(expr + ' ' + display + ' =');
      setDisplay(res === Math.trunc(res) ? String(res) : parseFloat(res.toFixed(8)).toString());
      setOp(''); setNewInput(true); return;
    }
    if (key === '.' && display.includes('.')) return;
    if (newInput) { setDisplay(key === '.' ? '0.' : key); setNewInput(false); }
    else setDisplay(d => d === '0' && key !== '.' ? key : d + key);
  };

  const BTNS = [
    ['C', '+/-', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['⌫', '0', '.', '='],
  ];

  return (
    <div className="tool-page">
      <PageHeader title="🧮 Calculatrice" onBack={() => navigate('/outils')} />
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)' }}>
        {/* Display */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, borderBottom: '1px solid var(--border)', minHeight: 100 }}>
          {expr && <div style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{expr}</div>}
          <div style={{ fontSize: display.length > 10 ? '2rem' : '3rem', fontWeight: 300, color: 'var(--text)', wordBreak: 'break-all' }}>{display}</div>
        </div>
        {/* Boutons */}
        <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BTNS.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 8, flex: 1 }}>
              {row.map(key => {
                const isOp = ['+', '-', '×', '÷', '='].includes(key);
                const isUtil = ['C', '+/-', '%', '⌫'].includes(key);
                return (
                  <button key={key} onClick={() => press(key)} style={{
                    flex: 1, borderRadius: 14, border: 'none', fontSize: '1.2rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                    background: key === '=' ? 'var(--cat-outils)' : isOp ? 'rgba(91,139,255,0.15)' : isUtil ? 'var(--surface2)' : 'var(--surface)',
                    color: key === '=' ? '#fff' : isOp ? 'var(--cat-outils)' : 'var(--text)',
                  }}>{key}</button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── CONVERTISSEUR ─────────────────────────────────────────────────────────────
const CONVERSIONS = {
  Longueur: { km: 1000, m: 1, cm: 0.01, mm: 0.001, mile: 1609.34, yard: 0.9144, foot: 0.3048, inch: 0.0254 },
  Poids:    { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 },
  Volume:   { L: 1, mL: 0.001, cl: 0.01, gallon: 3.78541, 'fl oz': 0.0295735, cup: 0.236588 },
  Vitesse:  { 'km/h': 1, 'm/s': 3.6, mph: 1.60934, nœuds: 1.852 },
  Surface:  { 'm²': 1, 'km²': 1e6, 'cm²': 0.0001, ha: 10000, acre: 4046.86, 'ft²': 0.092903 },
};

export function ConverterPage() {
  const navigate = useNavigate();
  const [cat, setCat]     = useState('Longueur');
  const [from, setFrom]   = useState('km');
  const [to, setTo]       = useState('m');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const CATS = Object.keys(CONVERSIONS);
  const units = Object.keys(CONVERSIONS[cat] || {});

  useEffect(() => {
    const keys = Object.keys(CONVERSIONS[cat]);
    setFrom(keys[0]); setTo(keys[1] || keys[0]); setResult(''); setInput('');
  }, [cat]);

  const convert = (val, f, t) => {
    const n = parseFloat(val?.replace(',', '.'));
    if (isNaN(n)) { setResult(''); return; }
    if (cat === 'Température') { /* handled below */ return; }
    const res = n * CONVERSIONS[cat][f] / CONVERSIONS[cat][t];
    setResult(res === Math.trunc(res) ? String(res) : parseFloat(res.toFixed(6)).toString());
  };

  return (
    <div className="tool-page">
      <PageHeader title="🔄 Convertisseur" onBack={() => navigate('/outils')} />
      <div className="tool-page-body">
        {/* Catégories */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {CATS.map(c => <button key={c} className={`chip ${c === cat ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>

        {/* Input + unités */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input className="input" type="number" placeholder="0" value={input} onChange={e => { setInput(e.target.value); convert(e.target.value, from, to); }} style={{ flex: 1, fontSize: '1.8rem', fontWeight: 300 }} />
            <select className="select" value={from} onChange={e => { setFrom(e.target.value); convert(input, e.target.value, to); }} style={{ width: 100 }}>
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <button onClick={() => { const tmp = from; setFrom(to); setTo(tmp); convert(input, to, from); }} style={{ background: 'var(--accent-soft)', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: 'var(--accent)', fontWeight: 700 }}>⇅</button>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div onClick={() => result && navigator.clipboard.writeText(result)} style={{ flex: 1, fontSize: '1.8rem', fontWeight: 300, color: 'var(--cat-outils)', cursor: 'pointer', padding: '10px 14px', background: 'var(--surface2)', borderRadius: 10 }} title="Cliquer pour copier">
              {result || '—'}
            </div>
            <select className="select" value={to} onChange={e => { setTo(e.target.value); convert(input, from, e.target.value); }} style={{ width: 100 }}>
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text3)', margin: 0 }}>Cliquer sur le résultat pour copier</p>
        </div>
      </div>
    </div>
  );
}

// ── MINUTEUR ──────────────────────────────────────────────────────────────────
export function TimerPage() {
  const navigate = useNavigate();
  const [tab, setTab]           = useState('timer');
  const [h, setH]               = useState(0);
  const [m, setM]               = useState(0);
  const [s, setS]               = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning]   = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const timerRef = useRef(null);
  const swRef    = useRef(null);

  const total  = h * 3600 + m * 60 + s;
  const R      = 80;
  const CIRC   = 2 * Math.PI * R;
  const offset = total > 0 ? CIRC * (1 - timeLeft / total) : 0;
  const timerColor = tab === 'timer' ? 'var(--cat-outils)' : 'var(--success)';

  const fmt = (secs) => `${String(Math.floor(secs / 3600)).padStart(2,'0')}:${String(Math.floor((secs % 3600) / 60)).padStart(2,'0')}:${String(secs % 60).padStart(2,'0')}`;
  const fmtMs = (ms) => `${String(Math.floor(ms / 60000)).padStart(2,'0')}:${String(Math.floor((ms % 60000) / 1000)).padStart(2,'0')}.${String(Math.floor((ms % 1000) / 10)).padStart(2,'0')}`;

  const startTimer = () => {
    if (total === 0) return;
    setTimeLeft(total); setRunning(true);
    timerRef.current = setInterval(() => setTimeLeft(p => { if (p <= 1) { clearInterval(timerRef.current); setRunning(false); return 0; } return p - 1; }), 1000);
  };
  const pauseTimer = () => { clearInterval(timerRef.current); setRunning(false); };
  const resetTimer = () => { clearInterval(timerRef.current); setRunning(false); setTimeLeft(0); };

  const toggleSw = () => {
    if (swRunning) { clearInterval(swRef.current); setSwRunning(false); }
    else { setSwRunning(true); swRef.current = setInterval(() => setElapsed(e => e + 100), 100); }
  };
  const resetSw = () => { clearInterval(swRef.current); setSwRunning(false); setElapsed(0); };

  useEffect(() => () => { clearInterval(timerRef.current); clearInterval(swRef.current); }, []);

  const PRESETS = [['1 min', 0, 1, 0], ['5 min', 0, 5, 0], ['10 min', 0, 10, 0], ['25 min', 0, 25, 0], ['1h', 1, 0, 0]];

  return (
    <div className="tool-page">
      <PageHeader title="⏱️ Minuteur" onBack={() => navigate('/outils')} />
      <div className="tool-page-body" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 4, width: '100%', maxWidth: 320 }}>
          {['timer', 'stopwatch'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', fontWeight: 600, fontSize: '0.82rem', background: tab === t ? 'var(--cat-outils)' : 'transparent', color: tab === t ? '#fff' : 'var(--text2)', cursor: 'pointer', transition: 'all 0.2s' }}>
              {t === 'timer' ? 'Minuteur' : 'Chrono'}
            </button>
          ))}
        </div>

        {tab === 'timer' ? (
          <>
            {/* Cercle */}
            <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="200" height="200" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                <circle cx="100" cy="100" r={R} fill="none" stroke="var(--surface2)" strokeWidth="10" />
                <circle cx="100" cy="100" r={R} fill="none" stroke={timerColor} strokeWidth="10" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
              <div style={{ textAlign: 'center', zIndex: 1 }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'JetBrains Mono', color: timerColor }}>{fmt(running || timeLeft > 0 ? timeLeft : total)}</div>
              </div>
            </div>

            {/* Sélecteurs */}
            {!running && timeLeft === 0 && (
              <>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {[['H', h, setH, 24], ['M', m, setM, 60], ['S', s, setS, 60]].map(([l, val, set, max]) => (
                    <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <button onClick={() => set(v => (v + 1) % max)} style={{ background: 'var(--surface2)', border: 'none', borderRadius: 8, width: 36, height: 28, cursor: 'pointer', color: 'var(--text2)' }}>▲</button>
                      <div style={{ fontSize: '1.8rem', fontWeight: 300, minWidth: 48, textAlign: 'center' }}>{String(val).padStart(2, '0')}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{l}</div>
                      <button onClick={() => set(v => (v - 1 + max) % max)} style={{ background: 'var(--surface2)', border: 'none', borderRadius: 8, width: 36, height: 28, cursor: 'pointer', color: 'var(--text2)' }}>▼</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {PRESETS.map(([l, ph, pm, ps]) => <button key={l} className="chip" onClick={() => { setH(ph); setM(pm); setS(ps); }}>{l}</button>)}
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <button onClick={resetTimer} style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text2)', cursor: 'pointer', fontSize: 18 }}>↺</button>
              <button onClick={running ? pauseTimer : startTimer} disabled={total === 0 && !running} style={{ width: 64, height: 64, borderRadius: '50%', border: 'none', background: timerColor, color: '#fff', cursor: 'pointer', fontSize: 24, boxShadow: `0 0 24px ${timerColor}60` }}>
                {running ? '⏸' : '▶'}
              </button>
              <button onClick={() => { clearInterval(timerRef.current); setRunning(false); setTimeLeft(0); }} style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--danger)', cursor: 'pointer', fontSize: 18 }}>■</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '3rem', fontWeight: 200, fontFamily: 'JetBrains Mono', color: 'var(--success)', letterSpacing: 2 }}>{fmtMs(elapsed)}</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={toggleSw} style={{ width: 64, height: 64, borderRadius: '50%', border: 'none', background: 'var(--success)', color: '#fff', cursor: 'pointer', fontSize: 24 }}>{swRunning ? '⏸' : '▶'}</button>
              <button onClick={resetSw} style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--danger)', cursor: 'pointer', fontSize: 18, alignSelf: 'center' }}>■</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── GÉNÉRATEUR ────────────────────────────────────────────────────────────────
export function GeneratorPage() {
  const navigate = useNavigate();
  const [tab, setTab]       = useState('password');
  const [generated, setGen] = useState('');
  const [pwLen, setPwLen]   = useState(16);
  const [pwUpper, setPwU]   = useState(true);
  const [pwNums, setPwN]    = useState(true);
  const [pwSyms, setPwS]    = useState(true);
  const [copied, setCopied] = useState(false);

  const genPassword = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (pwUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (pwNums)  chars += '0123456789';
    if (pwSyms)  chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    setGen(Array.from({ length: pwLen }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
  };

  const genUUID = () => {
    const h = () => Math.floor(Math.random() * 16).toString(16);
    setGen(`${Array(8).fill(0).map(h).join('')}-${Array(4).fill(0).map(h).join('')}-4${Array(3).fill(0).map(h).join('')}-${(8+Math.floor(Math.random()*4)).toString(16)}${Array(3).fill(0).map(h).join('')}-${Array(12).fill(0).map(h).join('')}`);
  };

  const genColor = () => {
    const r = Math.floor(Math.random()*256), g = Math.floor(Math.random()*256), b = Math.floor(Math.random()*256);
    setGen(`#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}\nRGB(${r}, ${g}, ${b})`);
  };

  const copy = () => { navigator.clipboard.writeText(generated); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const colorHex = tab === 'color' && generated ? generated.split('\n')[0] : null;

  return (
    <div className="tool-page">
      <PageHeader title="🎲 Générateur" onBack={() => navigate('/outils')} />
      <div className="tool-page-body">
        <div style={{ display: 'flex', gap: 6 }}>
          {[['password','🔑 Mot de passe'], ['uuid','🔖 UUID'], ['color','🎨 Couleur']].map(([k, l]) => (
            <button key={k} className={`chip ${tab === k ? 'active' : ''}`} onClick={() => { setTab(k); setGen(''); }}>{l}</button>
          ))}
        </div>

        {tab === 'password' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="input-label">Longueur</span>
                <span style={{ color: 'var(--cat-outils)', fontWeight: 700 }}>{pwLen}</span>
              </div>
              <input type="range" min="6" max="64" value={pwLen} onChange={e => setPwLen(+e.target.value)} style={{ width: '100%', accentColor: 'var(--cat-outils)' }} />
            </div>
            {[['Majuscules', pwUpper, setPwU], ['Chiffres', pwNums, setPwN], ['Symboles', pwSyms, setPwS]].map(([l, v, s]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{l}</span>
                <div className={`toggle ${v ? 'on' : ''}`} onClick={() => s(!v)} />
              </div>
            ))}
          </div>
        )}

        <Button full onClick={tab === 'password' ? genPassword : tab === 'uuid' ? genUUID : genColor}>
          🎲 Générer
        </Button>

        {generated && (
          <div>
            {colorHex && <div style={{ height: 60, borderRadius: 12, background: colorHex, marginBottom: 10 }} />}
            <div onClick={copy} style={{ background: 'var(--surface)', border: '1px solid rgba(91,139,255,0.3)', borderRadius: 14, padding: 20, fontFamily: 'JetBrains Mono', fontSize: '0.9rem', color: 'var(--cat-outils)', cursor: 'pointer', whiteSpace: 'pre-wrap', wordBreak: 'break-all', textAlign: 'center' }}>
              {generated}
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 8 }}>{copied ? '✅ Copié !' : '👆 Cliquer pour copier'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── NOTES RAPIDES ─────────────────────────────────────────────────────────────
export function QuickNotePage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useLocal('orion_quicknotes', []);
  const [input, setInput] = useState('');

  const add = () => {
    if (!input.trim()) return;
    setNotes(prev => [{ id: Date.now(), text: input.trim(), ts: Date.now() }, ...prev]);
    setInput('');
  };

  return (
    <div className="tool-page">
      <PageHeader title="📌 Notes Rapides" subtitle={`${notes.length} note${notes.length !== 1 ? 's' : ''}`} onBack={() => navigate('/outils')} actions={notes.length > 0 ? <Button variant="ghost" size="sm" onClick={() => setNotes([])}>Tout effacer</Button> : null} />
      <div className="tool-page-body">
        <div style={{ display: 'flex', gap: 10 }}>
          <input autoFocus className="input" placeholder="Note rapide..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} style={{ flex: 1 }} />
          <button onClick={add} style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--cat-outils)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20, flexShrink: 0 }}>+</button>
        </div>

        {notes.length === 0
          ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>Aucune note — tape et appuie sur Entrée</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notes.map(n => (
                <div key={n.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', animation: 'fadeIn 0.2s ease' }}>
                  <span style={{ flex: 1, fontSize: '0.9rem', lineHeight: 1.5 }}>{n.text}</span>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => navigator.clipboard.writeText(n.text)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14 }}>📋</button>
                    <button onClick={() => setNotes(prev => prev.filter(x => x.id !== n.id))} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14 }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}
