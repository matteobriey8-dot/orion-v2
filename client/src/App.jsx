import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import HomePage  from './pages/HomePage';
import ChatPage  from './pages/chat/ChatPage';
import { ProductivityHub, TasksPage, NotesPage, HabitsPage } from './pages/productivity/ProductivityPages';
import { PomodoroPage, DayPlannerPage, ProductivityPlaceholder } from './pages/productivity/ProductivityTools';
import { IntelligenceHub, LifeScorePage, DecisionPage, BriefingPage } from './pages/intelligence/IntelligencePages';
import { CoachPage, AnalyzePage, SimulationPage, QuestionsPage, QuantumPage, IntelligencePlaceholder } from './pages/intelligence/IntelligenceTools';
import { CreationHub, EmailPage, CvPage, TikTokPage, TextGenPage, PoemPage } from './pages/creation/CreationPages';
import { BioPage, SloganPage, TranslatePage, SummaryPage, BrainstormPage, ImageAiPage, LogoPage } from './pages/creation/CreationTools';
import { LifestyleHub, WorkoutPage, NutritionPage, MeditationPage, SleepPage, WaterPage } from './pages/lifestyle/LifestylePages';
import { ScanMealPage, HoroscopePage, MoviesPage, MusicPage, RecipesPage, FashionPage, TravelPage, WellnessPage, ReadingPage, BudgetLifestylePage, GoalsPage, GratitudePage, WeatherPage, MoodPage, SportStatsPage } from './pages/lifestyle/LifestyleTools';
import { OutilsHub, CalcPage, ConverterPage, TimerPage, GeneratorPage, QuickNotePage } from './pages/outils/OutilsPages';
import { QrCodePage, FinancePage, CryptoPage, BudgetPage, StudentPage, FreelancePage, NewsPage, LegalPage, CodePage, TranslateToolPage } from './pages/outils/OutilsTools';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}><span className="spinner spinner-accent" style={{ width:32, height:32, borderWidth:3 }} /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const PP = (icon, title, desc) => <ProductivityPlaceholder icon={icon} title={title} description={desc} />;
  const IP = (icon, title, desc) => <IntelligencePlaceholder icon={icon} title={title} description={desc} />;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route index element={<HomePage />} />
        <Route path="chat" element={<ChatPage />} />

        {/* Productivité */}
        <Route path="productivity"            element={<ProductivityHub />} />
        <Route path="productivity/tasks"      element={<TasksPage />} />
        <Route path="productivity/notes"      element={<NotesPage />} />
        <Route path="productivity/habits"     element={<HabitsPage />} />
        <Route path="productivity/pomodoro"   element={<PomodoroPage />} />
        <Route path="productivity/dayplanner" element={<DayPlannerPage />} />
        <Route path="productivity/agenda"     element={PP('📅','Agenda','Planning du jour.')} />
        <Route path="productivity/journal"    element={PP('📖','Journal','Écriture quotidienne.')} />
        <Route path="productivity/reminders"  element={PP('⏰','Rappels','Alertes intelligentes.')} />
        <Route path="productivity/deepwork"   element={PP('🧠','Deep Work','Mode concentration.')} />
        <Route path="productivity/projects"   element={PP('📁','Projets','Multi-projets.')} />
        <Route path="productivity/deadlines"  element={PP('🚩','Deadlines','Suivi échéances.')} />
        <Route path="productivity/mindmap"    element={PP('🕸️','Mind Map','Cartes mentales.')} />
        <Route path="productivity/checklist"  element={PP('☑️','Checklist','Listes perso.')} />

        {/* Intelligence */}
        <Route path="intelligence"             element={<IntelligenceHub />} />
        <Route path="intelligence/lifescore"   element={<LifeScorePage />} />
        <Route path="intelligence/decision"    element={<DecisionPage />} />
        <Route path="intelligence/briefing"    element={<BriefingPage />} />
        <Route path="intelligence/coach"       element={<CoachPage />} />
        <Route path="intelligence/simulation"  element={<SimulationPage />} />
        <Route path="intelligence/analyze"     element={<AnalyzePage />} />
        <Route path="intelligence/questions"   element={<QuestionsPage />} />
        <Route path="intelligence/quantum"     element={<QuantumPage />} />
        <Route path="intelligence/twin"        element={IP('👤','Twin IA','Ton double numérique.')} />
        <Route path="intelligence/sentiment"   element={IP('💜','IA Sentimentale','Analyse émotions.')} />
        <Route path="intelligence/predictions" element={IP('📈','Prédictions','Anticipations.')} />
        <Route path="intelligence/mirror"      element={IP('🪞','Mind Mirror','Personnalité.')} />

        {/* Création */}
        <Route path="creation"            element={<CreationHub />} />
        <Route path="creation/email"      element={<EmailPage />} />
        <Route path="creation/cv"         element={<CvPage />} />
        <Route path="creation/tiktok"     element={<TikTokPage />} />
        <Route path="creation/textgen"    element={<TextGenPage />} />
        <Route path="creation/poem"       element={<PoemPage />} />
        <Route path="creation/bio"        element={<BioPage />} />
        <Route path="creation/slogan"     element={<SloganPage />} />
        <Route path="creation/translate"  element={<TranslatePage />} />
        <Route path="creation/summary"    element={<SummaryPage />} />
        <Route path="creation/brainstorm" element={<BrainstormPage />} />
        <Route path="creation/image"      element={<ImageAiPage />} />
        <Route path="creation/logo"       element={<LogoPage />} />

        {/* Lifestyle */}
        <Route path="lifestyle"            element={<LifestyleHub />} />
        <Route path="lifestyle/workout"    element={<WorkoutPage />} />
        <Route path="lifestyle/nutrition"  element={<NutritionPage />} />
        <Route path="lifestyle/meditation" element={<MeditationPage />} />
        <Route path="lifestyle/sleep"      element={<SleepPage />} />
        <Route path="lifestyle/water"      element={<WaterPage />} />
        <Route path="lifestyle/scanmeal"   element={<ScanMealPage />} />
        <Route path="lifestyle/horoscope"  element={<HoroscopePage />} />
        <Route path="lifestyle/movies"     element={<MoviesPage />} />
        <Route path="lifestyle/music"      element={<MusicPage />} />
        <Route path="lifestyle/recipes"    element={<RecipesPage />} />
        <Route path="lifestyle/fashion"    element={<FashionPage />} />
        <Route path="lifestyle/travel"     element={<TravelPage />} />
        <Route path="lifestyle/sportstats" element={<SportStatsPage />} />
        <Route path="lifestyle/wellness"   element={<WellnessPage />} />
        <Route path="lifestyle/reading"    element={<ReadingPage />} />
        <Route path="lifestyle/budget"     element={<BudgetLifestylePage />} />
        <Route path="lifestyle/goals"      element={<GoalsPage />} />
        <Route path="lifestyle/gratitude"  element={<GratitudePage />} />
        <Route path="lifestyle/weather"    element={<WeatherPage />} />
        <Route path="lifestyle/mood"       element={<MoodPage />} />

        {/* Outils & Info */}
        <Route path="outils"             element={<OutilsHub />} />
        <Route path="outils/calc"        element={<CalcPage />} />
        <Route path="outils/converter"   element={<ConverterPage />} />
        <Route path="outils/timer"       element={<TimerPage />} />
        <Route path="outils/generator"   element={<GeneratorPage />} />
        <Route path="outils/quicknote"   element={<QuickNotePage />} />
        <Route path="outils/qrcode"      element={<QrCodePage />} />
        <Route path="outils/finance"     element={<FinancePage />} />
        <Route path="outils/crypto"      element={<CryptoPage />} />
        <Route path="outils/budget"      element={<BudgetPage />} />
        <Route path="outils/student"     element={<StudentPage />} />
        <Route path="outils/freelance"   element={<FreelancePage />} />
        <Route path="outils/news"        element={<NewsPage />} />
        <Route path="outils/legal"       element={<LegalPage />} />
        <Route path="outils/code"        element={<CodePage />} />
        <Route path="outils/translate"   element={<TranslateToolPage />} />

        <Route path="profile"  element={<div className="page-body"><div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:16, textAlign:'center' }}><div style={{ width:80, height:80, background:'var(--accent-soft)', borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>👤</div><h2>Profil</h2><p style={{ color:'var(--text3)' }}>Prochainement</p></div></div>} />
        <Route path="settings" element={<div className="page-body"><div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:16, textAlign:'center' }}><div style={{ width:80, height:80, background:'var(--accent-soft)', borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>⚙️</div><h2>Paramètres</h2><p style={{ color:'var(--text3)' }}>Prochainement</p></div></div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter>;
}
