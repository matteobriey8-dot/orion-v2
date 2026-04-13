import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Chips, Textarea, ResultBox } from 'components/ui/index.jsx';
import { useAI } from 'hooks/useAI';

// ── Composant générique IA ────────────────────────────────────────────────────
function AIOutilTool({ icon, title, children, result, loading, error, onGenerate, disabled }) {
  const navigate = useNavigate();
  return (
    <div className="tool-page">
      <PageHeader title={`${icon} ${title}`} onBack={() => navigate('/outils')} />
      <div className="tool-page-body">
        {children}
        {error && <div className="alert alert-error">{error}</div>}
        <Button full loading={loading} onClick={onGenerate} disabled={disabled}>✦ {title}</Button>
        <ResultBox result={result} onRegenerate={onGenerate} />
      </div>
    </div>
  );
}

// ── QR CODE ───────────────────────────────────────────────────────────────────
export function QrCodePage() {
  const navigate = useNavigate();
  const [type, setType]    = useState('Texte');
  const [content, setContent] = useState('');
  const [generated, setGenerated] = useState(false);

  const TYPES = ['Texte', 'URL', 'Email', 'Téléphone', 'WiFi'];
  const placeholders = { Texte: 'Ton texte ici...', URL: 'https://exemple.com', Email: 'contact@exemple.com', Téléphone: '+33 6 12 34 56 78', WiFi: 'SSID:MonWifi;T:WPA;P:MotDePasse;;' };

  // QR code visuel simplifié (pattern fixe pour la démo)
  const QR_PATTERN = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,1,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,0,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,0,1,0,1,0,1],
    [0,1,0,0,1,0,0,0,1,0,1,0,0,1,0,1,0,1,0],
    [1,0,1,0,1,1,1,0,0,1,0,1,0,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,1,1,0,1,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,0,1,0,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,1,0,1,0],
    [1,0,1,1,1,0,1,0,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,0,1,0,0,0],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,1,1,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1,0,0,0,1,0],
  ];

  return (
    <div className="tool-page">
      <PageHeader title="📱 QR Code" onBack={() => navigate('/outils')} />
      <div className="tool-page-body">
        <Chips label="Type" options={TYPES} value={type} onChange={t => { setType(t); setGenerated(false); setContent(''); }} />
        <textarea className="input textarea" placeholder={placeholders[type]} value={content} onChange={e => { setContent(e.target.value); setGenerated(false); }} style={{ minHeight: 80 }} />
        <Button full onClick={() => content.trim() && setGenerated(true)} disabled={!content.trim()}>
          📱 Générer le QR Code
        </Button>

        {generated && content.trim() && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, animation: 'fadeIn 0.3s ease' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, display: 'inline-block' }}>
              <svg width="190" height="190" viewBox="0 0 19 19">
                {QR_PATTERN.map((row, ri) => row.map((cell, ci) => cell ? <rect key={`${ri}-${ci}`} x={ci} y={ri} width="1" height="1" fill="#000" /> : null))}
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{type}</div>
              <div style={{ color: 'var(--text3)', fontSize: '0.8rem', marginTop: 2, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{content}</div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '8px 14px', fontSize: '0.8rem', color: 'var(--warning)' }}>
              💡 Intègre la lib <code>qrcode.react</code> pour de vrais QR codes
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FINANCE IA ────────────────────────────────────────────────────────────────
export function FinancePage() {
  const { result, loading, error, generate } = useAI();
  const [type, setType]     = useState('Investissement');
  const [question, setQuestion] = useState('');
  const TYPES = ['Investissement', 'Bourse', 'Immobilier', 'Épargne', 'Retraite', 'Crypto'];
  return (
    <AIOutilTool icon="📈" title="Analyser" result={result} loading={loading} error={error} disabled={!question.trim()}
      onGenerate={() => generate(`Analyse financière sur : ${type}. Question : ${question}
📊 ANALYSE : explication claire
✅ AVANTAGES
⚠️ RISQUES
🎯 STRATÉGIE RECOMMANDÉE
💡 CONSEILS PRATIQUES
⚠️ Note : information générale, pas un conseil financier officiel.`, 'Finance IA')}>
      <Chips label="Type d'analyse" options={TYPES} value={type} onChange={setType} />
      <Textarea label="Ta question financière" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ex: Comment commencer à investir avec 500€ ?" style={{ minHeight: 100 }} />
    </AIOutilTool>
  );
}

