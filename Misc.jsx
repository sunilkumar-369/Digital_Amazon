import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { isConfigured } from '../firebase.js';

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Shown until Firebase keys are added
export function ConfigBanner() {
  if (isConfigured) return null;
  return (
    <div className="bg-amber-100 text-amber-900 text-sm px-4 py-3 flex items-start sm:items-center gap-3 justify-center">
      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" />
      <span>
        <b>Firebase isn't connected yet.</b> Browsing works with sample data; sign-in and selling need your
        <code className="mx-1 px-1 bg-amber-200/60 rounded">VITE_FIREBASE_*</code> keys (see README).
      </span>
    </div>
  );
}
