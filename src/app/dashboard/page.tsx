'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalParties: 0,
        cataloguesCreated: 0,
    });

    useEffect(() => {
        // Simulate loading stats - Replace with actual API call
        setStats({
            totalProducts: 156,
            totalCategories: 8,
            totalParties: 24,
            cataloguesCreated: 12,
        });
    }, []);

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            link: '/dashboard/products',
        },
        {
            title: 'Categories',
            value: stats.totalCategories,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            ),
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
            link: '/dashboard/categories',
        },
        {
            title: 'Parties',
            value: stats.totalParties,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            link: '/dashboard/parties',
        },
        {
            title: 'Catalogues',
            value: stats.cataloguesCreated,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            color: 'from-amber-500 to-amber-600',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600',
            link: '/dashboard/catalogues',
        },
    ];

    const quickActions = [
        {
            title: 'Create Catalogue',
            description: 'Generate a new product catalogue',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            ),
            color: 'from-amber-500 to-amber-600',
            link: '/export',
        },
        {
            title: 'Add Product',
            description: 'Add a new product to inventory',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            color: 'from-blue-500 to-blue-600',
            link: '/dashboard/products',
        },
        {
            title: 'Manage Rates',
            description: 'Update product pricing',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'from-green-500 to-green-600',
            link: '/dashboard/rates',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-orange-700 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome to Brass Catalogue</h1>
                        <p className="text-amber-100">Manage your products, catalogues, and business operations</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-12 h-12 text-amber-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {statCards.map((stat, index) => (
                    <Link
                        key={index}
                        href={stat.link}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.textColor} group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                        <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.link}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group"
                        >
                            <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                {action.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{action.title}</h3>
                            <p className="text-sm text-gray-500">{action.description}</p>
                            <div className="mt-4 flex items-center text-amber-600 font-medium text-sm group-hover:gap-2 transition-all">
                                <span>Get Started</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {[
                        { action: 'Created new catalogue', time: '2 hours ago', icon: '📄' },
                        { action: 'Added 5 new products', time: '5 hours ago', icon: '📦' },
                        { action: 'Updated pricing for Brass category', time: '1 day ago', icon: '💰' },
                        { action: 'New party registered', time: '2 days ago', icon: '👥' },
                    ].map((activity, index) => (
                        <div key={index} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-xl">
                                {activity.icon}
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-800 font-medium">{activity.action}</p>
                                <p className="text-sm text-gray-500">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
