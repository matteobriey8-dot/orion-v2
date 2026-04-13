import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Chips, Textarea, ResultBox } from 'components/ui/index.jsx';
import { useAI } from 'hooks/useAI';

// ── Composant générique ───────────────────────────────────────────────────────
function AITool({ icon, title, back = '/lifestyle', children, result, loading, error, onGenerate, disabled }) {
  const navigate = useNavigate();
  return (
    <div className="tool-page">
      <PageHeader title={`${icon} ${title}`} onBack={() => navigate(back)} />
      <div className="tool-page-body">
        {children}
        {error && <div className="alert alert-error">{error}</div>}
        <Button full loading={loading} onClick={onGenerate} disabled={disabled}>✦ {title}</Button>
        <ResultBox result={result} onRegenerate={onGenerate} />
      </div>
    </div>
  );
}

// ── SCAN REPAS ────────────────────────────────────────────────────────────────
export function ScanMealPage() {
  const { result, loading, error, generate } = useAI();
  const [meal, setMeal] = useState('');
  return (
    <AITool icon="📸" title="Analyser ce repas" result={result} loading={loading} error={error} disabled={!meal.trim()}
      onGenerate={() => generate(`Analyse nutritionnelle de ce repas : ${meal}
Fournis :
🔢 CALORIES : [kcal estimées]
💪 MACROS : Protéines / Glucides / Lipides / Fibres
🌿 MICRONUTRIMENTS CLÉS
✅ POINTS POSITIFS
⚠️ POINTS D'ATTENTION
💡 COMMENT AMÉLIORER ce repas`, 'Scan Repas')}>
      <Textarea label="Décris ton repas" value={meal} onChange={e => setMeal(e.target.value)} placeholder="Ex: Salade César avec poulet grillé, portion moyenne, vinaigrette..." style={{ minHeight: 100 }} />
    </AITool>
  );
}

// ── HOROSCOPE ─────────────────────────────────────────────────────────────────
export function HoroscopePage() {
  const { result, loading, error, generate } = useAI();
  const [sign, setSign]   = useState('Bélier');
  const [focus, setFocus] = useState('');
  const SIGNS = ['Bélier','Taureau','Gémeaux','Cancer','Lion','Vierge','Balance','Scorpion','Sagittaire','Capricorne','Verseau','Poissons'];
  return (
    <AITool icon="⭐" title="Générer mon horoscope" result={result} loading={loading} error={error}
      onGenerate={() => generate(`Horoscope personnalisé pour ${sign}. ${focus ? `Focus : ${focus}` : ''}
Format :
✨ MESSAGE DU JOUR
❤️ AMOUR & RELATIONS
💼 CARRIÈRE & FINANCES
🌿 SANTÉ & BIEN-ÊTRE
🎯 CONSEIL DU JOUR
🔢 CHIFFRES CHANCEUX : [3 chiffres]
🌟 COMPATIBILITÉ : [signe compatible]

Sois positif et inspirant.`, 'Horoscope')}>
      <Chips label="Signe astrologique" options={SIGNS} value={sign} onChange={setSign} />
      <div className="input-group">
        <label className="input-label">Focus particulier (optionnel)</label>
        <input className="input" placeholder="Amour, carrière, finances..." value={focus} onChange={e => setFocus(e.target.value)} />
      </div>
    </AITool>
  );
}

// ── FILMS & SÉRIES ────────────────────────────────────────────────────────────
export function MoviesPage() {
  const { result, loading, error, generate } = useAI();
  const [prefs, setPrefs] = useState('');
  const [type, setType]   = useState('Film');
  const TYPES = ['Film', 'Série', 'Documentaire', 'Anime', 'Peu importe'];
  return (
    <AITool icon="🎬" title="Obtenir des recommandations" result={result} loading={loading} error={error} disabled={!prefs.trim()}
      onGenerate={() => generate(`Recommande 5 ${type}s basé sur : ${prefs}
Pour chaque recommandation :
🎬 TITRE (Année) — Genre
⭐ Note : X/10
📖 Résumé en 2 phrases
💡 Pourquoi tu vas l'aimer
Mix populaire + méconnus.`, 'Films')}>
      <Chips label="Type" options={TYPES} value={type} onChange={setType} />
      <Textarea label="Tes goûts, humeur, derniers films aimés" value={prefs} onChange={e => setPrefs(e.target.value)} placeholder="J'aime les thrillers psychologiques, j'ai vu Inception, je veux quelque chose d'intense..." style={{ minHeight: 100 }} />
    </AITool>
  );
}

