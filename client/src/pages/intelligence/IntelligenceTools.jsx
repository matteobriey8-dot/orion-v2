import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Chips, Textarea, ResultBox } from '../../components/ui/index.jsx';
import { useAI, useChat } from '../../hooks/useAI';
import { MessageBubble, TypingIndicator } from '../../components/chat/MessageBubble';
import ChatInput from '../../components/chat/ChatInput';
import '../../styles/chat.css';

// ── COACH IA ──────────────────────────────────────────────────────────────────
const COACH_MODES = [
  { id: 'productivity', icon: '🚀', label: 'Productivité', prompt: 'Tu es un coach en productivité et performance. Tu aides à optimiser le temps, l\'énergie et les priorités. Poses des questions ciblées et donnes des stratégies concrètes.' },
  { id: 'wellness',     icon: '❤️', label: 'Bien-être',    prompt: 'Tu es un coach en bien-être et équilibre de vie. Tu aides avec la gestion du stress, les habitudes saines et l\'épanouissement personnel.' },
  { id: 'career',       icon: '📈', label: 'Carrière',     prompt: 'Tu es un coach en développement de carrière. Tu aides avec la stratégie professionnelle, les négociations et la croissance.' },
  { id: 'relations',    icon: '👥', label: 'Relations',    prompt: 'Tu es un coach en relations humaines. Tu aides à améliorer la communication, gérer les conflits et renforcer les liens.' },
  { id: 'finance',      icon: '💰', label: 'Finances',     prompt: 'Tu es un coach financier. Tu aides à gérer le budget, épargner, investir et prendre de meilleures décisions financières.' },
];

export function CoachPage() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);
  const { messages, loading, sendMessage, clearMessages } = useChat();

  const handleSelectMode = (mode) => {
    setSelectedMode(mode);
    clearMessages();
    sendMessage(`Bonjour ! Je suis prêt à commencer.`, mode.prompt);
  };

  if (!selectedMode) {
    return (
      <div className="tool-page">
        <PageHeader title="🎓 Coach IA" subtitle="Choisis ton coach spécialisé" onBack={() => navigate('/intelligence')} />
        <div className="tool-page-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {COACH_MODES.map(m => (
              <div key={m.id} className="category-card" onClick={() => handleSelectMode(m)}>
                <div className="category-icon" style={{ background: 'rgba(139,92,246,0.12)', fontSize: 24 }}>{m.icon}</div>
                <div className="category-info">
                  <div className="category-name">Coach {m.label}</div>
                  <div className="category-count">Spécialiste en {m.label.toLowerCase()}</div>
                </div>
                <span style={{ color: 'var(--accent)', fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-page" style={{ height: 'calc(100vh - 53px)' }}>
      <PageHeader
        title={`${selectedMode.icon} Coach ${selectedMode.label}`}
        onBack={() => setSelectedMode(null)}
        actions={<Button variant="ghost" size="sm" onClick={() => { clearMessages(); setSelectedMode(null); }}>Changer</Button>}
      />
      <div className="chat-layout" style={{ height: '100%' }}>
        <div className="chat-messages">
          {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
          {loading && <TypingIndicator />}
        </div>
        <ChatInput onSend={(text) => sendMessage(text, selectedMode.prompt)} disabled={loading} />
      </div>
    </div>
  );
}

// ── ANALYSE TEXTE ─────────────────────────────────────────────────────────────
export function AnalyzePage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [text, setText] = useState('');
  const [type, setType] = useState('Résumé');

  const TYPES = ['Résumé', 'Points clés', 'Analyse critique', 'Simplification', 'Traduction FR', 'Mots-clés'];

  const PROMPTS = {
    'Résumé':           `Résume ce texte en 3-5 phrases claires en français :\n\n${text}`,
    'Points clés':      `Extrait les 5 points clés les plus importants de ce texte (format liste numérotée) :\n\n${text}`,
    'Analyse critique': `Analyse ce texte de façon critique : forces, faiblesses, biais potentiels, qualité de l'argumentation :\n\n${text}`,
    'Simplification':   `Réécris ce texte en langage simple et accessible à tous (niveau lycée) :\n\n${text}`,
    'Traduction FR':    `Traduis ce texte en français naturel et fluide :\n\n${text}`,
    'Mots-clés':        `Extrait les 10 mots-clés et concepts principaux de ce texte, avec une courte définition de chacun :\n\n${text}`,
  };

  return (
    <div className="tool-page">
      <PageHeader title="🔍 Analyse Texte" subtitle="Résume, analyse, explique" onBack={() => navigate('/intelligence')} />
      <div className="tool-page-body">
        <Chips label="Type d'analyse" options={TYPES} value={type} onChange={setType} />
        <Textarea label="Texte à analyser" value={text} onChange={e => setText(e.target.value)} placeholder="Colle ton texte, article, document ici..." style={{ minHeight: 180 }} />
        {error && <div className="alert alert-error">{error}</div>}
        <Button full loading={loading} onClick={() => generate(PROMPTS[type], 'Analyse Texte')} disabled={!text.trim()}>
          ✦ Analyser
        </Button>
        <ResultBox result={result} onRegenerate={() => generate(PROMPTS[type], 'Analyse Texte')} />
      </div>
    </div>
  );
}

// ── SIMULATION AVENIR ─────────────────────────────────────────────────────────
export function SimulationPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [situation, setSituation] = useState('');
  const [horizon, setHorizon]     = useState('1 an');

  const HORIZONS = ['6 mois', '1 an', '3 ans', '5 ans', '10 ans'];

  return (
    <div className="tool-page">
      <PageHeader title="🚀 Simulation Avenir" subtitle="Visualise différents futurs possibles" onBack={() => navigate('/intelligence')} />
      <div className="tool-page-body">
        <Textarea label="Ta situation actuelle" value={situation} onChange={e => setSituation(e.target.value)} placeholder="Décris ta situation, tes choix actuels, tes objectifs..." style={{ minHeight: 120 }} />
        <Chips label="Horizon temporel" options={HORIZONS} value={horizon} onChange={setHorizon} />
        {error && <div className="alert alert-error">{error}</div>}
        <Button full loading={loading} disabled={!situation.trim()} onClick={() => generate(`Simule 3 scénarios d'avenir possibles dans ${horizon} pour cette situation :
${situation}

Pour chaque scénario :
🟢 SCÉNARIO OPTIMISTE : si tout se passe bien
🟡 SCÉNARIO RÉALISTE : évolution probable
🔴 SCÉNARIO PESSIMISTE : si rien ne change

Pour chacun : description, probabilité estimée, actions clés qui mènent à ce résultat.
Sois honnête, constructif et actionnable.`, 'Simulation Avenir')}>
          ✦ Simuler mon avenir
        </Button>
        <ResultBox result={result} onRegenerate={() => generate(`Simule 3 scénarios dans ${horizon} pour : ${situation}`, 'Simulation')} />
      </div>
    </div>
  );
}

// ── QUESTIONS PROFONDES ───────────────────────────────────────────────────────
export function QuestionsPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [theme, setTheme] = useState('Vie & sens');

  const THEMES = ['Vie & sens', 'Relations', 'Travail & argent', 'Identité', 'Peurs', 'Bonheur', 'Valeurs'];

  return (
    <div className="tool-page">
      <PageHeader title="💡 Questions Profondes" subtitle="Réflexions pour mieux te connaître" onBack={() => navigate('/intelligence')} />
      <div className="tool-page-body">
        <Chips label="Thème" options={THEMES} value={theme} onChange={setTheme} />
        <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 14, padding: 16 }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text2)' }}>Ces questions sont conçues pour provoquer une réflexion authentique. Prends le temps d'y répondre honnêtement.</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <Button full loading={loading} onClick={() => generate(`Génère 5 questions profondes et introspectives sur le thème : ${theme}.
Ces questions doivent être suffisamment déstabilisantes pour provoquer une vraie réflexion, pas des questions superficielles.
Pour chaque question : la question elle-même + 1 piste de réflexion pour y répondre.
Format clair et inspirant.`, 'Questions Profondes')}>
          ✦ Générer des questions
        </Button>
        <ResultBox result={result} />
      </div>
    </div>
  );
}