// ── CRYPTO ────────────────────────────────────────────────────────────────────
export function CryptoPage() {
  const { result, loading, error, generate } = useAI();
  const [type, setType]     = useState('Analyse crypto');
  const [question, setQuestion] = useState('');
  const TYPES = ['Analyse crypto', 'DeFi', 'NFT', 'Wallets', 'Fiscalité', 'Débutant'];
  return (
    <AIOutilTool icon="₿" title="Analyser" result={result} loading={loading} error={error} disabled={!question.trim()}
      onGenerate={() => generate(`Expert en cryptomonnaies. Sujet : ${type}. Question : ${question}
📈 ANALYSE DÉTAILLÉE
✅ CE QU'IL FAUT SAVOIR
⚠️ RISQUES IMPORTANTS
🛡️ BONNES PRATIQUES DE SÉCURITÉ
💡 CONSEILS PRATIQUES
Note : crypto = volatil et risqué.`, 'Crypto')}>
      <Chips label="Sujet" options={TYPES} value={type} onChange={setType} />
      <Textarea label="Ta question" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ex: Qu'est-ce que le Bitcoin halving ?" style={{ minHeight: 80 }} />
    </AIOutilTool>
  );
}

// ── BUDGET OUTIL ──────────────────────────────────────────────────────────────
export function BudgetPage() {
  const { result, loading, error, generate } = useAI();
  const [method, setMethod] = useState('50/30/20');
  const [infos, setInfos]   = useState('');
  const METHODS = ['50/30/20', 'Base zéro', 'Enveloppes', 'Analyse libre'];
  return (
    <AIOutilTool icon="💳" title="Créer mon budget" result={result} loading={loading} error={error} disabled={!infos.trim()}
      onGenerate={() => generate(`Budget mensuel méthode ${method}. Infos : ${infos}
💰 RÉPARTITION avec montants
📊 TABLEAU par catégorie
💾 OBJECTIF ÉPARGNE
✂️ OÙ ÉCONOMISER
⚡ ACTIONS CETTE SEMAINE`, 'Budget')}>
      <Chips label="Méthode" options={METHODS} value={method} onChange={setMethod} />
      <Textarea label="Revenus, dépenses, objectifs" value={infos} onChange={e => setInfos(e.target.value)} placeholder="2000€ nets, loyer 700€, objectif épargner 200€/mois..." style={{ minHeight: 100 }} />
    </AIOutilTool>
  );
}

// ── MODE ÉTUDIANT ─────────────────────────────────────────────────────────────
export function StudentPage() {
  const { result, loading, error, generate } = useAI();
  const [type, setType]     = useState('Fiche de révision');
  const [subject, setSubject] = useState('');
  const TYPES = ['Fiche de révision', 'Plan d\'étude', 'Explication', 'Rédaction', 'Maths/Sciences', 'Méthode'];
  return (
    <AIOutilTool icon="🎓" title="M'aider" result={result} loading={loading} error={error} disabled={!subject.trim()}
      onGenerate={() => generate(`Aide étudiant - Type : ${type}. Sujet : ${subject}
${type === 'Fiche de révision' ? 'Structure claire, points clés numérotés, mémorisable, exemples.' : ''}
${type === 'Explication' ? 'Pédagogique, exemples concrets, progression logique.' : ''}
${type === 'Maths/Sciences' ? 'Méthode pas à pas, formules, applications pratiques.' : ''}
Sois clair, encourageant et efficace.`, 'Étudiant')}>
      <Chips label="Type d'aide" options={TYPES} value={type} onChange={setType} />
      <Textarea label="Matière / sujet / question" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Ex: Expliquer la photosynthèse, méthode dissertation..." style={{ minHeight: 100 }} />
    </AIOutilTool>
  );
}

// ── MODE FREELANCE ────────────────────────────────────────────────────────────
export function FreelancePage() {
  const { result, loading, error, generate } = useAI();
  const [type, setType]     = useState('Devis');
  const [context, setContext] = useState('');
  const TYPES = ['Devis', 'Contrat', 'Calculer TJM', 'Email client', 'Relance', 'Proposition'];
  return (
    <AIOutilTool icon="💼" title="Générer" result={result} loading={loading} error={error} disabled={!context.trim()}
      onGenerate={() => generate(`Expert freelance. Génère : ${type}. Contexte : ${context}
${type === 'Devis' ? 'Montants, prestations détaillées, conditions, validité.' : ''}
${type === 'Calculer TJM' ? 'Calcul basé sur revenus souhaités, charges, jours travaillés.' : ''}
${type === 'Contrat' ? 'Clauses essentielles, livrables, paiement, propriété intellectuelle.' : ''}
Adapté au contexte français (auto-entrepreneur/SASU).`, 'Freelance')}>
      <Chips label="Type" options={TYPES} value={type} onChange={setType} />
      <Textarea label="Contexte de la mission" value={context} onChange={e => setContext(e.target.value)} placeholder="Type de mission, compétences, durée, budget estimé..." style={{ minHeight: 100 }} />
    </AIOutilTool>
  );
}

