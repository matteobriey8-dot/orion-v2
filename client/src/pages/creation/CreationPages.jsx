import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Chips, Textarea, ResultBox } from 'components/ui/index.jsx';
import { useAI } from 'hooks/useAI';

// ── HUB ───────────────────────────────────────────────────────────────────────
const TOOLS = [
  { icon: '✉️',  label: 'Email IA',         path: '/creation/email',      sub: 'Emails parfaits' },
  { icon: '📄',  label: 'CV & Lettre',       path: '/creation/cv',         sub: 'CV + lettre de motivation' },
  { icon: '🎬',  label: 'Script TikTok',     path: '/creation/tiktok',     sub: 'Scripts viraux' },
  { icon: '✍️',  label: 'Générateur Texte',  path: '/creation/textgen',    sub: 'Articles, posts, contenus' },
  { icon: '🎭',  label: 'Poème & Créatif',   path: '/creation/poem',       sub: 'Poèmes, slams, histoires' },
  { icon: '🖼️',  label: 'Image IA',          path: '/creation/image',      sub: 'Génère des images' },
  { icon: '🎨',  label: 'Logo Creator',      path: '/creation/logo',       sub: 'Concepts de logo' },
  { icon: '👤',  label: 'Bio Réseaux',       path: '/creation/bio',        sub: 'Bio parfaite' },
  { icon: '📣',  label: 'Slogan & Pub',      path: '/creation/slogan',     sub: 'Accroches percutantes' },
  { icon: '🌍',  label: 'Traducteur Pro',    path: '/creation/translate',  sub: 'Traduction naturelle' },
  { icon: '📋',  label: 'Résumé',            path: '/creation/summary',    sub: 'Résume tout texte' },
  { icon: '💡',  label: 'Brainstorm',        path: '/creation/brainstorm', sub: 'Génère des idées' },
];

