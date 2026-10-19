import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { isConfigured } from '../firebase.js';

const friendly = (err) => {
  const code = err?.code || '';
  if (code.includes('email-already-in-use')) return 'That email is already registered. Try signing in.';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'Incorrect email or password.';
  if (code.includes('weak-password')) return 'Password must be at least 6 characters.';
  if (code.includes('invalid-email')) return 'Please enter a valid email address.';
  if (code.includes('popup-closed')) return 'Sign-in window was closed.';
  if (code.includes('unauthorized-domain')) return 'This domain is not authorised in Firebase (Authentication → Settings → Authorized domains).';
  if (code.includes('operation-not-allowed')) return 'This sign-in method is not enabled in Firebase yet.';
  if (code.includes('permission-denied')) return 'Database permission denied — publish the Firestore rules from the README.';
  return err?.message?.replace('Firebase:', '').trim() || 'Something went wrong.';
};

export default function Login() {
  const { user, profile, register, login, loginWithGoogle, resetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(location.state?.mode || 'login');
  const [role, setRole] = useState(location.state?.role || 'buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const from = location.state?.from;
  if (user && profile) {
    return <Navigate to={from || (profile.role === 'seller' ? '/dashboard' : '/')} replace />;
  }

  const run = async (fn, okMsg) => {
    if (!isConfigured) { setError('Firebase keys are missing — see the README to connect your project.'); return; }
    setError(''); setBusy(true);
    try { await fn(); toast(okMsg); }
    catch (e) { setError(friendly(e)); }
    finally { setBusy(false); }
  };

  const submit = (e) => {
    e.preventDefault();
    if (mode === 'register') run(() => register({ name: name.trim(), email, password, role }), 'Account created!');
    else run(() => login(email, password), 'Welcome back!');
  };

  const forgot = async () => {
    if (!email) { setError('Enter your email above first.'); return; }
    run(() => resetPassword(email), 'Password reset email sent');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
        <div className="bg-navy p-6 text-center">
          <ShieldCheck className="w-12 h-12 text-accent mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white tracking-tight">{mode === 'login' ? 'Secure login' : 'Create your account'}</h1>
        </div>

        <div className="p-7">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-5 border border-red-100">{error}</div>}

          {mode === 'register' && (
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">I want to…</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setRole('buyer')} className={`flex-1 py-2.5 rounded-xl border-2 font-semibold transition-all ${role === 'buyer' ? 'border-navy bg-navy/5 text-navy' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>Buy products</button>
                <button type="button" onClick={() => setRole('seller')} className={`flex-1 py-2.5 rounded-xl border-2 font-semibold transition-all ${role === 'seller' ? 'border-teal bg-teal/5 text-teal' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>Sell products</button>
              </div>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input className="input !pl-10" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
              </div>
            )}
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input className="input !pl-10" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input className="input !pl-10" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (6+ characters)" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
            </div>
            {mode === 'login' && (
              <button type="button" onClick={forgot} className="text-xs font-semibold text-navy hover:underline">Forgot password?</button>
            )}
            <button disabled={busy} className="btn-primary w-full">
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5 text-xs text-slate-400 font-semibold">
            <div className="flex-1 h-px bg-slate-200" /> OR <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            disabled={busy}
            onClick={() => run(() => loginWithGoogle(role), 'Signed in with Google')}
            className="btn-ghost w-full"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-slate-500 font-medium">
            {mode === 'login' ? (
              <>New to TrustVault? <button onClick={() => { setMode('register'); setError(''); }} className="text-navy font-bold hover:underline">Create an account</button></>
            ) : (
              <>Already registered? <button onClick={() => { setMode('login'); setError(''); }} className="text-navy font-bold hover:underline">Sign in</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
