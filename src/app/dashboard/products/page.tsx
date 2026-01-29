'use client';

import { useState, useEffect } from 'react';

interface Product {
    id: string;
    name: string;
    description: string;
    metal: string;
    category: string;
    price: number;
    weight_kg: number;
    height_inch: number;
    finish_type: string;
    stock: number;
    images: string[];
}

interface Rate {
    id: number;
    metal: string;
    rate_per_kg: string;
    labour_charge_percent: string;
    gst_percent: string;
}

interface Category {
    id: number;
    name: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [rates, setRates] = useState<Rate[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterMetal, setFilterMetal] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '', description: '', metal: 'Brass', category: '',
        price: 0, weight_kg: 0, height_inch: 0, finish_type: 'Antique', stock: 0, images: [] as string[],
    });
    const [useAutoPrice, setUseAutoPrice] = useState(true);

    const finishes = ['Antique', 'Glossy', 'Matte', 'Polished'];

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchRates();
    }, []);

    useEffect(() => {
        if (useAutoPrice && formData.weight_kg > 0) {
            const rate = rates.find(r => r.metal === formData.metal);
            if (rate) {
                const baseRate = Number(rate.rate_per_kg);
                const labour = Number(rate.labour_charge_percent);
                const gst = Number(rate.gst_percent);
                const materialCost = baseRate * formData.weight_kg;
                const labourCost = materialCost * (labour / 100);
                const subtotal = materialCost + labourCost;
                const gstAmount = subtotal * (gst / 100);
                const finalPrice = Math.round(subtotal + gstAmount);
                setFormData(prev => ({ ...prev, price: finalPrice }));
            }
        }
    }, [formData.metal, formData.weight_kg, rates, useAutoPrice]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories?limit=50');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (error) { console.error('Error:', error); }
    };

    const fetchRates = async () => {
        try {
            const res = await fetch('/api/rates');
            const data = await res.json();
            setRates(data.rates || []);
        } catch (error) { console.error('Error:', error); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
            const method = editingProduct ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            if (res.ok) { fetchProducts(); closeModal(); }
        } catch (error) { console.error('Error:', error); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        fetchProducts();
    };

    const openModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({ name: product.name, description: product.description, metal: product.metal, category: product.category, price: Number(product.price), weight_kg: Number(product.weight_kg), height_inch: Number(product.height_inch), finish_type: product.finish_type, stock: product.stock, images: product.images || [] });
            setUseAutoPrice(false);
        } else {
            setEditingProduct(null);
            setFormData({ name: '', description: '', metal: 'Brass', category: categories[0]?.name || '', price: 0, weight_kg: 0, height_inch: 0, finish_type: 'Antique', stock: 0, images: [] });
            setUseAutoPrice(true);
        }
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setEditingProduct(null); };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesMetal = !filterMetal || p.metal === filterMetal;
        const matchesCategory = !filterCategory || p.category === filterCategory;
        return matchesSearch && matchesMetal && matchesCategory;
    });

    const getMetalColor = (metal: string) => {
        const colors: Record<string, string> = { Brass: 'bg-amber-100 text-amber-700', Copper: 'bg-orange-100 text-orange-700', Panchdhatu: 'bg-purple-100 text-purple-700', Bronze: 'bg-yellow-100 text-yellow-700' };
        return colors[metal] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Products</h1>
                        <p className="text-gray-500 text-sm">Manage inventory • {products.length} products</p>
                    </div>
                    <button onClick={() => openModal()} className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Product
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl" />
                    <select value={filterMetal} onChange={(e) => setFilterMetal(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl">
                        <option value="">All Metals</option>
                        {rates.map(r => <option key={r.metal} value={r.metal}>{r.metal}</option>)}
                    </select>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl">
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>

                {loading ? (
                    <div className="text-center py-12"><div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto"></div></div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <p className="text-gray-500">No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all group">
                                <div className="relative aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                                    {product.images?.[0] ? (
                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button onClick={() => openModal(product)} className="p-1.5 bg-white rounded-lg shadow-md hover:bg-blue-50 text-blue-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="p-1.5 bg-white rounded-lg shadow-md hover:bg-red-50 text-red-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-gray-900/70 text-white text-xs rounded-full">{product.id}</span>
                                </div>
                                <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{product.name}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMetalColor(product.metal)}`}>{product.metal}</span>
                                    <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs">{product.category}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-800">₹{Number(product.price).toLocaleString()}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{product.stock} in stock</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Lord Ganesha Brass Idol" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" rows={2} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Metal *</label>
                                    <select value={formData.metal} onChange={(e) => setFormData({ ...formData, metal: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl">
                                        {rates.map(r => <option key={r.metal} value={r.metal}>{r.metal} (₹{Number(r.rate_per_kg)}/kg)</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl">
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
                                    <input type="number" step="0.1" min="0" value={formData.weight_kg} onChange={(e) => setFormData({ ...formData, weight_kg: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (inch)</label>
                                    <input type="number" step="0.5" min="0" value={formData.height_inch} onChange={(e) => setFormData({ ...formData, height_inch: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Finish</label>
                                    <select value={formData.finish_type} onChange={(e) => setFormData({ ...formData, finish_type: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl">
                                        {finishes.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-amber-800">Pricing</span>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" checked={useAutoPrice} onChange={(e) => setUseAutoPrice(e.target.checked)} className="rounded text-amber-600" />
                                        <span className="text-amber-700">Auto-calculate</span>
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                        <input type="number" min="0" value={formData.price} onChange={(e) => { setUseAutoPrice(false); setFormData({ ...formData, price: Number(e.target.value) }); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                        <input type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input type="text" value={formData.images[0] || ''} onChange={(e) => setFormData({ ...formData, images: e.target.value ? [e.target.value] : [] })} placeholder="/Ganesha/image.webp" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" />
                            </div>
                        </form>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                            <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100">Cancel</button>
                            <button onClick={handleSubmit} disabled={saving || !formData.name || !formData.category} className="flex-1 px-4 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-50">
                                {saving ? 'Saving...' : editingProduct ? 'Update' : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