export function CreationHub() {
  const navigate = useNavigate();
  return (
    <div className="tool-page">
      <PageHeader title="✨ Création" subtitle="12 outils pour créer du contenu" />
      <div className="tool-page-body">
        <div className="hub-grid">
          {TOOLS.map((t) => (
            <div key={t.path} className="hub-card" onClick={() => navigate(t.path)}>
              <div className="hub-card-icon" style={{ background: 'rgba(245,158,11,0.12)', fontSize: 22 }}>{t.icon}</div>
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

// ── EMAIL IA ──────────────────────────────────────────────────────────────────
export function EmailPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [subject, setSubject] = useState('');
  const [context, setContext] = useState('');
  const [tone, setTone]       = useState('Professionnel');
  const [length, setLength]   = useState('Moyen');

  const TONES   = ['Professionnel', 'Amical', 'Formel', 'Persuasif', 'Urgent'];
  const LENGTHS = ['Court', 'Moyen', 'Long'];
  const lengthMap = { Court: '3-5 lignes', Moyen: '8-12 lignes', Long: '15-20 lignes' };

  const handleGenerate = () => {
    if (!subject.trim()) return;
    generate(`Rédige un email ${tone} en français.
Sujet / objectif : ${subject}
${context ? `Contexte : ${context}` : ''}
Longueur : ${length} (${lengthMap[length]})

Format :
Objet: [objet de l'email]

[Corps avec formule d'ouverture, contenu, formule de politesse]

Sois direct, efficace et adapté au ton demandé.`, 'Email IA');
  };

  return (
    <div className="tool-page">
      <PageHeader title="✉️ Email IA" subtitle="Rédige des emails parfaits" onBack={() => navigate('/creation')} />
      <div className="tool-page-body">
        <div className="input-group">
          <label className="input-label">Sujet / Objectif de l'email</label>
          <input className="input" placeholder="Ex: Demande de réunion, relance client, candidature..." value={subject} onChange={e => setSubject(e.target.value)} />
        </div>
        <Textarea label="Contexte (optionnel)" value={context} onChange={e => setContext(e.target.value)} placeholder="Destinataire, informations importantes..." style={{ minHeight: 80 }} />
        <Chips label="Ton" options={TONES} value={tone} onChange={setTone} />
        <Chips label="Longueur" options={LENGTHS} value={length} onChange={setLength} />
        {error && <div className="alert alert-error">{error}</div>}
        <Button full loading={loading} onClick={handleGenerate} disabled={!subject.trim()}>✦ Générer l'email</Button>
        <ResultBox result={result} onRegenerate={handleGenerate} />
      </div>
    </div>
  );
}

// ── CV & LETTRE ───────────────────────────────────────────────────────────────
export function CvPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate, reset } = useAI();
  const [tab, setTab]           = useState('cv');
  const [name, setName]         = useState('');
  const [role, setRole]         = useState('');
  const [exp, setExp]           = useState('');
  const [skills, setSkills]     = useState('');
  const [poste, setPoste]       = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [motiv, setMotiv]       = useState('');

  const generateCV = () => {
    if (!name.trim() || !role.trim()) return;
    generate(`Génère un résumé professionnel percutant pour un CV en français.
Nom : ${name}
Poste visé : ${role}
${exp ? `Expériences : ${exp}` : ''}
${skills ? `Compétences : ${skills}` : ''}

Fournis :
1. Titre de profil accrocheur (1 ligne)
2. Résumé professionnel (3-4 phrases percutantes)
3. 5 points forts à mettre en avant
4. Suggestions pour optimiser le CV

Sois concis, dynamique et orienté résultats.`, 'CV');
  };

  const generateLettre = () => {
    if (!poste.trim() || !entreprise.trim()) return;
    generate(`Rédige une lettre de motivation professionnelle en français.
Poste : ${poste}
Entreprise : ${entreprise}
${motiv ? `Motivations / points à souligner : ${motiv}` : ''}

La lettre doit :
- Avoir une accroche originale et percutante
- Mettre en valeur 3 compétences clés
- Se terminer par un appel à l'action clair
- Faire environ 250-300 mots

Format avec date, corps, formule de politesse.`, 'Lettre motivation');
  };

  return (
    <div className="tool-page">
      <PageHeader title="📄 CV & Lettre" subtitle="Optimise ta candidature" onBack={() => navigate('/creation')} />
      <div className="tool-page-body">
        {/* Tabs */}
        <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 4, gap: 4 }}>
          {[['cv', '📄 CV'], ['lettre', '📝 Lettre de motivation']].map(([k, l]) => (
            <button key={k} onClick={() => { setTab(k); reset(); }} style={{ flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', fontWeight: 600, fontSize: '0.82rem', background: tab === k ? 'var(--cat-creation)' : 'transparent', color: tab === k ? '#fff' : 'var(--text2)', cursor: 'pointer', transition: 'all 0.2s' }}>{l}</button>
          ))}
        </div>

        {tab === 'cv' ? (
          <>
            <div className="input-group"><label className="input-label">Ton nom</label><input className="input" placeholder="Prénom Nom" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="input-group"><label className="input-label">Poste visé</label><input className="input" placeholder="Ex: Développeur, Chef de projet..." value={role} onChange={e => setRole(e.target.value)} /></div>
            <Textarea label="Expériences clés" value={exp} onChange={e => setExp(e.target.value)} placeholder="Résume tes expériences..." style={{ minHeight: 80 }} />
            <Textarea label="Compétences" value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, gestion de projet, Python..." style={{ minHeight: 60 }} />
            {error && <div className="alert alert-error">{error}</div>}
            <Button full loading={loading} onClick={generateCV} disabled={!name.trim() || !role.trim()}>✦ Optimiser mon CV</Button>
          </>
        ) : (
          <>
            <div className="input-group"><label className="input-label">Poste visé</label><input className="input" placeholder="Ex: Développeur Flutter Senior" value={poste} onChange={e => setPoste(e.target.value)} /></div>
            <div className="input-group"><label className="input-label">Entreprise</label><input className="input" placeholder="Nom de l'entreprise" value={entreprise} onChange={e => setEntreprise(e.target.value)} /></div>
            <Textarea label="Motivations / points forts" value={motiv} onChange={e => setMotiv(e.target.value)} placeholder="Ce qui te différencie, pourquoi cette entreprise..." style={{ minHeight: 100 }} />
            {error && <div className="alert alert-error">{error}</div>}
            <Button full loading={loading} onClick={generateLettre} disabled={!poste.trim() || !entreprise.trim()}>✦ Rédiger la lettre</Button>
          </>
        )}
        <ResultBox result={result} onRegenerate={tab === 'cv' ? generateCV : generateLettre} />
      </div>
    </div>
  );
}

// ── SCRIPT TIKTOK ─────────────────────────────────────────────────────────────
export function TikTokPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [topic, setTopic]       = useState('');
  const [duration, setDuration] = useState('30 sec');
  const [style, setStyle]       = useState('Éducatif');

  const DURATIONS = ['15 sec', '30 sec', '60 sec', '3 min'];
  const STYLES    = ['Éducatif', 'Divertissant', 'Motivant', 'Storytelling', 'Tendance'];

  return (
    <div className="tool-page">
      <PageHeader title="🎬 Script TikTok" subtitle="Scripts viraux en quelques secondes" onBack={() => navigate('/creation')} />
      <div className="tool-page-body">
        <div className="input-group">
          <label className="input-label">Sujet de ta vidéo</label>
          <input className="input" placeholder="Ex: 3 astuces productivité, recette rapide..." value={topic} onChange={e => setTopic(e.target.value)} />
        </div>
        <Chips label="Durée" options={DURATIONS} value={duration} onChange={setDuration} />
        <Chips label="Style" options={STYLES} value={style} onChange={setStyle} />
        {error && <div className="alert alert-error">{error}</div>}
        <Button full loading={loading} disabled={!topic.trim()} onClick={() => generate(`Crée un script TikTok viral de ${duration}, style ${style}.
Sujet : ${topic}

Structure :
🎬 HOOK (0-3 sec) : [Accroche ultra-percutante]
📱 CONTENU (${duration}) : [Script détaillé]
🎯 CTA (dernières 3 sec) : [Call to action fort]
📝 LÉGENDE : [Texte description]
#️⃣ HASHTAGS : [10 hashtags pertinents]

Sois dynamique, phrases courtes, optimisé pour l'engagement.`, 'Script TikTok')}>
          ✦ Générer le script
        </Button>
        <ResultBox result={result} />
      </div>
    </div>
  );
}

// ── GÉNÉRATEUR TEXTE ──────────────────────────────────────────────────────────
export function TextGenPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [topic, setTopic]   = useState('');
  const [context, setContext] = useState('');
  const [type, setType]     = useState('Article');
  const [tone, setTone]     = useState('Professionnel');

  const TYPES = ['Article', 'Post LinkedIn', 'Post Instagram', 'Newsletter', 'Description', 'Pitch'];
  const TONES = ['Professionnel', 'Décontracté', 'Inspirant', 'Expert', 'Humour'];
  const lengthMap = { Article: '400-600 mots', 'Post LinkedIn': '150-200 mots', 'Post Instagram': '80-120 mots', Newsletter: '300-400 mots', Description: '100-150 mots', Pitch: '100-150 mots' };

  return (
    <div className="tool-page">
      <PageHeader title="✍️ Générateur Texte" subtitle="Articles, posts, contenus" onBack={() => navigate('/creation')} />
      <div className="tool-page-body">
        <Chips label="Type de contenu" options={TYPES} value={type} onChange={setType} />
        <div className="input-group">
          <label className="input-label">Sujet</label>
          <input className="input" placeholder="De quoi parle ton contenu ?" value={topic} onChange={e => setTopic(e.target.value)} />
        </div>
        <Textarea label="Contexte / audience (optionnel)" value={context} onChange={e => setContext(e.target.value)} placeholder="Pour qui ? Informations importantes..." style={{ minHeight: 70 }} />
        <Chips label="Ton" options={TONES} value={tone} onChange={setTone} />
        {error && <div className="alert alert-error">{error}</div>}
        <Button full loading={loading} disabled={!topic.trim()} onClick={() => generate(`Rédige un(e) ${type} en français, ton ${tone}.
Sujet : ${topic}
${context ? `Contexte : ${context}` : ''}
Longueur cible : ${lengthMap[type]}
${type === 'Post LinkedIn' ? 'Accroche forte, emojis avec parcimonie, question d\'engagement à la fin.' : ''}
${type === 'Post Instagram' ? 'Style visuel, emojis pertinents, 5 hashtags à la fin.' : ''}
${type === 'Pitch' ? 'Structure : problème → solution → bénéfice → appel à l\'action.' : ''}
Sois original, engageant et adapté.`, 'TextGen')}>
          ✦ Générer le contenu
        </Button>
        <ResultBox result={result} />
      </div>
    </div>
  );
}

