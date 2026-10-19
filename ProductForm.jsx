import { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { db } from '../firebase.js';
import { CATEGORIES } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ProductImage from './ProductImage.jsx';

const isUrl = (s) => /^https?:\/\/\S+\.\S+/i.test(s);

// Create or edit a product. `initial` = existing product (edit mode).
export default function ProductForm({ initial, onDone }) {
  const { user, profile } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    title: initial?.title || '',
    category: initial?.category || CATEGORIES[0].name,
    price: initial?.price ?? '',
    description: initial?.description || '',
    imageUrl: initial?.imageUrl || '',
    downloadUrl: '',
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // The private download link lives in a separate document
  useEffect(() => {
    if (!initial) return;
    getDoc(doc(db, 'productFiles', initial.id)).then((s) => {
      if (s.exists()) setForm((f) => ({ ...f, downloadUrl: s.data().downloadUrl || '' }));
    }).catch(() => {});
  }, [initial]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const price = Number(form.price);
    if (!form.title.trim()) return setErr('Please add a title.');
    if (!(price >= 0)) return setErr('Enter a valid price (0 for free).');
    if (form.imageUrl && !isUrl(form.imageUrl)) return setErr('Cover image must be a full link starting with https://');
    if (!isUrl(form.downloadUrl)) return setErr('Add the download link buyers will receive (https://…).');

    const data = {
      title: form.title.trim(),
      category: form.category,
      price,
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
    };
    setBusy(true);
    try {
      if (initial) {
        await updateDoc(doc(db, 'products', initial.id), { ...data, updatedAt: serverTimestamp() });
        await setDoc(doc(db, 'productFiles', initial.id), { downloadUrl: form.downloadUrl.trim(), sellerId: user.uid });
        toast('Product updated');
      } else {
        const ref = await addDoc(collection(db, 'products'), {
          ...data,
          sellerId: user.uid,
          sellerName: profile?.name || user.displayName || 'Creator',
          status: 'published',
          createdAt: serverTimestamp(),
        });
        await setDoc(doc(db, 'productFiles', ref.id), { downloadUrl: form.downloadUrl.trim(), sellerId: user.uid });
        toast('Product published!');
      }
      onDone();
    } catch (e2) {
      setErr(`Could not save: ${e2.code || e2.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-5">
        <h2 className="text-xl font-extrabold text-navy">{initial ? 'Edit product' : 'Add a new product'}</h2>
        {err && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{err}</div>}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
          <input className="input" value={form.title} onChange={set('title')} maxLength={90} placeholder="e.g. Notion Life Planner OS" />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
            <select className="input" value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Price (0 = free)</label>
            <input className="input" type="number" min="0" step="0.01" value={form.price} onChange={set('price')} placeholder="19.99" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <textarea className="input min-h-[130px]" value={form.description} onChange={set('description')} maxLength={2000} placeholder="What's included? Who is it for? File formats?" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Cover image link</label>
          <input className="input" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://… (optional)" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Download link (private)</label>
          <input className="input" value={form.downloadUrl} onChange={set('downloadUrl')} placeholder="Google Drive / Dropbox / Mega link to your file" />
          <p className="text-xs text-slate-400 mt-1.5">Only buyers (and you) can see this link. Make sure the link itself is set to "anyone with the link can view".</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button disabled={busy} className="btn-primary">
            {busy && <Loader2 className="w-4 h-4 animate-spin" />} {initial ? 'Save changes' : 'Publish product'}
          </button>
          <button type="button" onClick={onDone} className="btn-ghost">Cancel</button>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">Preview</p>
        <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="h-44 bg-slate-100">
            <ProductImage product={{ imageUrl: form.imageUrl, category: form.category, title: form.title }} className="w-full h-full" />
          </div>
          <div className="p-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase">{form.category}</p>
            <p className="font-extrabold text-slate-800 mt-1">{form.title || 'Your product title'}</p>
            <p className="text-navy font-black text-xl mt-2">{form.price === '' ? '—' : Number(form.price) === 0 ? 'Free' : `$${Number(form.price).toFixed(2)}`}</p>
          </div>
        </div>
      </div>
    </form>
  );
}
