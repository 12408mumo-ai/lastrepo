import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  LogOut,
  Upload,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Image as ImageIcon,
} from 'lucide-react';
import { Product, Category, DEFAULT_CATEGORIES } from '../types';
import {
  createProduct,
  deleteProduct,
  getProducts,
  uploadImage,
  isSupabaseConfigured,
} from '../lib/products';
import { logoutAdmin } from '../lib/auth';
import Logo from '../components/Logo';

interface AdminDashboardProps {
  onLogout: () => void;
}

const CUSTOM_VALUE = '__custom__';

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    imageUrl: '',
  });
  const [customCategory, setCustomCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const load = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to load products.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setForm((prev) => ({ ...prev, imageUrl: '' }));
  };

  const resetForm = () => {
    setForm({ title: '', category: '', price: '', description: '', imageUrl: '' });
    setCustomCategory('');
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const categoryValue: Category =
      form.category === CUSTOM_VALUE
        ? customCategory.trim()
        : form.category.trim();

    if (!form.title.trim() || !categoryValue || !form.price.trim() || !form.description.trim()) {
      setFeedback({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    let imageUrl = form.imageUrl.trim();
    if (selectedFile) {
      try {
        setUploadingImage(true);
        imageUrl = await uploadImage(selectedFile);
      } catch (err) {
        setFeedback({ type: 'error', message: 'Image upload failed. Please try again.' });
        setUploadingImage(false);
        return;
      }
      setUploadingImage(false);
    }

    if (!imageUrl) {
      setFeedback({ type: 'error', message: 'Please upload an image or provide an image URL.' });
      return;
    }

    setSubmitting(true);
    try {
      await createProduct({
        title: form.title.trim(),
        category: categoryValue,
        price: Number(form.price),
        description: form.description.trim(),
        image_url: imageUrl,
      });
      await load();
      resetForm();
      setFeedback({ type: 'success', message: 'Product added successfully.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to save product.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      await load();
      setFeedback({ type: 'success', message: 'Product deleted.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to delete product.' });
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    onLogout();
  };

  const isCustom = form.category === CUSTOM_VALUE;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Logo className="h-12 w-12" />
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage products and inventory
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Running in demo mode</p>
              <p>
                Supabase is not configured. Products are stored locally in this browser and
                images are saved as base64. Add your Supabase credentials in the environment
                variables to enable live storage and database sync.
              </p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-3 ${
                feedback.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-28">
              <h2 className="font-serif text-xl font-semibold text-navy mb-5 flex items-center gap-2">
                <Plus size={20} className="text-gold-dark" /> Add New Product
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
                    placeholder="e.g. Royal Orthopaedic Mattress"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
                    required
                  >
                    <option value="">Select category</option>
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value={CUSTOM_VALUE}>+ Add custom category</option>
                  </select>

                  {isCustom && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Enter custom category name"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
                        required
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (KES)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
                    placeholder="e.g. 18500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition resize-none"
                    placeholder="Describe the product features, size, material..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
                  <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="product-image"
                    />
                    <label
                      htmlFor="product-image"
                      className="cursor-pointer inline-flex flex-col items-center gap-2 text-sm text-slate-600"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Selected preview"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      ) : (
                        <>
                          <ImageIcon size={28} className="text-slate-400" />
                          <span>Click to upload image</span>
                        </>
                      )}
                    </label>
                  </div>
                  {uploadingImage && (
                    <p className="text-xs text-gold-dark mt-2 flex items-center gap-1">
                      <Loader2 size={12} className="animate-spin" /> Uploading image…
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Optional Image URL
                  </label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => {
                      setForm({ ...form, imageUrl: e.target.value });
                      if (e.target.value) {
                        setImagePreview(e.target.value);
                        setSelectedFile(null);
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Uploading a file will override this URL.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-navy text-white font-medium hover:bg-slate-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting || uploadingImage ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <Upload size={18} /> Add Product
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Product Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="font-serif text-xl font-semibold text-navy">Current Products</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {products.length} product{products.length !== 1 ? 's' : ''} in the catalog
                </p>
              </div>

              {loading ? (
                <div className="p-12 text-center text-slate-500">
                  <Loader2 size={32} className="mx-auto animate-spin mb-3" />
                  Loading products…
                </div>
              ) : products.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  No products yet. Add your first product to start selling.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image_url}
                                alt={product.title}
                                className="h-12 w-12 rounded-lg object-cover border border-slate-200"
                              />
                              <div>
                                <p className="text-sm font-medium text-navy">{product.title}</p>
                                <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gold-dark">
                            KES {product.price.toLocaleString('en-KE')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium transition"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-navy transition"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}
