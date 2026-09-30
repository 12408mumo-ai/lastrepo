import { Product } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const LOCAL_PRODUCTS_KEY = 'rafna_products';
const LOCAL_UPLOADS_KEY = 'rafna_uploads';

const seedProducts: Product[] = [
  {
    id: 'seed-1',
    title: 'Classic Orthopaedic Foam Mattress',
    category: 'Orthopaedic Mattresses',
    price: 18900,
    description:
      'High-density firm foam mattress engineered for proper spinal alignment and pressure relief. Ideal for a restful, healthy sleep.',
    image_url: '/images/mattress-ortho-1.jpg',
  },
  {
    id: 'seed-2',
    title: 'Premium Spring Orthopaedic Mattress',
    category: 'Orthopaedic Mattresses',
    price: 28900,
    description:
      'Pocket-spring core with orthopedic cushioning layers for breathable, luxurious comfort and lasting back support.',
    image_url: '/images/mattress-spring-1.jpg',
  },
  {
    id: 'seed-3',
    title: 'Luxury Duvet Bedding Set',
    category: 'Beddings',
    price: 9500,
    description:
      'Elegant all-in-one bedding set including duvet cover, pillowcases and fitted sheet in soothing cream and gold tones.',
    image_url: '/images/bedding-set-1.jpg',
  },
  {
    id: 'seed-4',
    title: 'Satin Pearl Sheet Set',
    category: 'Beddings',
    price: 6500,
    description:
      'Hotel-quality satin sheet set with deep-pocket fitted sheet and silky pillowcases for a five-star sleep experience.',
    image_url: '/images/bedding-sheets-1.jpg',
  },
  {
    id: 'seed-5',
    title: 'Memory Foam Comfort Pillow Pair',
    category: 'Households',
    price: 3200,
    description:
      'Plush yet supportive memory foam pillows that cradle the neck and align the spine for refreshed mornings.',
    image_url: '/images/household-pillows-1.jpg',
  },
  {
    id: 'seed-6',
    title: 'Waterproof Mattress Protector',
    category: 'Households',
    price: 2800,
    description:
      'Breathable, noiseless waterproof protector that shields your mattress from spills, dust and allergens.',
    image_url: '/images/household-protector-1.jpg',
  },
];

// ── LocalStorage fallback helpers ───────────────────────────────────────────

function loadLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Product[]) : [];
    return parsed.length ? parsed : seedLocalProducts();
  } catch {
    return seedLocalProducts();
  }
}

function seedLocalProducts(): Product[] {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(seedProducts));
  return seedProducts;
}

function saveLocalProducts(products: Product[]) {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Public API ──────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as Product[]) || [];
  }
  return loadLocalProducts();
}

export async function createProduct(
  product: Omit<Product, 'id' | 'created_at'>
): Promise<Product> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  }
  const newProduct: Product = { ...product, id: generateId() };
  const products = [newProduct, ...loadLocalProducts()];
  saveLocalProducts(products);
  return newProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  const products = loadLocalProducts().filter((p) => p.id !== id);
  saveLocalProducts(products);
}

export async function uploadImage(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);
    return publicUrlData.publicUrl;
  }
  const dataUrl = await readFileAsDataUrl(file);
  const uploads = JSON.parse(localStorage.getItem(LOCAL_UPLOADS_KEY) || '{}') as Record<
    string,
    string
  >;
  uploads[file.name] = dataUrl;
  localStorage.setItem(LOCAL_UPLOADS_KEY, JSON.stringify(uploads));
  return dataUrl;
}

export { isSupabaseConfigured };
