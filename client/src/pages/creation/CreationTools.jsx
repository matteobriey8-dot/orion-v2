import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Chips, Textarea, ResultBox } from 'components/ui/index.jsx';
import { useAI } from 'hooks/useAI';

// ── Composant générique pour les outils Création simples ──────────────────────
function SimpleCreationTool({ title, icon, backPath = '/creation', children, result, loading, error }) {
  const navigate = useNavigate();
  return (
    <div className="tool-page">
      <PageHeader title={`${icon} ${title}`} onBack={() => navigate(backPath)} />
      <div className="tool-page-body">
        {children}
        {error && <div className="alert alert-error">{error}</div>}
        {result && <ResultBox result={result} />}
      </div>
    </div>
  );
}

// ── BIO RÉSEAUX ───────────────────────────────────────────────────────────────
export function BioPage() {
  const { result, loading, error, generate } = useAI();
  const [info, setInfo]         = useState('');
  const [platform, setPlatform] = useState('LinkedIn');

  const PLATFORMS = ['Instagram', 'LinkedIn', 'Twitter/X', 'TikTok', 'Général'];

  return (
    <SimpleCreationTool title="Bio Réseaux" icon="👤" result={result} loading={loading} error={error}>
      <Chips label="Plateforme" options={PLATFORMS} value={platform} onChange={setPlatform} />
      <Textarea label="Qui tu es, ce que tu fais" value={info} onChange={e => setInfo(e.target.value)} placeholder="Ton métier, tes passions, ta valeur unique..." style={{ minHeight: 100 }} />
      <Button full loading={loading} disabled={!info.trim()} onClick={() => generate(`Rédige une bio ${platform} percutante en français.
Infos : ${info}
Adapte au format ${platform} (LinkedIn = professionnel 3-4 lignes, Instagram/Twitter = 150 car max).
Propose 3 versions différentes.`, 'Bio Réseaux')}>
        ✦ Générer ma bio
      </Button>
    </SimpleCreationTool>
  );
}

// ── SLOGAN & PUB ─────────────────────────────────────────────────────────────
export function SloganPage() {
  const { result, loading, error, generate } = useAI();
  const [product, setProduct] = useState('');
  const [context, setContext] = useState('');
  const [style, setStyle]     = useState('Mémorable');

  const STYLES = ['Mémorable', 'Humoristique', 'Émotionnel', 'Professionnel', 'Audacieux'];

  return (
    <SimpleCreationTool title="Slogan & Pub" icon="📣" result={result} loading={loading} error={error}>
      <div className="input-group">
        <label className="input-label">Ton produit, service ou marque</label>
        <input className="input" placeholder="Ex: App de méditation, cabinet conseil..." value={product} onChange={e => setProduct(e.target.value)} />
      </div>
      <Textarea label="Valeurs / cible (optionnel)" value={context} onChange={e => setContext(e.target.value)} placeholder="Audience, positionnement, ce qui te différencie..." style={{ minHeight: 70 }} />
      <Chips label="Style" options={STYLES} value={style} onChange={setStyle} />
      <Button full loading={loading} disabled={!product.trim()} onClick={() => generate(`Génère 5 slogans ${style}s en français pour : ${product}
${context ? `Contexte : ${context}` : ''}
Chaque slogan : court (max 8 mots), percutant, mémorable.
Format numéroté avec explication de l'angle.`, 'Slogan')}>
        ✦ Générer des slogans
      </Button>
    </SimpleCreationTool>
  );
}

// ── TRADUCTEUR PRO ────────────────────────────────────────────────────────────
export function TranslatePage() {
  const { result, loading, error, generate } = useAI();
  const [text, setText]     = useState('');
  const [target, setTarget] = useState('Anglais');

  const LANGS = ['Anglais', 'Espagnol', 'Allemand', 'Italien', 'Japonais', 'Arabe', 'Chinois', 'Portugais'];

  return (
    <SimpleCreationTool title="Traducteur Pro" icon="🌍" result={result} loading={loading} error={error}>
      <Chips label="Langue cible" options={LANGS} value={target} onChange={setTarget} />
      <Textarea label="Texte à traduire" value={text} onChange={e => setText(e.target.value)} placeholder="Colle ton texte ici..." style={{ minHeight: 140 }} />
      <Button full loading={loading} disabled={!text.trim()} onClick={() => generate(`Traduis ce texte en ${target} de façon naturelle et adaptée :

${text}

Fournis :
1. Traduction principale
2. Alternatives pour les expressions complexes si nécessaire
3. Notes culturelles si applicable`, 'Traducteur')}>
        ✦ Traduire
      </Button>
    </SimpleCreationTool>
  );
}

