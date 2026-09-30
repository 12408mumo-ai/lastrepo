import { useState } from 'react';
import { X, Truck, Store, MessageCircle } from 'lucide-react';
import { Product, OrderForm } from '../types';

interface OrderModalProps {
  product: Product;
  onClose: () => void;
}

const WHATSAPP_NUMBER = '254710565055';

export default function OrderModal({ product, onClose }: OrderModalProps) {
  const [form, setForm] = useState<OrderForm>({
    fulfillment: 'Delivery',
    fullName: '',
    phone: '',
    location: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof OrderForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!form.phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    if (form.fulfillment === 'Delivery' && !form.location.trim()) {
      setError('Please enter a delivery location.');
      return;
    }

    setSubmitting(true);

    const locationText =
      form.fulfillment === 'Delivery'
        ? form.location.trim()
        : 'Kamkunji Pick Up';

    const message =
      `Hello Rafna Investment, I would like to order: ` +
      `Product: ${product.title}, ` +
      `Price: ${product.price.toLocaleString('en-KE')} KES, ` +
      `Fulfillment: ${form.fulfillment}, ` +
      `Location: ${locationText}, ` +
      `Name: ${form.fullName.trim()}, ` +
      `Phone: ${form.phone.trim()}`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    window.open(url, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          aria-label="Close order form"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex gap-4 items-start">
            <img
              src={product.image_url}
              alt={product.title}
              className="w-20 h-20 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <p className="text-xs font-medium text-gold-dark uppercase tracking-wide">
                {product.category}
              </p>
              <h2 className="font-serif text-xl font-semibold text-navy mt-0.5">
                {product.title}
              </h2>
              <p className="text-lg font-bold text-navy mt-1">
                KES {product.price.toLocaleString('en-KE')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fulfillment Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('fulfillment', 'Delivery')}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                    form.fulfillment === 'Delivery'
                      ? 'border-gold bg-gold-light/50 text-navy'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Truck size={18} className={form.fulfillment === 'Delivery' ? 'text-gold-dark' : 'text-slate-400'} />
                  <div>
                    <p className="text-sm font-medium">Delivery</p>
                    <p className="text-xs text-slate-500">Free within Nairobi</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('fulfillment', 'Shop Pick Up')}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                    form.fulfillment === 'Shop Pick Up'
                      ? 'border-gold bg-gold-light/50 text-navy'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Store size={18} className={form.fulfillment === 'Shop Pick Up' ? 'text-gold-dark' : 'text-slate-400'} />
                  <div>
                    <p className="text-sm font-medium">Shop Pick Up</p>
                    <p className="text-xs text-slate-500">Kamkunji, Nairobi</p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
                placeholder="John Kamau"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
                placeholder="0710 565055"
              />
            </div>

            {form.fulfillment === 'Delivery' && (
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
                  Delivery Location
                </label>
                <input
                  id="location"
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
                  placeholder="e.g. Westlands, Nairobi"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium py-3.5 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <MessageCircle size={20} />
              {submitting ? 'Opening WhatsApp…' : 'Send Order via WhatsApp'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
