"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

// --- BASE DE DONNÉES MASTER BASE 0.8 ---
type LessonCategory = 'CHARISME' | 'ARGENT' | 'ÉCOLE & EXAMENS' | 'PSYCHOLOGIE' | 'PRODUCTIVITÉ' | 'RELATIONS' | 'ENTREPRENEURIAT' | 'BIEN-ÊTRE';
type Lesson = {
  category: LessonCategory;
  title: string;
  question: string;
  answer: string;
  color: string;
};

const ALL_LESSONS: Lesson[] = [
  // CHARISME
  { category: "CHARISME", title: "Élite", question: "Comment maintenir un contact visuel puissant ?", answer: "Regardez l'espace entre les deux yeux ou alternez doucement entre l'œil gauche et l'œil droit.", color: "#3b82f6" },
  { category: "CHARISME", title: "Élite", question: "Technique du 'Mirroring' : comment créer un lien ?", answer: "Imitez subtilement la posture et le rythme de parole de l'autre pour créer une synchronisation.", color: "#3b82f6" },
  { category: "CHARISME", title: "Élite", question: "Comment repérer un mensonge par les yeux ?", answer: "Une personne qui regarde en haut à droite construit souvent une image imaginaire.", color: "#3b82f6" },
  { category: "CHARISME", title: "Élite", question: "L'effet de halo : comment en profiter ?", answer: "Soignez votre apparence. Le cerveau associe automatiquement beauté à compétence.", color: "#3b82f6" },
  { category: "CHARISME", title: "Élite", question: "Comment arrêter une dispute instantanément ?", answer: "Posez une question rationnelle sur un détail technique pour sortir de l'émotionnel.", color: "#3b82f6" },
  { category: "CHARISME", title: "Élite", question: "La technique de la faveur de Benjamin Franklin ?", answer: "Demandez un petit service à quelqu'un. Son cerveau conclura qu'il vous apprécie.", color: "#3b82f6" },
  { category: "CHARISME", title: "Élite", question: "Comment paraître confiant dans une pièce ?", answer: "Entrez, repérez un détail au loin, marchez vers lui avec détermination.", color: "#3b82f6" },
  // ARGENT
  { category: "ARGENT", title: "Hustler", question: "Quelle est la règle n°1 pour devenir riche ?", answer: "Ne travaillez pas pour l'argent, faites en sorte que l'argent travaille pour vous.", color: "#059669" },
  { category: "ARGENT", title: "Hustler", question: "L'effet d'ancrage en négociation ?", answer: "Donnez le premier chiffre. Il servira de base mentale pour toute la suite.", color: "#059669" },
  { category: "ARGENT", title: "Hustler", question: "Différence entre Actif et Passif ?", answer: "Un actif met de l'argent dans votre poche. Un passif en sort.", color: "#059669" },
  { category: "ARGENT", title: "Hustler", question: "La loi de l'offre et de la demande ?", answer: "Plus une compétence est rare et demandée, plus votre temps est facturé cher.", color: "#059669" },
  { category: "ARGENT", title: "Hustler", question: "Comment vendre à coup sûr ?", answer: "Ne vendez pas un produit, vendez la solution à un problème douloureux.", color: "#059669" },
  { category: "ARGENT", title: "Hustler", question: "Le pouvoir des intérêts composés ?", answer: "C'est l'effet boule de neige : vos gains génèrent eux-mêmes des gains.", color: "#059669" },
  // ÉCOLE & RÉUSSITE
  { category: "ÉCOLE & EXAMENS", title: "Major", question: "Comment convaincre un prof de remonter une note ?", answer: "Demandez lui : Comment puis-je m'améliorer pour atteindre 18/20 ?", color: "#ef4444" },
  { category: "ÉCOLE & EXAMENS", title: "Major", question: "Loi de Parkinson : comment réviser plus vite ?", answer: "Fixez-vous une deadline ultra-courte. Le travail se contracte pour s'y adapter.", color: "#ef4444" },
  { category: "ÉCOLE & EXAMENS", title: "Major", question: "La technique Pomodoro ?", answer: "Travaillez 25 min à fond, puis 5 min de pause totale. Répétez.", color: "#ef4444" },
  { category: "ÉCOLE & EXAMENS", title: "Major", question: "Le rappel actif (Active Recall) ?", answer: "Fermez votre livre et essayez de tout réécrire de mémoire. 10x plus efficace.", color: "#ef4444" },
  { category: "ÉCOLE & EXAMENS", title: "Major", question: "L'espacement des révisions ?", answer: "Révisez à J+1, J+7, J+30 pour ancrer l'info en mémoire longue.", color: "#ef4444" },
  { category: "ÉCOLE & EXAMENS", title: "Major", question: "Comment ne plus avoir peur de l'échec ?", answer: "Considérez chaque erreur comme un retour d'expérience technique.", color: "#ef4444" },
  { category: "ÉCOLE & EXAMENS", title: "Major", question: "Le secret d'un sommeil réparateur ?", answer: "Pas d'écrans 1h avant de dormir pour laisser le cerveau trier les infos.", color: "#ef4444" },
  { category: "ÉCOLE & EXAMENS", title: "Major", question: "Comment rester concentré en cours ?", answer: "Prenez des notes manuscrites. Le mouvement force le cerveau à rester engagé.", color: "#ef4444" },
  { category: "ÉCOLE & EXAMENS", title: "Major", question: "L'astuce du chocolat noir ?", answer: "Un carré avant un examen booste le flux sanguin vers le cerveau.", color: "#ef4444" },
  // PSYCHOLOGIE
  { category: "PSYCHOLOGIE", title: "Mental", question: "Qu'est-ce que la dissonance cognitive ?", answer: "C'est la tension que ressent le cerveau quand deux croyances sont en contradiction.", color: "#8b5cf6" },
  { category: "PSYCHOLOGIE", title: "Mental", question: "Comment renforcer la mémoire ?", answer: "Répétez l'information à voix haute, puis essayez de la rappeler sans notes.", color: "#8b5cf6" },
  { category: "PSYCHOLOGIE", title: "Mental", question: "Quel rôle joue l'attention sélective ?", answer: "Elle filtre les distractions et rend vos décisions plus rapides et efficaces.", color: "#8b5cf6" },
  { category: "PSYCHOLOGIE", title: "Mental", question: "Comment contrôler ses émotions ?", answer: "Nommer ce que vous ressentez calme le cortex et réduit l'impulsion.", color: "#8b5cf6" },
  { category: "PSYCHOLOGIE", title: "Mental", question: "Pourquoi le biais de confirmation est dangereux ?", answer: "Il vous pousse à chercher uniquement les informations qui confirment ce que vous croyez déjà.", color: "#8b5cf6" },
  { category: "PSYCHOLOGIE", title: "Mental", question: "Comment utiliser l'effet « pied-dans-la-porte » ?", answer: "Commencez par une petite demande, puis montez progressivement vers l'objectif réel.", color: "#8b5cf6" },

  // PRODUCTIVITÉ
  { category: "PRODUCTIVITÉ", title: "Flow", question: "Quelle est la règle des 2 minutes ?", answer: "Si une tâche prend moins de 2 minutes, faites-la immédiatement.", color: "#14b8a6" },
  { category: "PRODUCTIVITÉ", title: "Flow", question: "Qu'est-ce que la loi de Pareto ?", answer: "80% des résultats viennent de 20% des efforts. Concentrez-vous sur ces 20%.", color: "#14b8a6" },
  { category: "PRODUCTIVITÉ", title: "Flow", question: "Comment éviter le multitâche ?", answer: "Planifiez des blocs de concentration et fermez toutes les distractions.", color: "#14b8a6" },
  { category: "PRODUCTIVITÉ", title: "Flow", question: "Pourquoi le temps limité booste l'efficacité ?", answer: "Une deadline serrée force le cerveau à trier l'essentiel.", color: "#14b8a6" },
  { category: "PRODUCTIVITÉ", title: "Flow", question: "La règle Pomodoro, c'est quoi ?", answer: "25 min de focus puis 5 min de pause ; répétez 4 fois pour être en flow.", color: "#14b8a6" },
  { category: "PRODUCTIVITÉ", title: "Flow", question: "Quel est le meilleur début de journée ?", answer: "Commencez par la tâche la plus difficile pour profiter d'une énergie maximale.", color: "#14b8a6" },

  // RELATIONS
  { category: "RELATIONS", title: "Influence", question: "Comment créer un rapport instantané ?", answer: "Écoutez activement et reproduisez les mots-clés de votre interlocuteur.", color: "#fb923c" },
  { category: "RELATIONS", title: "Influence", question: "La règle des 5 secondes en networking ?", answer: "Présentez-vous dans les 5 premières secondes pour rester mémorable.", color: "#fb923c" },
  { category: "RELATIONS", title: "Influence", question: "Comment désamorcer un conflit ?", answer: "Accusez un léger flou : « Je peux me tromper, mais... », puis reformulez.", color: "#fb923c" },
  { category: "RELATIONS", title: "Influence", question: "Quel secret pour un bon compliment ?", answer: "Faites-le spécifique et sincère, pas générique.", color: "#fb923c" },
  { category: "RELATIONS", title: "Influence", question: "Comment poser une question puissante ?", answer: "Utilisez « Et si... » pour ouvrir l'esprit et inviter à imaginer.", color: "#fb923c" },
  { category: "RELATIONS", title: "Influence", question: "Pourquoi la gratitude fonctionne ?", answer: "Elle active le circuit de la récompense et renforce la connexion humaine.", color: "#fb923c" },

  // ENTREPRENEURIAT
  { category: "ENTREPRENEURIAT", title: "Startup", question: "Quelle est la règle d'or du MVP ?", answer: "Lancez vite avec le minimum validé par les premiers clients.", color: "#f59e0b" },
  { category: "ENTREPRENEURIAT", title: "Startup", question: "Comment trouver une idée rentable ?", answer: "Cherchez un problème récurrent que les gens acceptent déjà de payer pour résoudre.", color: "#f59e0b" },
  { category: "ENTREPRENEURIAT", title: "Startup", question: "Pourquoi tester rapidement ?", answer: "Un test rapide coûte moins cher qu'un produit fini qui ne se vend pas.", color: "#f59e0b" },
  { category: "ENTREPRENEURIAT", title: "Startup", question: "Le meilleur positionnement produit ?", answer: "Soyez le plus simple à comprendre et le plus difficile à ignorer.", color: "#f59e0b" },
  { category: "ENTREPRENEURIAT", title: "Startup", question: "Comment améliorer l'offre ?", answer: "Interrogez vos clients sur ce qu'ils aimeraient voir en plus.", color: "#f59e0b" },
  { category: "ENTREPRENEURIAT", title: "Startup", question: "Qu'est-ce qu'un canal d'acquisition ?", answer: "C'est le chemin par lequel un client potentiel découvre votre produit.", color: "#f59e0b" },

  // BIEN-ÊTRE
  { category: "BIEN-ÊTRE", title: "Zen", question: "Pourquoi respirer profondément aide-t-il ?", answer: "Cela baisse le rythme cardiaque et permet de mieux se recentrer.", color: "#22c55e" },
  { category: "BIEN-ÊTRE", title: "Zen", question: "Comment créer une routine matinale ?", answer: "Commencez par de l'eau, quelques étirements et un objectif clair pour la journée.", color: "#22c55e" },
  { category: "BIEN-ÊTRE", title: "Zen", question: "Quel est l'effet du sommeil réparateur ?", answer: "Il permet au cerveau de trier les informations et de consolider la mémoire.", color: "#22c55e" },
  { category: "BIEN-ÊTRE", title: "Zen", question: "Comment réduire l'anxiété rapidement ?", answer: "Focalisez-vous sur votre respiration en comptant 4-7-8.", color: "#22c55e" },
  { category: "BIEN-ÊTRE", title: "Zen", question: "Pourquoi marcher aide-t-il ?", answer: "Le mouvement libère des endorphines et clarifie les idées.", color: "#22c55e" },
  { category: "BIEN-ÊTRE", title: "Zen", question: "Quelle est la meilleure pause ?", answer: "Un vrai microbreak sans écran pour laisser le cerveau se reposer.", color: "#22c55e" }
];

