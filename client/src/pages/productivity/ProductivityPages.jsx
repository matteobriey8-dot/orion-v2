import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Button, EmptyState, ProgressBar, ResultBox } from 'components/ui/index.jsx';
import { useAI } from 'hooks/useAI';
import 'styles/tools.css';

// ── Données locales (localStorage) ───────────────────────────────────────────
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; }
    catch { return initial; }
  });
  const set = (v) => {
    const next = typeof v === 'function' ? v(value) : v;
    setValue(next);
    localStorage.setItem(key, JSON.stringify(next));
  };
  return [value, set];
}

// ── HUB PRODUCTIVITÉ ─────────────────────────────────────────────────────────
const TOOLS = [
  { icon: '✅', label: 'Tâches',       path: '/productivity/tasks',      sub: 'Gérer tes to-do' },
  { icon: '📝', label: 'Notes',        path: '/productivity/notes',      sub: 'Capture rapide' },
  { icon: '🔁', label: 'Habitudes',    path: '/productivity/habits',     sub: 'Construis des routines' },
  { icon: '🍅', label: 'Pomodoro',     path: '/productivity/pomodoro',   sub: 'Focus 25 min' },
  { icon: '🗓️', label: 'Day Planner', path: '/productivity/dayplanner', sub: 'Planifie avec IA' },
  { icon: '📅', label: 'Agenda',       path: '/productivity/agenda',     sub: 'Planning du jour' },
  { icon: '📖', label: 'Journal',      path: '/productivity/journal',    sub: 'Journal quotidien' },
  { icon: '⏰', label: 'Rappels',      path: '/productivity/reminders',  sub: 'Alertes intelligentes' },
  { icon: '🧠', label: 'Deep Work',    path: '/productivity/deepwork',   sub: 'Mode concentration' },
  { icon: '📁', label: 'Projets',      path: '/productivity/projects',   sub: 'Multi-projets' },
  { icon: '🚩', label: 'Deadlines',    path: '/productivity/deadlines',  sub: 'Suivi des échéances' },
  { icon: '🕸️', label: 'Mind Map',    path: '/productivity/mindmap',    sub: 'Carte mentale' },
  { icon: '☑️', label: 'Checklist',   path: '/productivity/checklist',  sub: 'Listes perso' },
];

