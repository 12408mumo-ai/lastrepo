import { Truck, MapPin, CreditCard } from 'lucide-react';

const badges = [
  {
    icon: Truck,
    title: 'Free Delivery',
    text: 'Within Nairobi & surrounding areas',
  },
  {
    icon: MapPin,
    title: 'Country-wide Delivery',
    text: 'Affordable shipping to every county',
  },
  {
    icon: CreditCard,
    title: 'Pay on Delivery',
    text: 'Available within Nairobi & surroundings',
  },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {badges.map((badge) => (
        <div
          key={badge.title}
          className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm"
        >
          <div className="p-3 rounded-xl bg-gold-light text-gold-dark">
            <badge.icon size={22} />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-navy">{badge.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{badge.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