// ── DÉCISION QUANTIQUE ────────────────────────────────────────────────────────
export function QuantumPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [situation, setSituation] = useState('');
  const [flipped, setFlipped]     = useState(false);

  const flip = () => {
    setFlipped(true);
    generate(`Je suis bloqué sur cette décision : ${situation || 'une décision importante'}
L'univers a tranché : ${Math.random() > 0.5 ? 'OUI / OPTION A / AVANCER' : 'NON / OPTION B / ATTENDRE'}

Maintenant : aide-moi à interpréter ce résultat de façon positive et constructive.
Donne-moi 3 raisons pourquoi ce choix peut être le bon, et 2 premières actions concrètes à faire.
Ton ludique mais sincère.`, 'Décision Quantique');
  };

  return (
    <div className="tool-page">
      <PageHeader title="🎲 Décision Quantique" subtitle="Laisse le hasard guidé t'orienter" onBack={() => navigate('/intelligence')} />
      <div className="tool-page-body" style={{ alignItems: 'center' }}>
        <div className="input-group">
          <label className="input-label">Ta décision (optionnel)</label>
          <input className="input" placeholder="Ex: Changer de ville ? Lancer mon projet ?" value={situation} onChange={e => setSituation(e.target.value)} />
        </div>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text3)', marginBottom: 20 }}>L'univers va trancher pour toi. Clique et fais confiance au résultat !</div>
          <button onClick={flip} disabled={loading} style={{ width: 120, height: 120, borderRadius: '50%', background: `linear-gradient(135deg, var(--accent), var(--accent2))`, border: 'none', fontSize: 48, cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 0 40px rgba(124,92,255,0.4)', transform: flipped ? 'rotate(360deg)' : 'none' }}>
            {loading ? '⌛' : '🎲'}
          </button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <ResultBox result={result} />
      </div>
    </div>
  );
}

// ── PLACEHOLDERS ──────────────────────────────────────────────────────────────
export function IntelligencePlaceholder({ icon, title, description }) {
  const navigate = useNavigate();
  return (
    <div className="tool-page">
      <PageHeader title={`${icon} ${title}`} onBack={() => navigate('/intelligence')} />
      <div className="tool-page-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 80, height: 80, background: 'rgba(139,92,246,0.1)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>{icon}</div>
          <h2>{title}</h2>
          <p style={{ maxWidth: 300 }}>{description}</p>
          <span style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--cat-intelligence)', padding: '6px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>Disponible prochainement</span>
        </div>
      </div>
    </div>
  );
}