// ── POÈME & CRÉATIF ───────────────────────────────────────────────────────────
export function PoemPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [topic, setTopic] = useState('');
  const [type, setType]   = useState('Poème');
  const [mood, setMood]   = useState('Romantique');

  const TYPES = ['Poème', 'Haïku', 'Slam', 'Conte', 'Chanson', 'Nouvelle'];
  const MOODS = ['Romantique', 'Mélancolique', 'Joyeux', 'Mystérieux', 'Épique', 'Humoristique'];

  return (
    <div className="tool-page">
      <PageHeader title="🎭 Créatif" subtitle="Poèmes, slams, histoires" onBack={() => navigate('/creation')} />
      <div className="tool-page-body">
        <Chips label="Format" options={TYPES} value={type} onChange={setType} />
        <div className="input-group">
          <label className="input-label">Thème / Sujet</label>
          <input className="input" placeholder="L'amour, la liberté, une personne, un souvenir..." value={topic} onChange={e => setTopic(e.target.value)} />
        </div>
        <Chips label="Ambiance" options={MOODS} value={mood} onChange={setMood} />
        {error && <div className="alert alert-error">{error}</div>}
        <Button full loading={loading} disabled={!topic.trim()} onClick={() => generate(`Crée un(e) ${type} en français, ambiance ${mood}.
Thème : ${topic}
${type === 'Haïku' ? 'Format haïku strict : 3 lignes, 5-7-5 syllabes.' : ''}
${type === 'Slam' ? 'Style parlé, rythmé, avec des rimes et un message fort.' : ''}
${type === 'Chanson' ? 'Inclus : Couplet 1, Refrain, Couplet 2, Refrain, Pont, Refrain final.' : ''}
Sois créatif, authentique et émotionnellement fort.`, 'Créatif')}>
          ✦ Créer
        </Button>
        <ResultBox result={result} />
      </div>
    </div>
  );
}
