import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Chips, Textarea, ResultBox } from 'components/ui/index.jsx';
import { useAI } from 'hooks/useAI';

// ── HUB ───────────────────────────────────────────────────────────────────────
const TOOLS = [
  { icon: '❤️',  label: 'Score de Vie',        path: '/intelligence/lifescore',   sub: 'Évalue ton bien-être' },
  { icon: '⚖️',  label: 'Décision IA',          path: '/intelligence/decision',    sub: 'Aide à décider' },
  { icon: '📰',  label: 'Briefing Quotidien',   path: '/intelligence/briefing',    sub: 'Résumé IA du jour' },
  { icon: '🎓',  label: 'Coach IA',             path: '/intelligence/coach',       sub: 'Conseils personnalisés' },
  { icon: '🚀',  label: 'Simulation Avenir',    path: '/intelligence/simulation',  sub: 'Visualise ton futur' },
  { icon: '👤',  label: 'Twin IA',              path: '/intelligence/twin',        sub: 'Ton double numérique' },
  { icon: '💜',  label: 'IA Sentimentale',      path: '/intelligence/sentiment',   sub: 'Analyse tes émotions' },
  { icon: '📈',  label: 'Prédictions',          path: '/intelligence/predictions', sub: 'Anticipations perso' },
  { icon: '🔍',  label: 'Analyse Texte',        path: '/intelligence/analyze',     sub: 'Résume et explique' },
  { icon: '💡',  label: 'Questions Profondes',  path: '/intelligence/questions',   sub: 'Réflexions IA' },
  { icon: '🎲',  label: 'Décision Quantique',   path: '/intelligence/quantum',     sub: 'Hasard guidé' },
  { icon: '🪞',  label: 'Mind Mirror',          path: '/intelligence/mirror',      sub: 'Connais-toi mieux' },
];

