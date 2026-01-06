'use client';

import { useState, useEffect } from 'react';

interface Category {
    id: number;
    name: string;
    tags: string[];
    created_at: string;
    updated_at: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', tags: [] as string[] });
    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 0,
    });

    // Fetch categories from API with pagination and search
    const fetchCategories = async (page: number = currentPage, search: string = searchQuery, isInitial: boolean = false) => {
        try {
            if (isInitial) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            const params = new URLSearchParams({
                page: page.toString(),
                limit: pagination.limit.toString(),
                search: search,
            });

            const response = await fetch(`/api/categories?${params}`);
            const data = await response.json();

            if (data.success) {
                setCategories(data.categories);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCategories(1, '', true);
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchCategories(1, searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchCategories(page, searchQuery);
    };

    const handleAddCategory = () => {
        setEditingCategory(null);
        setFormData({ name: '', tags: [] });
        setTagInput('');
        setError('');
        setShowModal(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            tags: category.tags
        });
        setTagInput('');
        setError('');
        setShowModal(true);
    };

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return;

        // Optimistic update - remove from UI immediately
        const previousCategories = [...categories];
        setCategories(categories.filter(c => c.id !== categoryToDelete.id));
        setShowDeleteModal(false);
        setCategoryToDelete(null);

        try {
            setRefreshing(true);
            const response = await fetch(`/api/categories/${categoryToDelete.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!data.success) {
                // Rollback on error
                setCategories(previousCategories);
                alert('Failed to delete category');
            } else {
                // Refresh to get updated pagination
                await fetchCategories(currentPage, searchQuery, false);
            }
        } catch (error) {
            // Rollback on error
            setCategories(previousCategories);
            console.error('Error deleting category:', error);
            alert('Error deleting category');
        } finally {
            setRefreshing(false);
        }
    };

    // Handle adding tags
    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Check for duplicate category name
        const isDuplicate = categories.some(cat =>
            cat.name.toLowerCase() === formData.name.toLowerCase() &&
            cat.id !== editingCategory?.id
        );

        if (isDuplicate) {
            setError('A category with this name already exists');
            return;
        }

        const url = editingCategory
            ? `/api/categories/${editingCategory.id}`
            : '/api/categories';

        const method = editingCategory ? 'PUT' : 'POST';

        // Close modal immediately for better UX
        setShowModal(false);
        setFormData({ name: '', tags: [] });
        setTagInput('');
        setEditingCategory(null);
        setError('');

        try {
            setRefreshing(true);
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    tags: formData.tags,
                }),
            });

            const data = await response.json();

            if (data.success) {
                await fetchCategories(currentPage, searchQuery, false);
            } else {
                alert(data.error || 'Failed to save category');
            }
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Error saving category');
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            {/* Refreshing Overlay */}
            {refreshing && (
                <div className="fixed inset-0 bg-black/10 z-40 flex items-center justify-center">
                    <div className="bg-white rounded-xl px-6 py-3 shadow-lg flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-700 font-medium">Updating...</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Categories</h1>
                            <p className="text-gray-500">Manage product categories and god types</p>
                        </div>
                        <button
                            onClick={handleAddCategory}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg shadow-amber-600/30 flex items-center gap-2 justify-center"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Category
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search categories by name or tags..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Categories List */}
            {categories.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {searchQuery ? 'No Categories Found' : 'No Categories Yet'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {searchQuery ? `No categories match "${searchQuery}"` : 'Get started by creating your first category'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={handleAddCategory}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg shadow-amber-600/30 inline-flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Your First Category
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {categories.map((category: Category) => (
                            <div
                                key={category.id}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                            </svg>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-800 mb-2">{category.name}</h3>
                                            {category.tags && category.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {category.tags.map((tag: string, index: number) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => handleEditCategory(category)}
                                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(category)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>

                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
                                            ? 'bg-amber-600 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
                                disabled={currentPage === pagination.totalPages}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            {editingCategory ? 'Edit Category' : 'Add New Category'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter category name"
                                    required
                                />
                                {error && (
                                    <p className="text-red-600 text-sm mt-1">{error}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tags
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={handleTagKeyPress}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Type and press Enter"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium rounded-xl transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Press Enter or click Add to add tags</p>

                                {/* Tags Display */}
                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {formData.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full flex items-center gap-2"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="hover:text-amber-900"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium rounded-xl transition-all shadow-lg shadow-amber-600/30"
                                >
                                    {editingCategory ? 'Update' : 'Add'} Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && categoryToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Delete Category</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{categoryToDelete.name}</strong>?
                            This will remove the category and all its associations.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-red-500/30"
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
