'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Catalogue {
    id: number;
    name: string;
    description: string;
    party_id: number | null;
    party_name: string | null;
    product_ids: string[];
    status: 'Draft' | 'Generated' | 'Shared';
    pdf_url: string | null;
    created_at: string;
    updated_at: string;
}

export default function CataloguesPage() {
    const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [catalogueToDelete, setCatalogueToDelete] = useState<Catalogue | null>(null);

    useEffect(() => {
        fetchCatalogues();
    }, []);

    const fetchCatalogues = async () => {
        try {
            const res = await fetch('/api/catalogues?limit=50');
            const data = await res.json();
            setCatalogues(data.catalogues || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!catalogueToDelete) return;
        try {
            await fetch(`/api/catalogues/${catalogueToDelete.id}`, { method: 'DELETE' });
            fetchCatalogues();
            setShowDeleteModal(false);
            setCatalogueToDelete(null);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            await fetch(`/api/catalogues/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            fetchCatalogues();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Generated': return 'bg-green-100 text-green-700';
            case 'Shared': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredCatalogues = catalogues.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.party_name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">My Catalogues</h1>
                        <p className="text-gray-500 text-sm">Manage your product catalogues ({catalogues.length})</p>
                    </div>
                    <Link
                        href="/dashboard/create-catalogue"
                        className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New
                    </Link>
                </div>

                <input
                    type="text"
                    placeholder="Search catalogues..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 px-4 py-2.5 border border-gray-200 rounded-xl mb-6"
                />

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                ) : filteredCatalogues.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">No catalogues yet</h3>
                        <p className="text-gray-500 mb-4">Create your first product catalogue</p>
                        <Link href="/dashboard/create-catalogue" className="text-amber-600 font-medium hover:underline">
                            + Create Catalogue
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCatalogues.map((catalogue) => (
                            <div key={catalogue.id} className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <select
                                        value={catalogue.status}
                                        onChange={(e) => updateStatus(catalogue.id, e.target.value)}
                                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(catalogue.status)}`}
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Generated">Generated</option>
                                        <option value="Shared">Shared</option>
                                    </select>
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-1">{catalogue.name}</h3>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{catalogue.description || 'No description'}</p>
                                
                                {catalogue.party_name && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {catalogue.party_name}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">{catalogue.product_ids?.length || 0} products</span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-400">{new Date(catalogue.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <Link
                                            href={`/dashboard/create-catalogue?edit=${catalogue.id}`}
                                            className="p-1.5 hover:bg-white rounded-lg text-gray-500 hover:text-blue-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => { setCatalogueToDelete(catalogue); setShowDeleteModal(true); }}
                                            className="p-1.5 hover:bg-white rounded-lg text-gray-500 hover:text-red-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {showDeleteModal && catalogueToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Delete Catalogue</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{catalogueToDelete.name}</strong>?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setCatalogueToDelete(null); }}
                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