// ── MUSIQUE ───────────────────────────────────────────────────────────────────
export function MusicPage() {
  const { result, loading, error, generate } = useAI();
  const [mood, setMood]   = useState('Motivé');
  const [prefs, setPrefs] = useState('');
  const MOODS = ['Motivé', 'Concentré', 'Relaxé', 'Triste', 'Festif', 'Romantique', 'Sport'];
  return (
    <AITool icon="🎵" title="Créer ma playlist" result={result} loading={loading} error={error}
      onGenerate={() => generate(`Playlist pour humeur : ${mood}. ${prefs ? `Préférences : ${prefs}` : ''}
Format :
🎵 NOM DE LA PLAYLIST
📝 AMBIANCE (1 phrase)
PLAYLIST (15 titres) :
1. Artiste - Titre (Genre)
[...]
💡 Artistes similaires à découvrir`, 'Musique')}>
      <Chips label="Humeur" options={MOODS} value={mood} onChange={setMood} />
      <div className="input-group">
        <label className="input-label">Genres / artistes préférés (optionnel)</label>
        <input className="input" placeholder="Hip-hop, électro, Drake, Daft Punk..." value={prefs} onChange={e => setPrefs(e.target.value)} />
      </div>
    </AITool>
  );
}

// ── RECETTES ──────────────────────────────────────────────────────────────────
export function RecipesPage() {
  const { result, loading, error, generate } = useAI();
  const [ingredients, setIngredients] = useState('');
  const [type, setType] = useState('Plat principal');
  const TYPES = ['Plat principal', 'Dessert', 'Entrée', 'Petit-déjeuner', 'Snack', 'Rapide (<20min)'];
  return (
    <AITool icon="👨‍🍳" title="Trouver une recette" result={result} loading={loading} error={error} disabled={!ingredients.trim()}
      onGenerate={() => generate(`Crée une recette de ${type} avec : ${ingredients}
Format :
🍽️ NOM DE LA RECETTE
⏱️ Temps : préparation + cuisson
👥 Portions
INGRÉDIENTS : [liste avec quantités]
ÉTAPES : [étapes détaillées]
💡 ASTUCE DU CHEF
📊 CALORIES : estimation`, 'Recettes')}>
      <Chips label="Type de plat" options={TYPES} value={type} onChange={setType} />
      <Textarea label="Ingrédients disponibles" value={ingredients} onChange={e => setIngredients(e.target.value)} placeholder="Poulet, riz, tomates, ail, citron..." style={{ minHeight: 80 }} />
    </AITool>
  );
}

// ── MODE & STYLE ──────────────────────────────────────────────────────────────
export function FashionPage() {
  const { result, loading, error, generate } = useAI();
  const [occasion, setOccasion] = useState('Travail');
  const [infos, setInfos]       = useState('');
  const OCCASIONS = ['Travail', 'Casual', 'Soirée', 'Sport', 'Rendez-vous', 'Weekend'];
  return (
    <AITool icon="👔" title="Obtenir des conseils style" result={result} loading={loading} error={error}
      onGenerate={() => generate(`Conseils tenue pour occasion : ${occasion}. ${infos ? `Infos : ${infos}` : ''}
Propose :
👔 TENUE PRINCIPALE (haut au bas)
👟 CHAUSSURES
💼 ACCESSOIRES
🎨 PALETTE COULEURS (combinaisons qui fonctionnent)
✅ POURQUOI ÇA MARCHE
❌ À ÉVITER pour cette occasion
💡 CONSEIL STYLE`, 'Mode')}>
      <Chips label="Occasion" options={OCCASIONS} value={occasion} onChange={setOccasion} />
      <Textarea label="Ton style, morphologie, garde-robe (optionnel)" value={infos} onChange={e => setInfos(e.target.value)} placeholder="Style casual chic, couleurs préférées, saison actuelle..." style={{ minHeight: 80 }} />
    </AITool>
  );
}

