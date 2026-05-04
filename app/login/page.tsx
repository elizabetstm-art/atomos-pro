"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [session, setSession] = useState<null | { access_token: string; user: { email: string } }>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session as any);
        router.push('/');
      }
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session as any);
        router.push('/');
      } else {
        setSession(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setMessage(`Erreur : ${error.message}`);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setMessage('Tu es déconnecté.');
    setLoading(false);
  };

  return (
    <main style={{ padding: '80px 20px 40px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '460px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>Connexion Atomos Learn</h1>
        <p style={{ color: '#6b7280', marginBottom: '40px' }}>
          Connecte-toi en un clic avec Google pour synchroniser ton apprentissage et débloquer les packs premium.
        </p>

        {session ? (
          <div style={{ padding: '28px', borderRadius: '24px', border: '1px solid #e5e7eb', background: '#ffffff', boxShadow: '0 12px 40px rgba(15,23,42,0.08)' }}>
            <p style={{ marginBottom: '12px', fontWeight: 700 }}>Connecté en tant que</p>
            <p style={{ marginBottom: '20px', color: '#111827' }}>{session.user.email}</p>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '18px',
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {loading ? 'Patiente...' : 'Se déconnecter'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '18px', background: '#ffffff', padding: '28px', borderRadius: '24px', border: '1px solid #e5e7eb', boxShadow: '0 12px 40px rgba(15,23,42,0.08)' }}>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px 18px',
                borderRadius: '18px',
                border: '2px solid #d1d5db',
                background: '#ffffff',
                color: '#111827',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Connexion en cours...' : 'Se connecter avec Google'}
            </button>

            {message && (
              <p style={{ color: message.includes('Erreur') ? '#dc2626' : '#059669', fontSize: '15px', marginTop: '12px' }}>
                {message}
              </p>
            )}

            <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '12px' }}>
              Pas de compte ? Un compte est créé automatiquement à ta première connexion.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