// ── RÉSUMÉ ────────────────────────────────────────────────────────────────────
export function SummaryPage() {
  const { result, loading, error, generate } = useAI();
  const [text, setText]     = useState('');
  const [format, setFormat] = useState('Moyen (1 paragraphe)');

  const FORMATS = ['Ultra-court (3 phrases)', 'Moyen (1 paragraphe)', 'Détaillé (points clés)', 'Bullet points'];

  return (
    <SimpleCreationTool title="Résumé" icon="📋" result={result} loading={loading} error={error}>
      <Chips label="Format" options={FORMATS} value={format} onChange={setFormat} />
      <Textarea label="Texte à résumer" value={text} onChange={e => setText(e.target.value)} placeholder="Colle ton texte, article, document..." style={{ minHeight: 180 }} />
      <Button full loading={loading} disabled={!text.trim()} onClick={() => generate(`Résume ce texte en français, format : ${format}

${text}

Sois précis, fidèle au contenu, garde l'essentiel.`, 'Résumé')}>
        ✦ Résumer
      </Button>
    </SimpleCreationTool>
  );
}

// ── BRAINSTORM ────────────────────────────────────────────────────────────────
export function BrainstormPage() {
  const { result, loading, error, generate } = useAI();
  const [topic, setTopic]   = useState('');
  const [context, setContext] = useState('');
  const [mode, setMode]     = useState('10 idées créatives');

  const MODES = ['10 idées créatives', 'Solutions pratiques', 'Idées disruptives', 'Approche 360°'];

  return (
    <SimpleCreationTool title="Brainstorm" icon="💡" result={result} loading={loading} error={error}>
      <Chips label="Mode" options={MODES} value={mode} onChange={setMode} />
      <div className="input-group">
        <label className="input-label">Problème ou projet à explorer</label>
        <input className="input" placeholder="Ex: Comment augmenter mes ventes, idées app mobile..." value={topic} onChange={e => setTopic(e.target.value)} />
      </div>
      <Textarea label="Contraintes / contexte (optionnel)" value={context} onChange={e => setContext(e.target.value)} placeholder="Budget, délai, cible, ressources disponibles..." style={{ minHeight: 70 }} />
      <Button full loading={loading} disabled={!topic.trim()} onClick={() => generate(`Brainstorming : ${mode} pour :
${topic}
${context ? `Contexte : ${context}` : ''}

Sois créatif, varié, inclus des idées inattendues.
Numérote chaque idée avec une phrase d'explication.`, 'Brainstorm')}>
        ✦ Générer des idées
      </Button>
    </SimpleCreationTool>
  );
}

// ── IMAGE IA ──────────────────────────────────────────────────────────────────
export function ImageAiPage() {
  const { result, loading, error, generate } = useAI();
  const [desc, setDesc]   = useState('');
  const [style, setStyle] = useState('Réaliste');

  const STYLES = ['Réaliste', 'Illustration', 'Anime', 'Abstrait', 'Photo', '3D', 'Vintage'];

  return (
    <SimpleCreationTool title="Image IA" icon="🖼️" result={result} loading={loading} error={error}>
      <Chips label="Style visuel" options={STYLES} value={style} onChange={setStyle} />
      <Textarea label="Décris l'image que tu veux" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ex: Un dragon bleu survolant une ville futuriste au coucher du soleil..." style={{ minHeight: 100 }} />
      <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: 14 }}>
        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text2)' }}>
          💡 ORION va optimiser ton prompt pour Midjourney, DALL-E ou Stable Diffusion.
        </p>
      </div>
      <Button full loading={loading} disabled={!desc.trim()} onClick={() => generate(`Optimise ce prompt pour générer une image IA de qualité.
Description : ${desc}
Style : ${style}

Fournis :
1. Prompt optimisé en anglais (pour Midjourney/DALL-E)
2. Version français pour référence
3. Tags de style supplémentaires recommandés
4. Résolution et ratio suggérés`, 'Image IA')}>
        ✦ Optimiser le prompt
      </Button>
    </SimpleCreationTool>
  );
}

// ── LOGO CREATOR ─────────────────────────────────────────────────────────────
export function LogoPage() {
  const { result, loading, error, generate } = useAI();
  const [brand, setBrand]   = useState('');
  const [context, setContext] = useState('');
  const [style, setStyle]   = useState('Minimaliste');

  const STYLES = ['Minimaliste', 'Moderne', 'Vintage', 'Tech', 'Créatif', 'Luxe'];

  return (
    <SimpleCreationTool title="Logo Creator" icon="🎨" result={result} loading={loading} error={error}>
      <div className="input-group">
        <label className="input-label">Nom de ta marque / projet</label>
        <input className="input" placeholder="Ex: ORION, NovaTech, GreenLeaf..." value={brand} onChange={e => setBrand(e.target.value)} />
      </div>
      <Textarea label="Secteur / valeurs / couleurs (optionnel)" value={context} onChange={e => setContext(e.target.value)} placeholder="Tech, santé, finance... couleurs souhaitées, valeurs..." style={{ minHeight: 80 }} />
      <Chips label="Style" options={STYLES} value={style} onChange={setStyle} />
      <Button full loading={loading} disabled={!brand.trim()} onClick={() => generate(`Génère 3 concepts de logo ${style} pour : ${brand}
${context ? `Contexte : ${context}` : ''}

Pour chaque concept :
1. Concept visuel et symbolique
2. Palette de couleurs recommandée (avec codes hex)
3. Typographie suggérée
4. Éléments graphiques clés
5. Ce que le logo communique

Sois précis pour aider un designer à concrétiser.`, 'Logo')}>
        ✦ Générer des concepts
      </Button>
    </SimpleCreationTool>
  );
}