// ── VOYAGE ────────────────────────────────────────────────────────────────────
export function TravelPage() {
  const { result, loading, error, generate } = useAI();
  const [infos, setInfos]   = useState('');
  const [type, setType]     = useState('City trip');
  const TYPES = ['City trip', 'Nature', 'Plage', 'Culture', 'Aventure', 'Détente'];
  return (
    <AITool icon="✈️" title="Planifier mon voyage" result={result} loading={loading} error={error} disabled={!infos.trim()}
      onGenerate={() => generate(`Planifie un voyage ${type}. Infos : ${infos}
✈️ DESTINATION RECOMMANDÉE + justification
📅 MEILLEURE PÉRIODE
🗺️ PROGRAMME JOUR PAR JOUR
🏨 HÉBERGEMENT : type et quartiers
🍽️ GASTRONOMIE : incontournables
💰 BUDGET ESTIMATIF
🎒 CHECKLIST
⚠️ CONSEILS PRATIQUES`, 'Voyage')}>
      <Chips label="Type de voyage" options={TYPES} value={type} onChange={setType} />
      <Textarea label="Destination, budget, durée, avec qui" value={infos} onChange={e => setInfos(e.target.value)} placeholder="Paris, budget 500€, 3 jours, en couple..." style={{ minHeight: 100 }} />
    </AITool>
  );
}

// ── BIEN-ÊTRE ─────────────────────────────────────────────────────────────────
export function WellnessPage() {
  const { result, loading, error, generate } = useAI();
  const [focus, setFocus]   = useState('Stress');
  const [context, setContext] = useState('');
  const FOCUS = ['Stress', 'Anxiété', 'Énergie', 'Motivation', 'Équilibre', 'Confiance'];
  return (
    <AITool icon="🌿" title="Obtenir des conseils bien-être" result={result} loading={loading} error={error}
      onGenerate={() => generate(`Conseils bien-être pour gérer : ${focus}. ${context ? `Contexte : ${context}` : ''}
🌿 COMPRÉHENSION
🛠️ 3 ACTIONS IMMÉDIATES
📅 ROUTINE SUR 7 JOURS
🧘 TECHNIQUES (respiration, mouvement)
💬 AFFIRMATIONS POSITIVES (5)
⏰ DANS 2H : si tu fais ces actions`, 'Bien-être')}>
      <Chips label="Focus" options={FOCUS} value={focus} onChange={setFocus} />
      <Textarea label="Contexte (optionnel)" value={context} onChange={e => setContext(e.target.value)} placeholder="Ce que tu vis en ce moment..." style={{ minHeight: 80 }} />
    </AITool>
  );
}

// ── LECTURE ───────────────────────────────────────────────────────────────────
export function ReadingPage() {
  const { result, loading, error, generate } = useAI();
  const [genre, setGenre] = useState('Développement perso');
  const [prefs, setPrefs] = useState('');
  const GENRES = ['Développement perso', 'Roman', 'Science-fiction', 'Thriller', 'Business', 'Histoire', 'Science', 'Philosophie'];
  return (
    <AITool icon="📚" title="Recommander des livres" result={result} loading={loading} error={error}
      onGenerate={() => generate(`Recommande des livres de genre : ${genre}. ${prefs ? `Préférences : ${prefs}` : ''}
Pour chaque livre :
📚 TITRE — Auteur (Année)
⭐ Note : X/10
📖 Résumé en 2 phrases
💡 Ce que tu vas y apprendre
5 recommandations : 2 classiques + 3 pépites moins connues.`, 'Lecture')}>
      <Chips label="Genre" options={GENRES} value={genre} onChange={setGenre} />
      <Textarea label="Tes dernières lectures, ce que tu cherches" value={prefs} onChange={e => setPrefs(e.target.value)} placeholder="J'ai aimé Atomic Habits, je veux quelque chose sur la créativité..." style={{ minHeight: 80 }} />
    </AITool>
  );
}

