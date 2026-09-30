import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import OrderModal from '../components/OrderModal';
import SEO from '../components/SEO';
import { Product, Category, DEFAULT_CATEGORIES } from '../types';
import { getProducts } from '../lib/products';
import { SITE_URL } from '../lib/seo';

type SortOption = 'default' | 'price-asc' | 'price-desc';

function sortCategories(categories: Category[]): Category[] {
  const known = DEFAULT_CATEGORIES.filter((c) => categories.includes(c));
  const custom = categories
    .filter((c) => !DEFAULT_CATEGORIES.includes(c))
    .sort((a, b) => a.localeCompare(b));
  return [...known, ...custom];
}

function makeAbsoluteImageUrl(url: string): string {
  return url.startsWith('http') ? url : `${SITE_URL}${url}`;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [sort, setSort] = useState<SortOption>('default');
  const [selected, setSelected] = useState<Product | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  const uniqueCategories = useMemo(
    () => sortCategories([...new Set(products.map((p) => p.category))]),
    [products]
  );

  const filtered = useMemo(() => {
    let list = category === 'All' ? products : products.filter((p) => p.category === category);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, sort]);

  const productsJsonLd = useMemo(() => {
    if (products.length === 0) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Rafna Investment Product Catalog',
      itemListElement: products.map((p, index) => ({
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
          category: p.category,
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
  }, [products]);

  return (
    <main className="min-h-screen bg-cream">
      <SEO
        title="Shop Mattresses, Beddings & Household Items in Nairobi | Rafna Investment"
        pathname="/shop"
        description="Browse Rafna Investment's catalog of quality orthopaedic mattresses, premium beddings, and household essentials in Nairobi. Free delivery in Nairobi, countrywide delivery, pay on delivery."
      >
        {productsJsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(productsJsonLd)}
          </script>
        )}
      </SEO>

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gold-dark font-semibold text-sm uppercase tracking-wider">
              Rafna Investment
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy mt-2">
              Shop Quality Mattresses, Beddings & Household Items in Nairobi
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                category === 'All'
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-gold hover:text-gold-dark'
              }`}
            >
              All
            </button>
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                  category === cat
                    ? 'bg-navy text-white border-navy'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-gold hover:text-gold-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-sm font-medium text-slate-600 hidden sm:block">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <button
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="sm:hidden p-2 rounded-lg border border-slate-200 bg-white text-slate-600"
            >
              {mobileFiltersOpen ? <X size={18} /> : <SlidersHorizontal size={18} />}
            </button>
          </div>
        </div>

        {mobileFiltersOpen && (
          <div className="sm:hidden mb-6 p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Categories
            </p>
            {['All', ...uniqueCategories].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setMobileFiltersOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm ${
                  category === cat ? 'bg-gold-light text-navy font-medium' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-200 h-96 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-lg">
              No products found in this category.
            </p>
            <button
              onClick={() => setCategory('All')}
              className="mt-4 px-5 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-slate-800 transition"
            >
              View all products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onOrder={setSelected}
                index={i % 4}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <OrderModal product={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
