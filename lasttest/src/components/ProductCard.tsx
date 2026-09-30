import { motion } from 'framer-motion';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product) => void;
  index?: number;
}

export default function ProductCard({ product, onOrder, index = 0 }: ProductCardProps) {
  const formatPrice = (price: number) =>
    `KES ${price.toLocaleString('en-KE')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image_url}
          alt={`${product.title} - ${product.category} sold by Rafna Investment in Nairobi`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/hero-bedroom.jpg';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-navy border border-slate-200 shadow-sm">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif text-lg font-semibold text-navy leading-snug">
          {product.title}
        </h3>
        <p className="mt-2 text-sm text-slate-500 line-clamp-2 flex-grow">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-lg font-bold text-gold-dark">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={() => onOrder(product)}
            className="px-5 py-2.5 rounded-lg bg-navy text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-md"
          >
            Order Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
