import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

// Opens the private download link for a purchased (or own) product.
// Returns { ok, message }.
export async function openDownload(productId) {
  // Open the tab first so the browser doesn't treat it as a blocked popup
  const win = window.open('about:blank', '_blank');
  try {
    const snap = await getDoc(doc(db, 'productFiles', productId));
    if (!snap.exists() || !snap.data().downloadUrl) {
      win?.close();
      return { ok: false, message: 'This is a sample listing — no file is attached.' };
    }
    if (win) win.location.href = snap.data().downloadUrl;
    else window.location.href = snap.data().downloadUrl;
    return { ok: true };
  } catch (e) {
    win?.close();
    return { ok: false, message: 'Could not fetch the download link. Please try again.' };
  }
}
