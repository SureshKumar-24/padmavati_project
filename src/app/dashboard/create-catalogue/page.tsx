'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    metal: string;
    category: string;
    price: number;
    weight_kg: number;
    images: string[];
}

interface Party {
    id: number;
    name: string;
    type: string;
    discount: number;
}

export default function CreateCataloguePage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [filterMetal, setFilterMetal] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        party_id: '',
    });

    const metals = ['Brass', 'Copper', 'Panchdhatu', 'Bronze'];
    const categories = ['Ganesh', 'Laxmi', 'Hanuman', 'Buddha', 'Krishna', 'Diyas', 'Brackets', 'Shiva'];

    useEffect(() => {
        fetchProducts();
        fetchParties();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products?limit=100');
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const fetchParties = async () => {
        try {
            const res = await fetch('/api/parties?limit=50');
            const data = await res.json();
            setParties(data.parties || []);
        } catch (error) { console.error('Error:', error); }
    };

    const toggleProduct = (productId: string) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const selectAll = () => {
        const filteredIds = filteredProducts.map(p => p.id);
        const allSelected = filteredIds.every(id => selectedProducts.includes(id));
        if (allSelected) {
            setSelectedProducts(prev => prev.filter(id => !filteredIds.includes(id)));
        } else {
            setSelectedProducts(prev => [...new Set([...prev, ...filteredIds])]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedProducts.length === 0) {
            alert('Please select at least one product');
            return;
        }
        if (!formData.name) {
            alert('Please enter a catalogue name');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/catalogues', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    party_id: formData.party_id ? parseInt(formData.party_id) : null,
                    product_ids: selectedProducts,
                    status: 'Draft',
                }),
            });

            if (res.ok) {
                router.push('/dashboard/catalogues');
            } else {
                alert('Failed to create catalogue');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating catalogue');
        } finally {
            setSaving(false);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesMetal = !filterMetal || p.metal === filterMetal;
        const matchesCategory = !filterCategory || p.category === filterCategory;
        return matchesSearch && matchesMetal && matchesCategory;
    });

    const selectedParty = parties.find(p => p.id === parseInt(formData.party_id));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Create Catalogue</h1>
                        <p className="text-gray-500 text-sm">Select products and create a new catalogue</p>
                    </div>
                </div>

                {/* Catalogue Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catalogue Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Diwali Collection 2024"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Party (Optional)</label>
                        <select
                            value={formData.party_id}
                            onChange={(e) => setFormData({ ...formData, party_id: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
                        >
                            <option value="">Select Party</option>
                            {parties.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description..."
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
                        />
                    </div>
                </div>

                {selectedParty && (
                    <div className="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-green-800 text-sm">
                            Party discount: <strong>{selectedParty.discount}%</strong> will be applied
                        </span>
                    </div>
                )}
            </div>

            {/* Product Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Select Products</h2>
                        <p className="text-gray-500 text-sm">{selectedProducts.length} products selected</p>
                    </div>
                    <button
                        onClick={selectAll}
                        className="text-amber-600 font-medium text-sm hover:underline"
                    >
                        {filteredProducts.every(p => selectedProducts.includes(p.id)) ? 'Deselect All' : 'Select All Filtered'}
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl"
                    />
                    <select
                        value={filterMetal}
                        onChange={(e) => setFilterMetal(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl"
                    >
                        <option value="">All Metals</option>
                        {metals.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {filteredProducts.map((product) => {
                            const isSelected = selectedProducts.includes(product.id);
                            return (
                                <div
                                    key={product.id}
                                    onClick={() => toggleProduct(product.id)}
                                    className={`relative rounded-xl p-3 cursor-pointer transition-all ${
                                        isSelected
                                            ? 'bg-amber-50 border-2 border-amber-500 shadow-md'
                                            : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                                    }`}
                                >
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="aspect-square bg-white rounded-lg mb-2 overflow-hidden">
                                        {product.images?.[0] ? (
                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs font-medium text-gray-800 line-clamp-2">{product.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">₹{Number(product.price).toLocaleString()}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky bottom-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl font-bold text-amber-700">{selectedProducts.length}</span>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Products Selected</p>
                            <p className="text-sm text-gray-500">Ready to create catalogue</p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => router.back()}
                            className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving || selectedProducts.length === 0 || !formData.name}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Create Catalogue
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
