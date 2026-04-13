import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, Chips, Textarea, ResultBox } from '../../components/ui/index.jsx';
import { useAI } from '../../hooks/useAI';

function useLocal(key, init) {
  const [v, setV] = useState(() => { try { return JSON.parse(localStorage.getItem(key)) ?? init; } catch { return init; } });
  const set = (x) => { const n = typeof x === 'function' ? x(v) : x; setV(n); localStorage.setItem(key, JSON.stringify(n)); };
  return [v, set];
}

// ── HUB ───────────────────────────────────────────────────────────────────────
const TOOLS = [
  { icon: '💪', label: 'Workout IA',      path: '/lifestyle/workout',    sub: 'Programmes sport' },
  { icon: '🥗', label: 'Nutrition',       path: '/lifestyle/nutrition',  sub: 'Plans repas & calories' },
  { icon: '🧘', label: 'Méditation',      path: '/lifestyle/meditation', sub: 'Séances guidées' },
  { icon: '😴', label: 'Sleep Tracker',   path: '/lifestyle/sleep',      sub: 'Suivi sommeil' },
  { icon: '💧', label: 'Hydratation',     path: '/lifestyle/water',      sub: 'Objectif eau quotidien' },
  { icon: '📸', label: 'Scan Repas IA',   path: '/lifestyle/scanmeal',   sub: 'Analyse nutritionnelle' },
  { icon: '⭐', label: 'Horoscope IA',    path: '/lifestyle/horoscope',  sub: 'Horoscope personnalisé' },
  { icon: '🎬', label: 'Films & Séries',  path: '/lifestyle/movies',     sub: 'Recommandations' },
  { icon: '🎵', label: 'Musique',         path: '/lifestyle/music',      sub: 'Playlists par humeur' },
  { icon: '👨‍🍳', label: 'Recettes',       path: '/lifestyle/recipes',    sub: 'Selon tes ingrédients' },
  { icon: '👔', label: 'Mode & Style',    path: '/lifestyle/fashion',    sub: 'Conseils vestimentaires' },
  { icon: '✈️', label: 'Voyage',          path: '/lifestyle/travel',     sub: 'Planification voyage' },
  { icon: '📊', label: 'Sport & Stats',   path: '/lifestyle/sportstats', sub: 'Suivi performances' },
  { icon: '🌿', label: 'Bien-être',       path: '/lifestyle/wellness',   sub: 'Routines & conseils' },
  { icon: '📚', label: 'Lecture',         path: '/lifestyle/reading',    sub: 'Recommandations livres' },
  { icon: '💶', label: 'Finances perso',  path: '/lifestyle/budget',     sub: 'Budget & épargne' },
  { icon: '🎯', label: 'Objectifs',       path: '/lifestyle/goals',      sub: 'Suivi objectifs perso' },
  { icon: '🙏', label: 'Gratitude',       path: '/lifestyle/gratitude',  sub: 'Journal de gratitude' },
  { icon: '☀️', label: 'Météo Smart',     path: '/lifestyle/weather',    sub: 'Météo + conseils IA' },
  { icon: '😊', label: 'Humeur',          path: '/lifestyle/mood',       sub: 'Tracker humeur' },
];