export function IntelligenceHub() {
  const navigate = useNavigate();
  return (
    <div className="tool-page">
      <PageHeader title="🧠 Intelligence IA" subtitle="12 outils pour mieux penser et décider" />
      <div className="tool-page-body">
        <div className="hub-grid">
          {TOOLS.map((t) => (
            <div key={t.path} className="hub-card" onClick={() => navigate(t.path)}>
              <div className="hub-card-icon" style={{ background: 'rgba(139,92,246,0.12)', fontSize: 22 }}>{t.icon}</div>
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

// ── SCORE DE VIE ──────────────────────────────────────────────────────────────
const AREAS = [
  { key: 'health',    label: 'Santé',         icon: '❤️' },
  { key: 'work',      label: 'Travail',        icon: '💼' },
  { key: 'relations', label: 'Relations',      icon: '👥' },
  { key: 'finance',   label: 'Finances',       icon: '💰' },
  { key: 'creative',  label: 'Créativité',     icon: '🎨' },
  { key: 'wellness',  label: 'Bien-être',      icon: '🧘' },
  { key: 'learning',  label: 'Apprentissage',  icon: '📚' },
  { key: 'fun',       label: 'Loisirs',        icon: '🎯' },
];

export function LifeScorePage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [scores, setScores] = useState(Object.fromEntries(AREAS.map(a => [a.key, 5])));
  const [submitted, setSubmitted] = useState(false);

  const global = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / AREAS.length);

  const scoreColor = global >= 8 ? 'var(--success)' : global >= 6 ? 'var(--warning)' : global >= 4 ? 'var(--accent)' : 'var(--danger)';
  const scoreLabel = global >= 8 ? 'Excellent' : global >= 6 ? 'Bien' : global >= 4 ? 'Moyen' : 'À améliorer';

  const handleAnalyze = () => {
    setSubmitted(true);
    const list = AREAS.map(a => `${a.label}: ${scores[a.key]}/10`).join(', ');
    generate(`Voici les scores de vie d'un utilisateur : ${list}. Score global : ${global}/10.
Donne une analyse bienveillante en 3 parties :
1. Ce qui va bien (2 points positifs)
2. Ce qui mérite attention (2 axes d'amélioration)
3. Un conseil concret et motivant pour cette semaine
Sois direct, chaleureux, précis. Maximum 150 mots.`, 'Score de Vie');
  };

  const reset = () => { setSubmitted(false); generate(''); };

  return (
    <div className="tool-page">
      <PageHeader title="❤️ Score de Vie" subtitle="Évalue ton bien-être global" onBack={() => navigate('/intelligence')}
        actions={submitted ? <Button variant="ghost" size="sm" onClick={reset}>Reset</Button> : null} />
      <div className="tool-page-body">

        {/* Score global affiché si soumis */}
        {submitted && (
          <div style={{ background: `${scoreColor}18`, border: `1px solid ${scoreColor}40`, borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, animation: 'fadeIn 0.3s ease' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Score Global</div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{global}<span style={{ fontSize: '1.2rem', color: 'var(--text3)' }}>/10</span></div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ background: scoreColor, color: '#fff', display: 'inline-block', padding: '4px 14px', borderRadius: 20, fontWeight: 700, fontSize: '0.9rem' }}>{scoreLabel}</div>
            </div>
          </div>
        )}

        {/* Info */}
        {!submitted && (
          <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 14, padding: 14, display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 18 }}>ℹ️</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text2)', margin: 0 }}>Note chaque domaine de 0 à 10, puis obtiens une analyse IA personnalisée.</p>
          </div>
        )}

        {/* Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {AREAS.map(area => (
            <div key={area.key} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{area.icon}</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', flex: 1 }}>{area.label}</span>
                <div style={{ background: `${scoreColor}20`, color: scoreColor, fontWeight: 700, padding: '2px 10px', borderRadius: 8, fontSize: '0.9rem', minWidth: 36, textAlign: 'center' }}>{scores[area.key]}</div>
              </div>
              <input type="range" min="0" max="10" value={scores[area.key]}
                onChange={e => !submitted && setScores(prev => ({ ...prev, [area.key]: +e.target.value }))}
                disabled={submitted}
                style={{ width: '100%', accentColor: scoreColor, cursor: submitted ? 'not-allowed' : 'pointer' }}
              />
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {!submitted && (
          <Button full loading={loading} onClick={handleAnalyze}>
            ✦ Analyser avec IA
          </Button>
        )}

        <ResultBox result={result} onRegenerate={submitted ? handleAnalyze : undefined} />
      </div>
    </div>
  );
}

// ── DÉCISION IA ───────────────────────────────────────────────────────────────
export function DecisionPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [question, setQuestion]   = useState('');
  const [options, setOptions]     = useState(['', '']);
  const [context, setContext]     = useState('');
  const [mode, setMode]           = useState('Équilibré');

  const MODES = ['Rationnel', 'Équilibré', 'Intuitif', 'Long terme'];

  const addOption  = () => options.length < 5 && setOptions([...options, '']);
  const removeOpt  = (i) => options.length > 2 && setOptions(options.filter((_, idx) => idx !== i));
  const updateOpt  = (i, v) => setOptions(options.map((o, idx) => idx === i ? v : o));

  const handleAnalyze = () => {
    if (!question.trim()) return;
    const opts = options.filter(o => o.trim());
    if (opts.length < 2) return;
    const list = opts.map((o, i) => `${i + 1}. ${o}`).join('\n');
    generate(`Tu es conseiller en prise de décision. Mode : ${mode}.
Question : ${question}
Options :
${list}
${context ? `Contexte : ${context}` : ''}

Analyse chaque option (avantages, risques, score /10), recommande la meilleure avec justification claire.
Structure :
**Analyse des options**
[Pour chaque option]

**Recommandation**
[Option + pourquoi]

**Conseil final**
[1 phrase motivante]`, 'Décision IA');
  };

  return (
    <div className="tool-page">
      <PageHeader title="⚖️ Décision IA" subtitle="Prends de meilleures décisions" onBack={() => navigate('/intelligence')} />
      <div className="tool-page-body">

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label className="input-label">Quelle décision dois-tu prendre ?</label>
            <input className="input" placeholder="Ex: Changer de travail ou rester ?" value={question} onChange={e => setQuestion(e.target.value)} />
          </div>

          {/* Options */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label className="input-label">Options</label>
              {options.length < 5 && <button className="btn btn-ghost btn-sm" onClick={addOption} type="button">+ Ajouter</button>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 28, height: 28, background: 'var(--accent-soft)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>{i + 1}</div>
                  <input className="input" placeholder={`Option ${i + 1}`} value={opt} onChange={e => updateOpt(i, e.target.value)} style={{ flex: 1 }} />
                  {options.length > 2 && <button onClick={() => removeOpt(i)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 18, padding: '0 4px' }}>✕</button>}
                </div>
              ))}
            </div>
          </div>

          <Textarea label="Contexte (optionnel)" value={context} onChange={e => setContext(e.target.value)} placeholder="Infos importantes, contraintes, valeurs..." style={{ minHeight: 80 }} />

          <Chips label="Mode d'analyse" options={MODES} value={mode} onChange={setMode} />

          {error && <div className="alert alert-error">{error}</div>}
          <Button full loading={loading} onClick={handleAnalyze} disabled={!question.trim() || options.filter(o => o.trim()).length < 2}>
            ✦ Analyser ma décision
          </Button>
          <ResultBox result={result} onRegenerate={handleAnalyze} />
        </div>
      </div>
    </div>
  );
}