// ── BUDGET ────────────────────────────────────────────────────────────────────
export function BudgetLifestylePage() {
  const { result, loading, error, generate } = useAI();
  const [method, setMethod] = useState('50/30/20');
  const [infos, setInfos]   = useState('');
  const METHODS = ['50/30/20', 'Budget base zéro', 'Enveloppes', 'Analyse libre'];
  return (
    <AITool icon="💶" title="Créer mon budget" result={result} loading={loading} error={error} disabled={!infos.trim()}
      onGenerate={() => generate(`Budget mensuel selon la méthode : ${method}. Infos : ${infos}
💰 RÉPARTITION BUDGET
📊 TABLEAU DES CATÉGORIES avec montants
💾 OBJECTIF D'ÉPARGNE
✂️ OPTIMISATIONS POSSIBLES
📱 COMMENT TRACKER
⚡ ACTIONS CETTE SEMAINE`, 'Budget')}>
      <Chips label="Méthode" options={METHODS} value={method} onChange={setMethod} />
      <Textarea label="Revenus, dépenses principales, objectifs" value={infos} onChange={e => setInfos(e.target.value)} placeholder="2000€ nets, loyer 600€, courses 300€, objectif épargner 200€/mois..." style={{ minHeight: 100 }} />
    </AITool>
  );
}

// ── OBJECTIFS ─────────────────────────────────────────────────────────────────
export function GoalsPage() {
  const { result, loading, error, generate } = useAI();
  const [domain, setDomain]   = useState('Carrière');
  const [objective, setObjective] = useState('');
  const DOMAINS = ['Carrière', 'Santé', 'Relations', 'Finances', 'Créativité', 'Personnel'];
  return (
    <AITool icon="🎯" title="Structurer mon objectif" result={result} loading={loading} error={error} disabled={!objective.trim()}
      onGenerate={() => generate(`Aide à structurer cet objectif dans le domaine ${domain} : ${objective}
🎯 OBJECTIF SMART REFORMULÉ
📊 ÉTAT DES LIEUX
🗺️ PLAN EN 3 PHASES (30/90 jours/6 mois)
⚡ ACTIONS IMMÉDIATES (aujourd'hui + cette semaine)
🧱 OBSTACLES PROBABLES + solutions
💪 RESSOURCES NÉCESSAIRES
🔥 POURQUOI C'EST IMPORTANT`, 'Objectifs')}>
      <Chips label="Domaine" options={DOMAINS} value={domain} onChange={setDomain} />
      <Textarea label="Ton objectif" value={objective} onChange={e => setObjective(e.target.value)} placeholder="Je veux lancer mon entreprise dans 6 mois..." style={{ minHeight: 100 }} />
    </AITool>
  );
}

// ── GRATITUDE ─────────────────────────────────────────────────────────────────
export function GratitudePage() {
  const { result, loading, error, generate } = useAI();
  const [events, setEvents] = useState('');
  return (
    <AITool icon="🙏" title="Transformer en gratitude" result={result} loading={loading} error={error} disabled={!events.trim()}
      onGenerate={() => generate(`Transforme ces événements en entrée de journal de gratitude profonde.
Ce qui s'est passé : ${events}
Crée :
🌟 ENTRÉE DU JOUR
💛 3 GRATITUDES PROFONDES (développées avec émotion)
🌱 LEÇON DU JOUR
✨ AFFIRMATION POSITIVE
🙏 INTENTION DE DEMAIN
Ton chaleureux et introspectif.`, 'Gratitude')}>
      <Textarea label="Qu'est-ce qui s'est passé de bien aujourd'hui ?" value={events} onChange={e => setEvents(e.target.value)} placeholder="Même les petites choses comptent : un café réussi, une conversation enrichissante..." style={{ minHeight: 120 }} />
    </AITool>
  );
}

