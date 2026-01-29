'use client';

import { useState, useEffect } from 'react';

interface Party {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    gst_number: string | null;
    type: string;
    discount: number;
}

export default function PartiesPage() {
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingParty, setEditingParty] = useState<Party | null>(null);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: '', city: '', state: '',
        gst_number: '', type: 'Retailer', discount: 0,
    });

    const partyTypes = ['Retailer', 'Wholesaler', 'Distributor', 'Temple'];

    useEffect(() => { fetchParties(); }, []);

    const fetchParties = async () => {
        try {
            const res = await fetch('/api/parties');
            const data = await res.json();
            setParties(data.parties || []);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingParty ? `/api/parties/${editingParty.id}` : '/api/parties';
        const method = editingParty ? 'PUT' : 'POST';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        if (res.ok) { fetchParties(); closeModal(); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this party?')) return;
        await fetch(`/api/parties/${id}`, { method: 'DELETE' });
        fetchParties();
    };

    const openModal = (party?: Party) => {
        if (party) {
            setEditingParty(party);
            setFormData({ name: party.name, email: party.email, phone: party.phone, address: party.address, city: party.city, state: party.state, gst_number: party.gst_number || '', type: party.type, discount: party.discount });
        } else {
            setEditingParty(null);
            setFormData({ name: '', email: '', phone: '', address: '', city: '', state: '', gst_number: '', type: 'Retailer', discount: 0 });
        }
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setEditingParty(null); };

    const filteredParties = parties.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Parties</h1>
                        <p className="text-gray-500 text-sm">Manage business partners ({parties.length})</p>
                    </div>
                    <button onClick={() => openModal()} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Party
                    </button>
                </div>
                <input type="text" placeholder="Search parties..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-80 px-4 py-2.5 border border-gray-200 rounded-xl mb-6" />
                {loading ? <div className="text-center py-12"><div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div></div> : filteredParties.length === 0 ? <div className="text-center py-12 text-gray-500">No parties found</div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead><tr className="border-b border-gray-100"><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Party</th><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Location</th><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Contact</th><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Discount</th><th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th></tr></thead>
                            <tbody>
                                {filteredParties.map((party) => (
                                    <tr key={party.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-3 px-4"><div><p className="font-medium text-gray-800">{party.name}</p>{party.gst_number && <p className="text-xs text-gray-500">GST: {party.gst_number}</p>}</div></td>
                                        <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${party.type === 'Wholesaler' ? 'bg-blue-100 text-blue-700' : party.type === 'Distributor' ? 'bg-purple-100 text-purple-700' : party.type === 'Temple' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{party.type}</span></td>
                                        <td className="py-3 px-4"><p className="text-sm text-gray-800">{party.city}</p><p className="text-xs text-gray-500">{party.state}</p></td>
                                        <td className="py-3 px-4"><p className="text-sm text-gray-800">{party.phone}</p><p className="text-xs text-gray-500">{party.email}</p></td>
                                        <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{party.discount}%</span></td>
                                        <td className="py-3 px-4 text-right">
                                            <button onClick={() => openModal(party)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg mr-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                            <button onClick={() => handleDelete(party.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">{editingParty ? 'Edit Party' : 'Add Party'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label><input type="text" value={formData.gst_number} onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg">{partyTypes.map(t => <option key={t}>{t}</option>)}</select></div>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label><input type="number" min="0" max="100" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700">{editingParty ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