// ── ACTUALITÉS IA ─────────────────────────────────────────────────────────────
export function NewsPage() {
  const { result, loading, error, generate } = useAI();
  const [domain, setDomain]   = useState('Tech & IA');
  const [question, setQuestion] = useState('');
  const DOMAINS = ['Tech & IA', 'Économie', 'Politique', 'Science', 'Environnement', 'Culture', 'Sport'];
  return (
    <AIOutilTool icon="📰" title="Résumer l'actualité" result={result} loading={loading} error={error}
      onGenerate={() => generate(`Résumé actualité : ${domain}. ${question ? `Question : ${question}` : ''}
📰 CONTEXTE GÉNÉRAL
🔥 POINTS CHAUDS
📊 TENDANCES IMPORTANTES
💡 ANALYSE : ce que ça signifie
🔗 SOURCES RECOMMANDÉES pour suivre ce domaine
Note : mes données ont une date limite, pour l'actu très récente consulte les sources directes.`, 'Actualités')}>
      <Chips label="Domaine" options={DOMAINS} value={domain} onChange={setDomain} />
      <div className="input-group">
        <label className="input-label">Question spécifique (optionnel)</label>
        <input className="input" placeholder="Ex: Qu'est-ce qui se passe avec l'IA en ce moment ?" value={question} onChange={e => setQuestion(e.target.value)} />
      </div>
    </AIOutilTool>
  );
}

// ── AIDE JURIDIQUE ────────────────────────────────────────────────────────────
export function LegalPage() {
  const { result, loading, error, generate } = useAI();
  const [domain, setDomain] = useState('Droit du travail');
  const [question, setQuestion] = useState('');
  const DOMAINS = ['Droit du travail', 'Contrats', 'Consommateur', 'Logement', 'Famille', 'Entreprise'];
  return (
    <AIOutilTool icon="⚖️" title="Obtenir des infos" result={result} loading={loading} error={error} disabled={!question.trim()}
      onGenerate={() => generate(`Question juridique - Domaine : ${domain} (droit français). Situation : ${question}
⚖️ CADRE LÉGAL : lois applicables
📋 TES DROITS
🔄 DÉMARCHES à suivre
⏱️ DÉLAIS LÉGAUX si applicable
📞 QUI CONTACTER
⚠️ Information générale uniquement. Pour ton cas, consulte un avocat ou association d'aide juridique.`, 'Juridique')}>
      <Chips label="Domaine juridique" options={DOMAINS} value={domain} onChange={setDomain} />
      <Textarea label="Ta question / situation" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Décris ta situation juridique..." style={{ minHeight: 100 }} />
    </AIOutilTool>
  );
}

// ── ASSISTANT CODE ────────────────────────────────────────────────────────────
export function CodePage() {
  const { result, loading, error, generate } = useAI();
  const [lang, setLang]     = useState('JavaScript');
  const [request, setRequest] = useState('');
  const LANGS = ['JavaScript', 'Python', 'TypeScript', 'React', 'Node.js', 'SQL', 'Bash', 'Dart'];
  return (
    <AIOutilTool icon="💻" title="Générer du code" result={result} loading={loading} error={error} disabled={!request.trim()}
      onGenerate={() => generate(`Expert en ${lang}. Demande : ${request}
💻 CODE : solution complète et commentée en ${lang}
📖 EXPLICATION : ce que fait chaque partie importante
⚠️ POINTS D'ATTENTION
🚀 OPTIMISATIONS possibles
🧪 COMMENT TESTER
Code propre et production-ready.`, 'Code')}>
      <Chips label="Langage" options={LANGS} value={lang} onChange={setLang} />
      <Textarea label="Ton problème / ce que tu veux créer" value={request} onChange={e => setRequest(e.target.value)} placeholder="Ex: Fonction pour trier un tableau d'objets par date..." style={{ minHeight: 100 }} />
    </AIOutilTool>
  );
}

// ── TRADUCTEUR OUTILS ─────────────────────────────────────────────────────────
export function TranslateToolPage() {
  const { result, loading, error, generate } = useAI();
  const [target, setTarget] = useState('Anglais');
  const [text, setText]     = useState('');
  const LANGS = ['Anglais', 'Espagnol', 'Allemand', 'Italien', 'Japonais', 'Arabe', 'Chinois', 'Portugais'];
  return (
    <AIOutilTool icon="🌍" title="Traduire" result={result} loading={loading} error={error} disabled={!text.trim()}
      onGenerate={() => generate(`Traduis en ${target} :

${text}

1. Traduction naturelle et fluide
2. Alternatives si expressions complexes
3. Notes culturelles si nécessaire`, 'Traducteur')}>
      <Chips label="Langue cible" options={LANGS} value={target} onChange={setTarget} />
      <Textarea label="Texte à traduire" value={text} onChange={e => setText(e.target.value)} placeholder="Colle ton texte ici..." style={{ minHeight: 140 }} />
    </AIOutilTool>
  );
}
