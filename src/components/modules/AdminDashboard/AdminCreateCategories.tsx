'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Pencil, Plus, Tags, Trash2, X } from 'lucide-react';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  type CategoryWithCount,
  updateCategory,
} from '@/services/category.services';

export default function AdminCreateCategories() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();
      setCategories(res.data);
    } catch {
      setCategories([]);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();

    const trimmedName = name.trim();
    const trimmedIcon = icon.trim();

    if (!trimmedName) {
      setError('Category name is required');
      return;
    }

    setCreating(true);
    try {
      await createCategory({
        name: trimmedName,
        ...(trimmedIcon ? { icon: trimmedIcon } : {}),
      });
      setName('');
      setIcon('');
      setSuccess('Category created successfully');
      await loadCategories();
    } catch {
      setError('Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (category: CategoryWithCount) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditIcon(category.icon || '');
    resetMessages();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditIcon('');
  };

  const handleUpdate = async (id: string) => {
    resetMessages();
    const trimmedName = editName.trim();
    const trimmedIcon = editIcon.trim();

    if (!trimmedName) {
      setError('Category name is required');
      return;
    }

    setUpdatingId(id);
    try {
      await updateCategory(id, {
        name: trimmedName,
        icon: trimmedIcon || undefined,
      });
      setSuccess('Category updated successfully');
      cancelEdit();
      await loadCategories();
    } catch {
      setError('Failed to update category');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, categoryName: string) => {
    resetMessages();
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) return;

    setDeletingId(id);
    try {
      await deleteCategory(id);
      setSuccess('Category deleted successfully');
      await loadCategories();
    } catch {
      setError('Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Create & Manage Categories</h2>

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="size-4" />
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Add Category</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <input
            type="url"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Icon URL (optional)"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white btn disabled:opacity-60"
          >
            {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Create
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-7 animate-spin text-blue-500" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Tags className="mb-3 size-12 text-gray-300" />
            <p className="text-gray-500">No categories found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Icon</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Events</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Created</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => {
                  const isEditing = editingId === category.id;
                  const isUpdating = updatingId === category.id;
                  const isDeleting = deletingId === category.id;

                  return (
                    <tr key={category.id} className="transition hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
                          />
                        ) : (
                          <p className="font-medium text-gray-800">{category.name}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="url"
                            value={editIcon}
                            onChange={(e) => setEditIcon(e.target.value)}
                            placeholder="https://..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
                          />
                        ) : category.icon ? (
                          <a
                            href={category.icon}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View icon
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{category._count?.events ?? 0}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(category.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpdate(category.id)}
                                disabled={isUpdating}
                                className="rounded-lg p-1.5 text-gray-500 transition hover:bg-green-50 hover:text-green-600 disabled:opacity-60"
                                title="Save"
                              >
                                {isUpdating ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                                title="Cancel"
                              >
                                <X className="size-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEdit(category)}
                                className="rounded-lg p-1.5 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                                title="Edit"
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(category.id, category.name)}
                                disabled={isDeleting}
                                className="rounded-lg p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                                title="Delete"
                              >
                                {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