export function ProductivityHub() {
  const navigate = useNavigate();
  return (
    <div className="tool-page">
      <PageHeader title="✅ Productivité" subtitle="13 outils pour mieux travailler" />
      <div className="tool-page-body">
        <div className="hub-grid">
          {TOOLS.map((t) => (
            <div key={t.path} className="hub-card" onClick={() => navigate(t.path)}>
              <div className="hub-card-icon" style={{ background: 'rgba(124,92,255,0.12)', fontSize: 22 }}>{t.icon}</div>
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

// ── TÂCHES ────────────────────────────────────────────────────────────────────
const PRIORITIES = [
  { label: 'Haute',  color: '#EF4444', value: 'high' },
  { label: 'Moyenne', color: '#F59E0B', value: 'medium' },
  { label: 'Basse',  color: '#22C55E', value: 'low' },
];

export function TasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useLocalStorage('orion_tasks', []);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('medium');

  const filtered = tasks.filter(t =>
    filter === 'all' ? true : filter === 'active' ? !t.done : t.done
  );
  const doneCount = tasks.filter(t => t.done).length;

  const addTask = () => {
    if (!newTitle.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), title: newTitle.trim(), done: false, priority: newPriority, createdAt: Date.now() }]);
    setNewTitle(''); setShowAdd(false);
  };

  const toggle = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const clearDone = () => setTasks(prev => prev.filter(t => !t.done));

  const pColor = (p) => PRIORITIES.find(x => x.value === p)?.color || '#9A9AA1';

  return (
    <div className="tool-page">
      <PageHeader
        title="✅ Tâches"
        subtitle={`${doneCount}/${tasks.length} complétées`}
        onBack={() => navigate('/productivity')}
        actions={
          <>
            {tasks.some(t => t.done) && <Button variant="ghost" size="sm" onClick={clearDone}>Nettoyer</Button>}
            <Button size="sm" onClick={() => setShowAdd(true)}>+ Ajouter</Button>
          </>
        }
      />
      <div className="tool-page-body">

        {/* Progression */}
        {tasks.length > 0 && (
          <div className="task-progress">
            <div className="task-progress-info">
              <span>{doneCount} / {tasks.length} tâches</span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{tasks.length ? Math.round(doneCount / tasks.length * 100) : 0}%</span>
            </div>
            <ProgressBar value={doneCount} max={tasks.length || 1} />
          </div>
        )}

        {/* Filtres */}
        <div className="tasks-filters">
          {['all', 'active', 'done'].map(f => (
            <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Tout' : f === 'active' ? 'En cours' : 'Terminé'}
            </button>
          ))}
        </div>

        {/* Formulaire ajout */}
        {showAdd && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeIn 0.2s ease' }}>
            <input
              autoFocus
              className="input"
              placeholder="Titre de la tâche..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              {PRIORITIES.map(p => (
                <button key={p.value} type="button" className={`chip ${newPriority === p.value ? 'active' : ''}`}
                  style={{ '--chip-color': p.color, borderColor: newPriority === p.value ? p.color : '' }}
                  onClick={() => setNewPriority(p.value)}>{p.label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>Annuler</Button>
              <Button size="sm" onClick={addTask}>Ajouter</Button>
            </div>
          </div>
        )}

        {/* Liste */}
        {filtered.length === 0
          ? <EmptyState icon="✅" title="Aucune tâche" subtitle="Appuie sur + pour en ajouter une" action={<Button onClick={() => setShowAdd(true)}>Ajouter une tâche</Button>} />
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map(task => (
                <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
                  <button className={`task-checkbox ${task.done ? 'checked' : ''}`} onClick={() => toggle(task.id)}>
                    {task.done && '✓'}
                  </button>
                  <span className="task-title">{task.title}</span>
                  <div className="task-priority" style={{ background: pColor(task.priority) }} title={task.priority} />
                  <button className="task-delete" onClick={() => remove(task.id)}>✕</button>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}

// ── NOTES ─────────────────────────────────────────────────────────────────────
export function NotesPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useLocalStorage('orion_notes', []);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const createNote = () => {
    const n = { id: Date.now(), title: '', content: '', updatedAt: Date.now() };
    setNotes(prev => [n, ...prev]);
    setEditing(n);
  };

  const saveNote = (id, title, content) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, title, content, updatedAt: Date.now() } : n));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  const formatDate = (ts) => {
    const d = new Date(ts), now = new Date();
    if (d.toDateString() === now.toDateString()) return 'Aujourd\'hui';
    const y = new Date(now - 86400000);
    if (d.toDateString() === y.toDateString()) return 'Hier';
    return d.toLocaleDateString('fr-FR');
  };

  if (editing) {
    return <NoteEditor note={editing} onSave={saveNote} onDelete={deleteNote} onBack={() => setEditing(null)} />;
  }

  return (
    <div className="tool-page">
      <PageHeader title="📝 Notes" subtitle={`${notes.length} note${notes.length !== 1 ? 's' : ''}`} onBack={() => navigate('/productivity')} actions={<Button size="sm" onClick={createNote}>+ Nouvelle</Button>} />
      <div className="tool-page-body">
        <input className="input" placeholder="🔍 Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        {filtered.length === 0
          ? <EmptyState icon="📝" title="Aucune note" subtitle="Crée ta première note" action={<Button onClick={createNote}>Nouvelle note</Button>} />
          : <div className="notes-grid">
              {filtered.map(n => (
                <div key={n.id} className="note-card" onClick={() => setEditing(n)}>
                  <div className="note-title">{n.title || 'Sans titre'}</div>
                  <div className="note-preview">{n.content || 'Note vide'}</div>
                  <div className="note-date">{formatDate(n.updatedAt)}</div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}

function NoteEditor({ note, onSave, onDelete, onBack }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSave = () => { onSave(note.id, title, content); onBack(); };

  return (
    <div className="tool-page">
      <PageHeader
        title="📝 Note"
        onBack={handleSave}
        actions={
          <>
            <Button variant="danger" size="sm" onClick={() => { onDelete(note.id); onBack(); }}>Supprimer</Button>
            <Button size="sm" onClick={handleSave}>Sauvegarder</Button>
          </>
        }
      />
      <div className="note-editor" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <input className="note-editor-title" placeholder="Titre..." value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="note-editor-body" placeholder="Commence à écrire..." value={content} onChange={e => setContent(e.target.value)} />
      </div>
    </div>
  );
}

// ── HABITUDES ─────────────────────────────────────────────────────────────────
const EMOJIS = ['⭐','🏃','📚','🧘','💧','🥗','💪','✍️','🎯','😴','🎸','🧠','🌅','🚴','🎨'];

export function HabitsPage() {
  const navigate = useNavigate();
  const [habits, setHabits] = useLocalStorage('orion_habits', []);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('⭐');

  const today = new Date().toDateString();
  const completed = habits.filter(h => h.dates?.includes(today)).length;

  const toggle = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const dates = h.dates || [];
      return { ...h, dates: dates.includes(today) ? dates.filter(d => d !== today) : [...dates, today] };
    }));
  };

  const addHabit = () => {
    if (!newName.trim()) return;
    setHabits(prev => [...prev, { id: Date.now(), name: newName.trim(), emoji: newEmoji, dates: [] }]);
    setNewName(''); setNewEmoji('⭐'); setShowAdd(false);
  };

  const getStreak = (h) => {
    let streak = 0, d = new Date();
    while (true) {
      if ((h.dates || []).includes(d.toDateString())) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  };

  return (
    <div className="tool-page">
      <PageHeader title="🔁 Habitudes" subtitle={`${completed}/${habits.length} aujourd'hui`} onBack={() => navigate('/productivity')} actions={<Button size="sm" onClick={() => setShowAdd(true)}>+ Ajouter</Button>} />
      <div className="tool-page-body">

        {showAdd && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeIn 0.2s ease' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 48, height: 48, background: 'var(--surface2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, cursor: 'pointer', border: '1px solid var(--border)' }}>{newEmoji}</div>
              </div>
              <input autoFocus className="input" placeholder="Nom de l'habitude..." value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addHabit()} style={{ flex: 1 }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setNewEmoji(e)} style={{ width: 36, height: 36, fontSize: 20, background: newEmoji === e ? 'var(--accent-soft)' : 'var(--surface2)', border: `1px solid ${newEmoji === e ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer' }}>{e}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>Annuler</Button>
              <Button size="sm" onClick={addHabit}>Ajouter</Button>
            </div>
          </div>
        )}

        {habits.length === 0
          ? <EmptyState icon="🔁" title="Aucune habitude" subtitle="Crée ta première routine quotidienne" action={<Button onClick={() => setShowAdd(true)}>Ajouter une habitude</Button>} />
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {habits.map(h => {
                const done = (h.dates || []).includes(today);
                const streak = getStreak(h);
                return (
                  <div key={h.id} className={`habit-item ${done ? 'completed' : ''}`}>
                    <div className="habit-emoji">{h.emoji}</div>
                    <div className="habit-info">
                      <div className="habit-name">{h.name}</div>
                      {streak > 0 && <div className="habit-streak">🔥 {streak} jour{streak > 1 ? 's' : ''} de suite</div>}
                    </div>
                    <button className={`habit-check ${done ? 'done' : ''}`} onClick={() => toggle(h.id)}>
                      {done ? '✓' : ''}
                    </button>
                    <button onClick={() => setHabits(prev => prev.filter(x => x.id !== h.id))} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 14, padding: '2px 6px', opacity: 0 }} className="task-delete">✕</button>
                  </div>
                );
              })}
            </div>
        }
      </div>
    </div>
  );
}