export function LifestyleHub() {
  const navigate = useNavigate();
  return (
    <div className="tool-page">
      <PageHeader title="🌿 Lifestyle" subtitle="20 outils pour mieux vivre" />
      <div className="tool-page-body">
        <div className="hub-grid">
          {TOOLS.map((t) => (
            <div key={t.path} className="hub-card" onClick={() => navigate(t.path)}>
              <div className="hub-card-icon" style={{ background: 'rgba(34,197,94,0.12)', fontSize: 22 }}>{t.icon}</div>
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

// ── WORKOUT ───────────────────────────────────────────────────────────────────
export function WorkoutPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [goal, setGoal]           = useState('Perte de poids');
  const [level, setLevel]         = useState('Débutant');
  const [duration, setDuration]   = useState('30 min');
  const [equipment, setEquipment] = useState('Aucun (corps seulement)');

  const GOALS      = ['Perte de poids', 'Prise de muscle', 'Endurance', 'Flexibilité', 'Remise en forme'];
  const LEVELS     = ['Débutant', 'Intermédiaire', 'Avancé'];
  const DURATIONS  = ['15 min', '30 min', '45 min', '1h', '1h30'];
  const EQUIPMENTS = ['Aucun (corps seulement)', 'Haltères', 'Salle de sport complète', 'Élastiques', 'Kettlebell'];

  return (
    <div className="tool-page">
      <PageHeader title="💪 Workout IA" subtitle="Programme personnalisé" onBack={() => navigate('/lifestyle')} />
      <div className="tool-page-body">
        <Chips label="Objectif" options={GOALS} value={goal} onChange={setGoal} />
        <Chips label="Niveau" options={LEVELS} value={level} onChange={setLevel} />
        <Chips label="Durée" options={DURATIONS} value={duration} onChange={setDuration} />
        <Chips label="Équipement" options={EQUIPMENTS} value={equipment} onChange={setEquipment} />
        {error && <div className="alert alert-error">{error}</div>}
        <Button full loading={loading} onClick={() => generate(`Crée un programme d'entraînement complet.
Objectif : ${goal} | Niveau : ${level} | Durée : ${duration} | Équipement : ${equipment}

Structure :
🔥 ÉCHAUFFEMENT (5 min) : [exercices]
💪 PROGRAMME PRINCIPAL : [exercices avec séries × reps ou durée, temps de repos]
🧘 RETOUR AU CALME (3-5 min) : [étirements]
📊 CONSEILS : [nutrition post-entraînement, fréquence]

Sois précis sur les exercices et les temps de repos.`, 'Workout')}>
          ✦ Générer mon programme
        </Button>
        <ResultBox result={result} onRegenerate={() => generate(`Programme ${goal} ${level} ${duration}`, 'Workout')} />
      </div>
    </div>
  );
}

// ── NUTRITION ─────────────────────────────────────────────────────────────────
export function NutritionPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [goal, setGoal]         = useState('Perte de poids');
  const [regime, setRegime]     = useState('Omnivore');
  const [calories, setCalories] = useState('1800 kcal');
  const [allergies, setAllergies] = useState('');

  const GOALS    = ['Perte de poids', 'Prise de masse', 'Maintien', 'Énergie', 'Santé générale'];
  const REGIMES  = ['Omnivore', 'Végétarien', 'Végétalien', 'Sans gluten', 'Keto', 'Méditerranéen'];
  const CALORIES = ['1200 kcal', '1500 kcal', '1800 kcal', '2000 kcal', '2500 kcal', '3000 kcal'];

  return (
    <div className="tool-page">
      <PageHeader title="🥗 Nutrition" subtitle="Plan repas journalier" onBack={() => navigate('/lifestyle')} />
      <div className="tool-page-body">
        <Chips label="Objectif" options={GOALS} value={goal} onChange={setGoal} />
        <Chips label="Régime" options={REGIMES} value={regime} onChange={setRegime} />
        <Chips label="Calories quotidiennes" options={CALORIES} value={calories} onChange={setCalories} />
        <div className="input-group">
          <label className="input-label">Allergies / exclusions (optionnel)</label>
          <input className="input" placeholder="Noix, lactose, œufs..." value={allergies} onChange={e => setAllergies(e.target.value)} />
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <Button full loading={loading} onClick={() => generate(`Plan nutritionnel journalier.
Objectif : ${goal} | Régime : ${regime} | Calories : ${calories}
${allergies ? `Allergies : ${allergies}` : ''}

Format :
🌅 PETIT-DÉJEUNER : [recette + macros]
🥗 DÉJEUNER : [recette + macros]
🍎 COLLATION : [option]
🍽️ DÎNER : [recette + macros]
📊 TOTAL : [calories, protéines, glucides, lipides]
💡 CONSEILS : [timing des repas, hydratation]`, 'Nutrition')}>
          ✦ Générer mon plan repas
        </Button>
        <ResultBox result={result} />
      </div>
    </div>
  );
}

// ── MÉDITATION ────────────────────────────────────────────────────────────────
export function MeditationPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [type, setType]         = useState('Pleine conscience');
  const [duration, setDuration] = useState('10 min');
  const [intention, setIntention] = useState('Réduire le stress');
  const [inSession, setInSession] = useState(false);

  const TYPES      = ['Pleine conscience', 'Respiration', 'Body Scan', 'Visualisation', 'Gratitude', 'Sommeil'];
  const DURATIONS  = ['5 min', '10 min', '15 min', '20 min', '30 min'];
  const INTENTIONS = ['Réduire le stress', 'Améliorer le focus', 'Mieux dormir', 'Énergie', 'Clarté mentale'];

  const startSession = () => {
    setInSession(true);
    generate(`Séance de méditation guidée ${duration}, style ${type}, intention : ${intention}.

🧘 INTRODUCTION : [installation, posture]
💨 RESPIRATION : [technique précise]
🌊 MÉDITATION : [guidage détaillé, images et sensations]
✨ CLÔTURE : [sortie douce]

Utilise un langage doux, tutoie l'utilisateur. Indique [...pause...] pour les temps de silence.`, 'Méditation');
  };

  if (inSession) {
    return (
      <div className="tool-page" style={{ background: '#060610' }}>
        <PageHeader title="🧘 Méditation" onBack={() => setInSession(false)} actions={<Button variant="ghost" size="sm" onClick={() => setInSession(false)}>Terminer</Button>} />
        <div className="tool-page-body" style={{ background: '#060610' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <span className="spinner spinner-accent" style={{ width: 40, height: 40, borderWidth: 3 }} />
            </div>
          ) : (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(rgba(124,92,255,0.4), transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 16px' }}>🧘</div>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 2.2, fontSize: '1rem', color: '#E8E8F0', letterSpacing: 0.3 }}>{result}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="tool-page">
      <PageHeader title="🧘 Méditation" subtitle="Séance guidée personnalisée" onBack={() => navigate('/lifestyle')} />
      <div className="tool-page-body">
        <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(91,139,255,0.06))', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 40 }}>🧘</div>
          <h3>Méditation guidée IA</h3>
          <p style={{ fontSize: '0.875rem' }}>Une séance personnalisée, générée pour toi</p>
        </div>
        <Chips label="Style" options={TYPES} value={type} onChange={setType} />
        <Chips label="Durée" options={DURATIONS} value={duration} onChange={setDuration} />
        <Chips label="Intention" options={INTENTIONS} value={intention} onChange={setIntention} />
        {error && <div className="alert alert-error">{error}</div>}
        <Button full loading={loading} onClick={startSession}>✦ Commencer la séance</Button>
      </div>
    </div>
  );
}

// ── SLEEP TRACKER ─────────────────────────────────────────────────────────────
export function SleepPage() {
  const navigate = useNavigate();
  const { result, loading, error, generate } = useAI();
  const [sleepData, setSleepData] = useLocal('orion_sleep', [7.5, 6.0, 8.0, 5.5, 7.0, 9.0, 6.5]);
  const [bedtime, setBedtime]     = useState('23:00');
  const [wakeTime, setWakeTime]   = useState('07:00');
  const [quality, setQuality]     = useState('Bien');

  const days    = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const times   = ['21:00', '22:00', '22:30', '23:00', '23:30', '00:00', '01:00'];
  const wakes   = ['05:00', '06:00', '06:30', '07:00', '07:30', '08:00', '09:00'];
  const QUALITY = ['Très bien', 'Bien', 'Moyen', 'Mauvais', 'Terrible'];
  const avg     = (sleepData.reduce((a, b) => a + b, 0) / sleepData.length).toFixed(1);
  const maxH    = Math.max(...sleepData);
  const todayIdx = (new Date().getDay() + 6) % 7;

  const editDay = (i) => {
    const val = prompt(`Heures de sommeil ${days[i]} (ex: 7.5)`, sleepData[i]);
    const n = parseFloat(val);
    if (!isNaN(n) && n >= 0 && n <= 24) setSleepData(prev => prev.map((v, idx) => idx === i ? n : v));
  };

  return (
    <div className="tool-page">
      <PageHeader title="😴 Sleep Tracker" subtitle="Analyse et améliore ton sommeil" onBack={() => navigate('/lifestyle')} />
      <div className="tool-page-body">

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[['Moyenne', `${avg}h`, '📊'], ['Meilleure', `${maxH}h`, '⭐'], ['Pire', `${Math.min(...sleepData)}h`, '⚠️']].map(([l, v, i]) => (
            <div key={l} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{i}</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{v}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Graphique */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>Cette semaine</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
            {sleepData.map((h, i) => {
              const isToday = i === todayIdx;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: '0.65rem', color: isToday ? 'var(--success)' : 'var(--text3)' }}>{h}h</span>
                  <div onClick={() => editDay(i)} title="Cliquer pour modifier" style={{ width: '100%', height: `${(h / 12) * 80}px`, background: isToday ? 'var(--success)' : 'rgba(34,197,94,0.4)', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s', minHeight: 4 }} />
                  <span style={{ fontSize: '0.65rem', color: isToday ? 'var(--success)' : 'var(--text3)', fontWeight: isToday ? 700 : 400 }}>{days[i]}</span>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 8, marginBottom: 0 }}>Cliquer sur une barre pour modifier</p>
        </div>

        {/* Nuit dernière */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontWeight: 700 }}>Nuit dernière</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[['Coucher', bedtime, setBedtime, times], ['Réveil', wakeTime, setWakeTime, wakes]].map(([l, v, s, opts]) => (
              <div key={l} style={{ flex: 1 }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text2)', display: 'block', marginBottom: 4 }}>{l}</label>
                <select className="select" value={v} onChange={e => s(e.target.value)}>
                  {opts.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            ))}
          </div>
          <Chips label="Qualité ressentie" options={QUALITY} value={quality} onChange={setQuality} />
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        <Button full loading={loading} onClick={() => generate(`Analyse ces données de sommeil et donne des conseils.
Moyenne : ${avg}h | Données : ${days.map((d, i) => `${d}: ${sleepData[i]}h`).join(', ')}
Coucher : ${bedtime} | Réveil : ${wakeTime} | Qualité : ${quality}

Fournis :
1. Analyse de qualité (2-3 phrases)
2. Points positifs et axes d'amélioration
3. 4 conseils pratiques
4. Routine du soir recommandée (5 étapes)
5. Heure de coucher optimale`, 'Sleep')}>
          ✦ Analyser mon sommeil
        </Button>
        <ResultBox result={result} />
      </div>
    </div>
  );
}

// ── HYDRATATION ───────────────────────────────────────────────────────────────
export function WaterPage() {
  const navigate = useNavigate();
  const [glasses, setGlasses] = useLocal('orion_water_' + new Date().toDateString(), 0);
  const [goal, setGoal]       = useLocal('orion_water_goal', 8);

  const progress = Math.min(glasses / goal, 1);
  const liters   = (glasses * 0.25).toFixed(2);
  const color    = progress >= 1 ? 'var(--success)' : progress >= 0.6 ? 'var(--warning)' : 'var(--info)';
  const message  = progress >= 1 ? '🎉 Objectif atteint !' : progress >= 0.6 ? 'Continue comme ça !' : 'Pense à t\'hydrater !';

  const circumference = 2 * Math.PI * 54;
  const dashOffset    = circumference * (1 - progress);

  return (
    <div className="tool-page">
      <PageHeader title="💧 Hydratation" subtitle="Objectif eau quotidien" onBack={() => navigate('/lifestyle')} actions={<Button variant="ghost" size="sm" onClick={() => setGlasses(0)}>Reset</Button>} />
      <div className="tool-page-body" style={{ alignItems: 'center' }}>

        {/* Cercle SVG */}
        <div style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="180" height="180" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
            <circle cx="90" cy="90" r="54" fill="none" stroke="var(--surface2)" strokeWidth="10" />
            <circle cx="90" cy="90" r="54" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
          </svg>
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color }}>{liters}L</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>sur {(goal * 0.25).toFixed(1)}L</div>
          </div>
        </div>

        <div style={{ fontWeight: 600, color, fontSize: '1rem' }}>{message}</div>

        {/* Grille verres */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(goal, 8)}, 1fr)`, gap: 8, width: '100%', maxWidth: 360 }}>
          {Array.from({ length: goal }, (_, i) => (
            <button key={i} onClick={() => setGlasses(i < glasses ? i : i + 1)} style={{ height: 48, borderRadius: 12, border: `2px solid ${i < glasses ? color : 'var(--border)'}`, background: i < glasses ? `${color}20` : 'var(--surface)', cursor: 'pointer', fontSize: 20, transition: 'all 0.2s' }}>
              💧
            </button>
          ))}
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 360 }}>
          <button onClick={() => glasses > 0 && setGlasses(g => g - 1)} style={{ width: 48, height: 48, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text2)', cursor: 'pointer', fontSize: 20 }}>−</button>
          <Button full onClick={() => glasses < goal && setGlasses(g => g + 1)}>+ Boire un verre (250ml)</Button>
        </div>

        {/* Objectif */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, width: '100%', maxWidth: 360, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>Objectif quotidien</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => goal > 4 && setGoal(g => g - 1)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)', cursor: 'pointer', color: 'var(--text2)' }}>−</button>
            <span style={{ fontWeight: 700, minWidth: 60, textAlign: 'center' }}>{goal} verres</span>
            <button onClick={() => goal < 16 && setGoal(g => g + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)', cursor: 'pointer', color: 'var(--accent)' }}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}