type ThemeMode = 'light' | 'dark' | 'system';

export default function Page() {
  const router = useRouter();
  const [view, setView] = useState('home');
  const [activePack, setActivePack] = useState<Lesson[]>([]);
  const [index, setIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [streak, setStreak] = useState(0);
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [session, setSession] = useState<Session | null>(null);
  const [revealedLessons, setRevealedLessons] = useState<boolean[]>([]);
  const [xpByCategory, setXpByCategory] = useState<Record<LessonCategory, number>>({
    CHARISME: 0,
    ARGENT: 0,
    'ÉCOLE & EXAMENS': 0,
    PSYCHOLOGIE: 0,
    PRODUCTIVITÉ: 0,
    RELATIONS: 0,
    ENTREPRENEURIAT: 0,
    'BIEN-ÊTRE': 0
  });
  
  // NOUVEL ÉTAT POUR L'INTERACTIVITÉ DES CONTOURS
  const [hoveredCard, setHoveredCard] = useState<LessonCategory | null>(null);

  useEffect(() => {
    const savedStreak = localStorage.getItem('atomos-streak');
    if (savedStreak) setStreak(parseInt(savedStreak));
    const savedTheme = localStorage.getItem('atomos-theme');
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
      setTheme(savedTheme);
    } else {
      setTheme('system');
    }

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const changeTheme = (t: ThemeMode) => {
    setTheme(t);
    localStorage.setItem('atomos-theme', t);
  };

  const categories: LessonCategory[] = ['CHARISME', 'ARGENT', 'ÉCOLE & EXAMENS', 'PSYCHOLOGIE', 'PRODUCTIVITÉ', 'RELATIONS', 'ENTREPRENEURIAT', 'BIEN-ÊTRE'];

  const getBadgeLabel = (xp: number) => {
    if (xp >= 120) return 'Maître Mentaliste';
    if (xp >= 80) return 'Hustler Élite';
    if (xp >= 50) return 'Hustler';
    if (xp >= 25) return 'Apprenti';
    return 'Débutant';
  };

  const awardXp = (category: LessonCategory, amount: number) => {
    setXpByCategory((prev) => ({ ...prev, [category]: prev[category] + amount }));
  };

  const markRevealed = (lessonIndex: number) => {
    setRevealedLessons((prev) => {
      if (prev[lessonIndex]) return prev;
      const next = [...prev];
      next[lessonIndex] = true;
      return next;
    });
  };

  const getCategoryProgress = (category: LessonCategory) => {
    const total = ALL_LESSONS.filter((l) => l.category === category).length;
    const xp = xpByCategory[category] || 0;
    if (!total) return 0;
    const maxPossible = total * 10;
    return Math.min(100, Math.round((xp / Math.max(1, maxPossible)) * 100));
  };

  const activeSectionCount = activePack.length ? Math.min(3, activePack.length) : 1;
  const currentSectionIndex = activePack.length ? Math.floor(index / Math.ceil(activePack.length / activeSectionCount)) : 0;
  const isPackFullyRevealed = activePack.length > 0 && revealedLessons.length === activePack.length && revealedLessons.every(Boolean);
  const revealedCount = revealedLessons.filter(Boolean).length;

  const revealCurrentAnswer = () => {
    if (showResponse || !activePack.length) {
      setShowResponse(true);
      return;
    }

    setShowResponse(true);
    markRevealed(index);
    awardXp(activePack[index].category, 10);
  };

  const startPack = (category: LessonCategory) => {
    const filtered = ALL_LESSONS.filter((l) => l.category === category);
    setActivePack(filtered);
    setIndex(0);
    setShowResponse(false);
    setRevealedLessons(new Array(filtered.length).fill(false));
    setView('quiz');
  };

  const handleNext = () => {
    setShowResponse(false);
    if (index < activePack.length - 1) {
      setIndex(index + 1);
    } else {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('atomos-streak', newStreak.toString());
      setView('finish');
    }
  };

  const handleBack = () => {
    if (index > 0) {
      setIndex(index - 1);
      setShowResponse(false);
    } else {
      setView('home');
    }
  };

  const handleFastForward = () => {
    if (index < activePack.length - 1) {
      setIndex(index + 1);
      setShowResponse(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.push('/');
  };

  const shareOnTikTok = async () => {
    const text = `Je viens de valider mon pack sur Atomos Pro ! 🔥 Série : ${streak} jours. Rejoins l'élite. #AtomosLearn`;
    try {
      await navigator.clipboard.writeText(text);
      window.open("https://www.tiktok.com/upload", "_blank");
    } catch (err) {
      window.open("https://www.tiktok.com/upload", "_blank");
    }
  };

  const dynamicCss = `
    :root {
      --bg-app: ${theme === 'dark' ? '#0a0a0c' : '#f4f4f7'};
      --bg-card: ${theme === 'dark' ? '#16161a' : '#ffffff'};
      --text-main: ${theme === 'dark' ? '#ffffff' : '#000000'};
      --text-sub: ${theme === 'dark' ? '#999999' : '#666666'};
      --border: ${theme === 'dark' ? '1px solid #222' : '1px solid #eee'};
      --premium-color: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
    }
    body { background-color: var(--bg-app); color: var(--text-main); margin: 0; font-family: sans-serif; transition: background 0.3s ease; }
    .card { 
      background: var(--bg-card); 
      border: var(--border); 
      border-radius: 30px; 
      box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
      transition: border 0.2s ease, box-shadow 0.2s ease; 
    }
    
    .theme-top-bar {
      position: fixed;
      top: 15px;
      right: 20px;
      left: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 9999;
    }
    .nav-logo {
      font-weight: 900;
      font-size: 18px;
      cursor: pointer;
      background: var(--bg-card);
      padding: 8px 15px;
      border-radius: 12px;
      border: var(--border);
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .theme-switcher {
      display: flex;
      gap: 8px;
      background: var(--bg-card);
      padding: 6px;
      border-radius: 12px;
      border: var(--border);
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .theme-btn {
      background: none;
      border: none;
      padding: 6px 10px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s;
    }

    .premium-action-btn {
      color: var(--premium-color);
      font-weight: 800;
      cursor: pointer;
      font-size: 14px;
      padding: 12px 24px;
      border: 2.5px solid var(--premium-color);
      border-radius: 15px;
      display: inline-block;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .premium-action-btn:hover {
      background: var(--premium-color);
      color: #fff;
      box-shadow: 0 0 15px var(--premium-color);
    }
  `;

  return (
    <div style={{ padding: '80px 20px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      <style>{dynamicCss}</style>

      {/* HEADER DE NAVIGATION PERSISTANT */}
      <div className="theme-top-bar">
        <div className="nav-logo" onClick={() => setView('home')}>
          ATOMOS<span style={{ color: '#3b82f6' }}>PRO</span>
        </div>
        
        <div className="theme-switcher">
          {([
            { id: 'light', icon: '☀️' },
            { id: 'dark', icon: '🌙' },
            { id: 'system', icon: '💻' }
          ] as const).map((option) => (
            <button 
              key={option.id} 
              onClick={() => changeTheme(option.id)} 
              className="theme-btn"
              style={{ 
                background: theme === option.id ? '#3b82f6' : 'transparent',
                color: theme === option.id ? '#fff' : 'var(--text-main)',
                border: theme === option.id ? '1px solid #3b82f6' : 'none'
              }}
            >
              {option.icon}
            </button>
          ))}
        </div>
        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' }}>
            <span style={{ color: 'var(--text-sub)', fontSize: '14px' }}>Connecté·e : {session.user.email}</span>
            <button
              type="button"
              onClick={handleSignOut}
              style={{
                background: '#2563eb',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <a
            href="/login"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'var(--border)',
              textDecoration: 'none',
              fontWeight: 700,
              marginLeft: '12px',
            }}
          >
            Se connecter
          </a>
        )}
      </div>

      {/* VUE ACCUEIL (AVEC CONTOURS COLORÉS INTERACTIFS) */}
      {view === 'home' && (
        <>
          <h1 style={{ fontSize: '32px', fontWeight: '900', marginTop: '20px' }}>Bienvenue 👋</h1>
          <p style={{ color: 'var(--text-sub)', marginBottom: '12px' }}>Choisis ton domaine de maîtrise</p>
          <p style={{ color: 'var(--text-sub)', marginBottom: '40px', maxWidth: '680px', lineHeight: '1.6' }}>Pour décrocher le badge INCROYABLE, commence chaque pack en révélant les réponses. Plus tu ouvres de secrets, plus tu gagnes de XP, de rangs et de badges.</p>
          <div style={{ width: '100%', maxWidth: '920px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
            {categories.map((cat) => {
              const lesson = ALL_LESSONS.find((l) => l.category === cat)!;
              const isHovered = hoveredCard === cat;
              const borderStyle = isHovered ? `2.5px solid ${lesson.color}` : 'var(--border)';
              const progress = getCategoryProgress(cat);
              const badge = getBadgeLabel(xpByCategory[cat]);

              return (
                <div
                  key={cat}
                  onClick={() => startPack(cat)}
                  onMouseEnter={() => setHoveredCard(cat)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="card"
                  style={{
                    padding: '25px',
                    cursor: 'pointer',
                    border: borderStyle,
                    boxShadow: isHovered ? `0 8px 30px rgba(0,0,0,0.12)` : `0 4px 20px rgba(0,0,0,0.08)`,
                    minHeight: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{ color: lesson.color, fontSize: '12px', fontWeight: '800' }}>{cat}</span>
                    <h3 style={{ margin: '10px 0 8px 0' }}>Pack {lesson.title}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-sub)', marginBottom: '18px' }}>{ALL_LESSONS.filter((l) => l.category === cat).length} leçons</p>
                    <div style={{ width: '100%', height: '8px', background: theme === 'dark' ? '#2a2a2e' : '#e5e7eb', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
                      <div style={{ width: `${progress}%`, height: '100%', background: lesson.color, transition: 'width 0.3s ease' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-sub)' }}>
                      <span>{progress}%</span>
                      <span>{badge}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '18px', fontSize: '13px', color: 'var(--text-sub)' }}>
                    Clique pour démarrer et accumuler XP.
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '12px 25px', borderRadius: '50px', border: 'var(--border)', color: '#f97316', fontWeight: 'bold' }}>
              🔥 SÉRIE : {streak} JOURS
            </div>
          </div>
        </>
      )}

      {/* VUE QUIZ */}
      {view === 'quiz' && (
        <>
          <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button onClick={handleBack} style={{ background: 'none', border: 'none', color: 'var(--text-sub)', fontSize: '24px', cursor: 'pointer', padding: '0 5px' }}>←</button>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${activeSectionCount}, minmax(0, 1fr))`, gap: '8px' }}>
                {Array.from({ length: activeSectionCount }).map((_, segmentIndex) => (
                  <div key={segmentIndex} style={{
                    height: '8px',
                    borderRadius: '999px',
                    background: segmentIndex <= currentSectionIndex ? activePack[index].color : (theme === 'dark' ? '#2a2a2e' : '#ddd'),
                    boxShadow: segmentIndex <= currentSectionIndex ? `0 0 12px ${activePack[index].color}33` : 'none'
                  }} />
                ))}
              </div>
              <button onClick={handleFastForward} style={{ background: 'none', border: 'none', color: index === activePack.length - 1 ? 'transparent' : 'var(--text-sub)', fontSize: '24px', cursor: index === activePack.length - 1 ? 'default' : 'pointer', padding: '0 5px' }}>→</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-sub)', fontSize: '13px' }}>
              <span>Leçon {index + 1}/{activePack.length}</span>
              <span>Section {currentSectionIndex + 1}/{activeSectionCount}</span>
            </div>
          </div>

          <div className="card" style={{ width: '100%', maxWidth: '420px', minHeight: '450px', padding: '45px 35px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: theme === 'dark' ? '2px solid #555' : undefined }}>  
            <div>
              <span style={{ color: activePack[index].color, fontWeight: '900', fontSize: '12px', display: 'block', marginBottom: '12px' }}>{activePack[index].category}</span>
              <div style={{ marginBottom: '18px', color: 'var(--text-sub)', fontSize: '14px' }}>
                Réponses révélées : {revealedCount}/{activePack.length}. Pour décrocher le badge INCROYABLE, ouvre chaque secret.
              </div>
              <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ fontSize: '24px', lineHeight: '1.4' }}>{showResponse ? activePack[index].answer : activePack[index].question}</h2>
              </div>
            </div>
            {!showResponse ? (
              <button onClick={revealCurrentAnswer} style={{ backgroundColor: activePack[index].color, color: '#fff', padding: '22px', width: '100%', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '17px' }}>Révéler le secret</button>
            ) : (
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => setShowResponse(false)} style={{ backgroundColor: theme === 'dark' ? '#222' : '#eee', color: theme === 'dark' ? '#eee' : '#111', padding: '22px', flex: 1, borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '17px' }}>Réviser</button>
                <button onClick={handleNext} style={{ backgroundColor: theme === 'dark' ? '#fff' : '#000', color: theme === 'dark' ? '#000' : '#fff', padding: '22px', flex: 1, borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '17px' }}>{index === activePack.length - 1 ? "Terminer" : "Suivant"}</button>
              </div>
            )}
          </div>
          <p onClick={() => setView('home')} style={{ marginTop: '30px', color: 'var(--text-sub)', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>✕ Abandonner la session</p>
        </>
      )}

      {/* VUE FINISH */}
      {view === 'finish' && (
        <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '50px 30px', textAlign: 'center' }}>
          <div style={{ fontSize: '60px', marginBottom: '10px' }}>🏆</div>
          <div style={{ background: theme === 'dark' ? 'rgba(249, 115, 22, 0.1)' : '#fff7ed', borderRadius: '12px', padding: '8px 16px', display: 'inline-block', marginBottom: '20px', border: '1px solid #ffedd5' }}>
            <span style={{ fontWeight: '800', color: '#f97316' }}>🔥 SÉRIE : {streak} JOURS</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', margin: '10px 0' }}>{isPackFullyRevealed ? 'INCROYABLE !' : 'Presque...'}</h1>
          <p style={{ color: 'var(--text-sub)', marginBottom: '30px' }}>{isPackFullyRevealed ? 'Tu as ouvert toutes les réponses et validé ton pack.' : 'Tu as terminé le pack, mais tu dois ouvrir chaque réponse pour prétendre au badge INCROYABLE.'}</p>
          
          <button 
            onClick={() => setView('home')} 
            style={{ 
              background: theme === 'dark' ? '#fff' : '#000', 
              color: theme === 'dark' ? '#000' : '#fff', 
              width: '180px', 
              padding: '14px', 
              borderRadius: '15px', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              marginBottom: '15px' 
            }}
          >
            Retour au menu
          </button>
          
          <div onClick={shareOnTikTok} style={{ padding: '15px', borderRadius: '15px', background: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff', color: theme === 'dark' ? '#60a5fa' : '#1e40af', fontWeight: 'bold', cursor: 'pointer', border: '1px solid #dbeafe', marginBottom: '25px', width: '220px', margin: '0 auto 25px' }}>Partager sur TikTok 🚀</div>
          
          <div className="premium-action-btn" onClick={() => alert("Premium arrive bientôt !")}>
            Devenir Membre Premium →
          </div>
        </div>
      )}
    </div>
  );
}
