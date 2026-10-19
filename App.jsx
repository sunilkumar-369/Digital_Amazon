import { Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { ScrollToTop, ConfigBanner } from './components/Misc.jsx';
import Home from './pages/Home.jsx';
import Browse from './pages/Browse.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Library from './pages/Library.jsx';
import Login from './pages/Login.jsx';
import Sell from './pages/Sell.jsx';
import Dashboard from './pages/Dashboard.jsx';

function NotFound() {
  return (
    <div className="max-w-xl mx-auto text-center py-28 px-4">
      <p className="text-7xl font-black text-navy">404</p>
      <p className="text-slate-500 mt-3 mb-8">That page doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-accent selection:text-white">
      <ScrollToTop />
      <ConfigBanner />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