// ── MÉTÉO SMART ───────────────────────────────────────────────────────────────
export function WeatherPage() {
  const { result, loading, error, generate } = useAI();
  const [city, setCity]     = useState('');
  const [season, setSeason] = useState('Printemps');
  const SEASONS = ['Printemps', 'Été', 'Automne', 'Hiver'];
  return (
    <AITool icon="☀️" title="Obtenir des conseils météo" result={result} loading={loading} error={error}
      onGenerate={() => generate(`Conseils pour ${city || 'ville non précisée'} en ${season}.
☀️ TENUE RECOMMANDÉE
🥗 NUTRITION DE SAISON
🏃 ACTIVITÉS RECOMMANDÉES
💊 SANTÉ SAISONNIÈRE
🌿 BIEN-ÊTRE adapté à la saison
⚡ CONSEIL ÉNERGIE`, 'Météo')}>
      <div className="input-group">
        <label className="input-label">Ta ville (optionnel)</label>
        <input className="input" placeholder="Paris, Lyon, Marseille..." value={city} onChange={e => setCity(e.target.value)} />
      </div>
      <Chips label="Saison" options={SEASONS} value={season} onChange={setSeason} />
    </AITool>
  );
}

// ── HUMEUR ────────────────────────────────────────────────────────────────────
export function MoodPage() {
  const { result, loading, error, generate } = useAI();
  const [mood, setMood]     = useState('Bien');
  const [context, setContext] = useState('');
  const MOODS = ['Excellent', 'Bien', 'Neutre', 'Fatigué', 'Stressé', 'Triste', 'Anxieux', 'En colère'];
  return (
    <AITool icon="😊" title="Analyser mon humeur" result={result} loading={loading} error={error}
      onGenerate={() => generate(`Analyse bienveillante et conseils pour humeur : ${mood}. ${context ? `Contexte : ${context}` : ''}
💭 POURQUOI cette humeur est naturelle
🌡️ COMMENT évoluer vers quelque chose de mieux
⚡ 3 ACTIONS IMMÉDIATES
🧘 TECHNIQUE DE RÉGULATION
🗣️ DIALOGUE INTÉRIEUR POSITIF
⏰ DANS 2H : si tu suis ces conseils`, 'Humeur')}>
      <Chips label="Ton humeur actuelle" options={MOODS} value={mood} onChange={setMood} />
      <Textarea label="Pourquoi tu te sens comme ça ? (optionnel)" value={context} onChange={e => setContext(e.target.value)} placeholder="Décris ce qui se passe..." style={{ minHeight: 80 }} />
    </AITool>
  );
}

// ── SPORT & STATS ─────────────────────────────────────────────────────────────
export function SportStatsPage() {
  const { result, loading, error, generate } = useAI();
  const [sport, setSport]   = useState('Course');
  const [perf, setPerf]     = useState('');
  const SPORTS = ['Course', 'Musculation', 'Cyclisme', 'Natation', 'Football', 'Tennis', 'Autre'];
  return (
    <AITool icon="📊" title="Analyser mes performances" result={result} loading={loading} error={error} disabled={!perf.trim()}
      onGenerate={() => generate(`Analyse performances sportives (${sport}) : ${perf}
📊 ANALYSE DE LA PERFORMANCE
🎯 OBJECTIFS SMART sur 30/60/90 jours
💪 PROGRAMME D'ENTRAÎNEMENT hebdomadaire
🥗 NUTRITION SPORTIVE (pré/post entraînement)
😴 PROTOCOLE DE RÉCUPÉRATION
📈 PROGRESSION ATTENDUE`, 'Sport Stats')}>
      <Chips label="Sport" options={SPORTS} value={sport} onChange={setSport} />
      <Textarea label="Tes performances actuelles et objectifs" value={perf} onChange={e => setPerf(e.target.value)} placeholder="Je cours 5km en 28min, objectif 25min en 2 mois..." style={{ minHeight: 100 }} />
    </AITool>
  );
}
