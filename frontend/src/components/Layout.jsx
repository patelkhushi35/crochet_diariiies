import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <AnnouncementBar />
      <Navbar cartCount={itemCount} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

function AnnouncementBar() {
  return (
    <div className="bg-brown-900 text-cream-100 py-2 px-4 text-center text-sm font-medium">
      ✨ Handmade with love • Custom orders available • DM us on Instagram @crochet_diariiies
    </div>
  );
}