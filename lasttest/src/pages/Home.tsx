import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bed, Sofa, ShoppingBag, Package, LucideIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import TrustBadges from '../components/TrustBadges';
import OrderModal from '../components/OrderModal';
import SEO from '../components/SEO';
import { Product, Category, DEFAULT_CATEGORIES } from '../types';
import { getProducts } from '../lib/products';
import { SITE_URL, DEFAULT_DESCRIPTION } from '../lib/seo';

interface CategoryCard {
  title: Category;
  text: string;
  icon: LucideIcon;
  image: string;
}

const CATEGORY_DETAILS: Record<string, { text: string; icon: LucideIcon }> = {
  'Orthopaedic Mattresses': {
    text: 'Foam, fiber & spring support for healthy sleep.',
    icon: Bed,
  },
  Beddings: {
    text: 'Duvets, sheets & sets finished with luxury.',
    icon: Sofa,
  },
  Households: {
    text: 'Pillows, protectors & everyday home essentials.',
    icon: ShoppingBag,
  },
};

const DEFAULT_CATEGORY_CARDS: CategoryCard[] = [
  {
    title: 'Orthopaedic Mattresses',
    text: 'Foam, fiber & spring support for healthy sleep.',
    icon: Bed,
    image: '/images/mattress-ortho-1.jpg',
  },
  {
    title: 'Beddings',
    text: 'Duvets, sheets & sets finished with luxury.',
    icon: Sofa,
    image: '/images/bedding-set-1.jpg',
  },
  {
    title: 'Households',
    text: 'Pillows, protectors & everyday home essentials.',
    icon: ShoppingBag,
    image: '/images/household-pillows-1.jpg',
  },
];

function buildCategoryCards(products: Product[]): CategoryCard[] {
  const unique = [...new Set(products.map((p) => p.category))].sort((a, b) => {
    const aKnown = DEFAULT_CATEGORIES.indexOf(a);
    const bKnown = DEFAULT_CATEGORIES.indexOf(b);
    if (aKnown !== -1 && bKnown !== -1) return aKnown - bKnown;
    if (aKnown !== -1) return -1;
    if (bKnown !== -1) return 1;
    return a.localeCompare(b);
  });

  if (unique.length === 0) return DEFAULT_CATEGORY_CARDS;

  return unique.map((title) => {
    const detail = CATEGORY_DETAILS[title];
    const firstProduct = products.find((p) => p.category === title);
    return {
      title,
      text: detail?.text || 'Premium quality products for your home.',
      icon: detail?.icon || Package,
      image: firstProduct?.image_url || '/images/hero-bedroom.jpg',
    };
  });
}

function makeAbsoluteImageUrl(url: string): string {
  return url.startsWith('http') ? url : `${SITE_URL}${url}`;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then((data) => {
        if (mounted) setProducts(data);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const featured = products.slice(0, 4);
  const categoryCards = useMemo(() => buildCategoryCards(products), [products]);

  const featuredJsonLd = useMemo(() => {
    if (featured.length === 0) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: featured.map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: p.title,
          description: p.description,
          image: makeAbsoluteImageUrl(p.image_url),
          url: `${SITE_URL}/shop`,
          brand: {
            '@type': 'Brand',
            name: 'Rafna Investment',
          },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'KES',
            price: p.price.toString(),
            availability: 'https://schema.org/InStock',
            url: `${SITE_URL}/shop`,
            priceValidUntil: '2026-12-31',
          },
        },
      })),
    };
  }, [featured]);

  const gridCols =
    categoryCards.length === 1
      ? 'grid-cols-1 max-w-md mx-auto'
      : categoryCards.length === 2
      ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <main>
      <SEO
        title="Rafna Investment | Mattresses, Beddings & Household Items in Nairobi"
        pathname="/"
        description={DEFAULT_DESCRIPTION}
      >
        {featuredJsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(featuredJsonLd)}
          </script>
        )}
      </SEO>

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/images/hero-bedroom.jpg"
            alt="Premium bedroom featuring Rafna Investment orthopaedic mattress and luxury bedding"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="text-gold text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Nairobi&apos;s Trusted Sleep Experts
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight">
              Quality Mattresses, Beddings & Household Items in Nairobi
            </h1>
            <p className="mt-6 text-lg text-slate-200 leading-relaxed max-w-xl">
              Premium foam, fiber & spring orthopaedic mattresses, luxury beddings
              and household essentials delivered to your door in Nairobi and across Kenya.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gold hover:bg-gold-dark text-navy font-semibold transition"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <a
                href="tel:+254710565055"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/30 text-white hover:bg-white/10 transition"
              >
                Call 0710 565055
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policies */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBadges />
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-gold-dark font-semibold text-sm uppercase tracking-wider">
              Collections
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mt-2">
              Shop by Category
            </h2>
          </div>

          <div className={`grid ${gridCols} gap-8`}>
            {categoryCards.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition"
              >
                <img
                  src={cat.image}
                  alt={`${cat.title} collection at Rafna Investment Nairobi`}
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-gold text-navy">
                      <cat.icon size={18} />
                    </div>
                    <h3 className="font-serif text-xl font-semibold">{cat.title}</h3>
                  </div>
                  <p className="text-sm text-slate-200 mb-4">{cat.text}</p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1 text-sm font-medium text-gold-light hover:text-gold transition"
                  >
                    Explore <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gold-dark font-semibold text-sm uppercase tracking-wider">
                Curated for you
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy mt-2">
                Featured Products
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold-dark transition"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-slate-200 h-80 animate-pulse" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <p className="text-slate-500 text-center py-12">
              No products available right now. Please check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOrder={setSelected}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Ready for better sleep?
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Visit us in Kamkunji, Nairobi or call/WhatsApp us for free delivery within
            the city.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/254710565055"
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3.5 rounded-xl bg-gold hover:bg-gold-dark text-navy font-semibold transition"
            >
              Chat on WhatsApp
            </a>
            <a
              href="mailto:rafnainvestment@gmail.com"
              className="px-7 py-3.5 rounded-xl border border-white/30 hover:bg-white/10 transition"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>

      {selected && (
        <OrderModal product={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
