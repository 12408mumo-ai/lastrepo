import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Truck, ShieldCheck, CreditCard, Home, Store, MessageCircle } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10" />
              <span className="font-serif text-xl font-semibold text-white">
                Rafna Investment
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Premium quality foam, fiber & spring orthopaedic mattresses, luxury
              beddings, and trusted household essentials in Nairobi, Kenya.
            </p>
            <nav aria-label="Footer quick links">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-gold transition">
                    <Home size={16} /> Home
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="inline-flex items-center gap-2 text-slate-400 hover:text-gold transition">
                    <Store size={16} /> Shop
                  </Link>
                </li>
                <li>
                  <a href="https://wa.me/254710565055" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-400 hover:text-gold transition">
                    <MessageCircle size={16} /> WhatsApp Order
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <h4 className="text-white font-serif text-lg mb-5">Policies</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <Truck size={18} className="text-gold mt-0.5 shrink-0" />
                <span>Free delivery within Nairobi & surroundings</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <ShieldCheck size={18} className="text-gold mt-0.5 shrink-0" />
                <span>Country-wide delivery at affordable prices</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <CreditCard size={18} className="text-gold mt-0.5 shrink-0" />
                <span>Pay on Delivery within Nairobi & surroundings</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-serif text-lg mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-gold shrink-0" />
                <a
                  href="tel:+254710565055"
                  className="hover:text-gold transition-colors"
                >
                  0710 565055
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-gold shrink-0" />
                <a
                  href="mailto:rafnainvestment@gmail.com"
                  className="hover:text-gold transition-colors"
                >
                  rafnainvestment@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="text-gold mt-0.5 shrink-0" />
                <span>Kamkunji, Nairobi, Kenya</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-serif text-lg mb-5">Hours</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Monday – Saturday
              <br />
              8:00 AM – 6:00 PM
              <br />
              Sunday: Closed
            </p>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-700/60 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Rafna Investment. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
