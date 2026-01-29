'use client';

import { useState, useEffect } from 'react';

interface Rate {
    id: number;
    metal: string;
    rate_per_kg: number;
    labour_charge_percent: number;
    gst_percent: number;
    effective_from: string;
    updated_at: string;
}

export default function RatesPage() {
    const [rates, setRates] = useState<Rate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRate, setEditingRate] = useState<Rate | null>(null);
    const [formData, setFormData] = useState({
        rate_per_kg: 0, labour_charge_percent: 30, gst_percent: 18,
    });

    useEffect(() => { fetchRates(); }, []);

    const fetchRates = async () => {
        try {
            const res = await fetch('/api/rates');
            const data = await res.json();
            setRates(data.rates || []);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRate) return;
        const res = await fetch(`/api/rates/${editingRate.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (res.ok) { fetchRates(); closeModal(); }
    };

    const openModal = (rate: Rate) => {
        setEditingRate(rate);
        setFormData({
            rate_per_kg: Number(rate.rate_per_kg),
            labour_charge_percent: Number(rate.labour_charge_percent),
            gst_percent: Number(rate.gst_percent),
        });
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setEditingRate(null); };

    const calculateFinalRate = (rate: Rate) => {
        const baseRate = Number(rate.rate_per_kg);
        const labourPercent = Number(rate.labour_charge_percent);
        const gstPercent = Number(rate.gst_percent);
        const labourCharge = baseRate * (labourPercent / 100);
        const subtotal = baseRate + labourCharge;
        const gst = subtotal * (gstPercent / 100);
        return subtotal + gst;
    };

    const metalColors: Record<string, string> = {
        Brass: 'bg-amber-100 text-amber-700 border-amber-200',
        Copper: 'bg-orange-100 text-orange-700 border-orange-200',
        Panchdhatu: 'bg-purple-100 text-purple-700 border-purple-200',
        Bronze: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Metal Rates</h1>
                    <p className="text-gray-500 text-sm">Manage pricing for different metals</p>
                </div>
                {loading ? <div className="text-center py-12"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div></div> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {rates.map((rate) => (
                            <div key={rate.id} className={`rounded-xl p-5 border-2 ${metalColors[rate.metal] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold">{rate.metal}</h3>
                                    <button onClick={() => openModal(rate)} className="p-1.5 hover:bg-white/50 rounded-lg">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span>Base Rate:</span><span className="font-semibold">₹{Number(rate.rate_per_kg)}/kg</span></div>
                                    <div className="flex justify-between"><span>Labour:</span><span className="font-semibold">{Number(rate.labour_charge_percent)}%</span></div>
                                    <div className="flex justify-between"><span>GST:</span><span className="font-semibold">{Number(rate.gst_percent)}%</span></div>
                                    <hr className="border-current opacity-30" />
                                    <div className="flex justify-between text-base"><span className="font-medium">Final Rate:</span><span className="font-bold">₹{calculateFinalRate(rate).toFixed(0)}/kg</span></div>
                                </div>
                                <p className="text-xs mt-3 opacity-70">Updated: {new Date(rate.updated_at).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Rate Calculation Formula</h2>
                <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm">
                    <p className="text-gray-600">Final Rate = Base Rate + (Base Rate × Labour%) + GST</p>
                    <p className="text-gray-500 mt-2">GST is calculated on (Base Rate + Labour Charge)</p>
                </div>
            </div>
            {showModal && editingRate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Update {editingRate.metal} Rate</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Rate per KG (₹)</label><input type="number" value={formData.rate_per_kg} onChange={(e) => setFormData({ ...formData, rate_per_kg: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Labour Charge (%)</label><input type="number" min="0" max="100" value={formData.labour_charge_percent} onChange={(e) => setFormData({ ...formData, labour_charge_percent: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">GST (%)</label><input type="number" min="0" max="100" value={formData.gst_percent} onChange={(e) => setFormData({ ...formData, gst_percent: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-sm text-blue-800">Calculated Final Rate: <span className="font-bold">₹{(formData.rate_per_kg + formData.rate_per_kg * (formData.labour_charge_percent / 100) + (formData.rate_per_kg + formData.rate_per_kg * (formData.labour_charge_percent / 100)) * (formData.gst_percent / 100)).toFixed(0)}/kg</span></p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
