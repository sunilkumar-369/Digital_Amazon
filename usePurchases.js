import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useAuth } from '../context/AuthContext.jsx';

// Live list of the signed-in buyer's purchases
export function usePurchases() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setPurchases([]); setLoading(false); return; }
    setLoading(true);
    return onSnapshot(
      collection(db, 'users', user.uid, 'purchases'),
      (snap) => {
        setPurchases(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) => (b.purchasedAt?.seconds || 0) - (a.purchasedAt?.seconds || 0))
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, [user]);

  return { purchases, loading, owns: (id) => purchases.some((p) => p.productId === id) };
}