// ── BRIEFING QUOTIDIEN ────────────────────────────────────────────────────────
export function BriefingPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [mood, setMood]         = useState('');
  const [priorities, setPrio]   = useState('');
  const [worries, setWorries]   = useState('');
  const [generated, setGenerated] = useState(false);

  const MOODS = ['Excellent 🔥', 'Bien 😊', 'Moyen 😐', 'Fatigué 😴', 'Stressé 😰'];

  const hour = new Date().getHours();
  const moment = hour < 12 ? 'matin' : hour < 18 ? 'après-midi' : 'soir';
  const dayStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  const handleGenerate = () => {
    if (!mood) return;
    setGenerated(true);
    generate(`Crée un briefing personnalisé pour ce ${moment}.
Humeur : ${mood}
${priorities ? `Priorités du jour : ${priorities}` : ''}
${worries ? `Préoccupations : ${worries}` : ''}

Fournis :
1. Message d'accueil motivant adapté à l'humeur (2 phrases)
2. 3 conseils concrets pour cette journée
3. Une citation inspirante courte
4. Un rappel bienveillant pour prendre soin de soi
Ton chaleureux, direct, énergisant. Maximum 200 mots.`, 'Briefing');
  };

  return (
    <div className="tool-page">
      <PageHeader title="📰 Briefing Quotidien" subtitle="Commence ta journée avec ORION" onBack={() => navigate('/intelligence')}
        actions={generated ? <Button variant="ghost" size="sm" onClick={() => { setGenerated(false); }}>Nouveau</Button> : null} />
      <div className="tool-page-body">

        {/* Date */}
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(91,139,255,0.08))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 16, padding: '20px 24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 4 }}>{dayStr}</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Bonjour !</h2>
          <p style={{ color: 'var(--text3)', fontSize: '0.875rem', margin: 0 }}>Comment tu te sens aujourd'hui ?</p>
        </div>

        {!generated ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Humeur */}
            <div>
              <div className="input-label" style={{ marginBottom: 8 }}>Ton humeur du moment</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {MOODS.map(m => (
                  <button key={m} type="button" className={`chip ${mood === m ? 'active' : ''}`} onClick={() => setMood(m)}>{m}</button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Tes priorités du jour (optionnel)</label>
              <input className="input" placeholder="Ex: Finir le rapport, appel 14h, sport..." value={priorities} onChange={e => setPrio(e.target.value)} />
            </div>

            <div className="input-group">
              <label className="input-label">Quelque chose te préoccupe ? (optionnel)</label>
              <input className="input" placeholder="Ce qui te tracasse..." value={worries} onChange={e => setWorries(e.target.value)} />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <Button full loading={loading} onClick={handleGenerate} disabled={!mood}>
              ✦ Générer mon briefing
            </Button>
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <span className="spinner spinner-accent" style={{ width: 32, height: 32, borderWidth: 3 }} />
              </div>
            ) : (
              <div style={{ background: 'var(--surface)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, background: 'rgba(139,92,246,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✦</div>
                  <div style={{ fontWeight: 700 }}>Ton briefing ORION</div>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '0.9rem', color: 'var(--text)' }}>{result}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
