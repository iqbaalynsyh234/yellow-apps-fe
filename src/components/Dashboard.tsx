'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import CreateLabelModal from './CreateLabelModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [labels, setLabels] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchLabels = () => {
    setLoading(true);
    api.getLabels()
      .then((data) => setLabels(data.data || data))
      .finally(() => setLoading(false));
  };

  const fetchCategories = () => {
    api.getCategories()
      .then((data) => setCategories(data.data || data))
      .catch(() => setCategories([]));
  };

  useEffect(() => {
    fetchLabels();
    fetchCategories();
  }, []);

  const handleCreateLabel = async ({ name, categoryId }: { name: string; categoryId: number }) => {
    setCreating(true);
    try {
      await api.createLabel({ name, category_id: categoryId });
      setModalOpen(false);
      fetchLabels();
    } finally {
      setCreating(false);
    }
  };

  const labelsByCategory = categories.map((cat: any) => ({
    ...cat,
    labels: labels.filter((label: any) =>
      label.categories && label.categories.some((c: any) => c.id === cat.id)
    ),
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D9D9D9]">
      <div className="w-full max-w-md bg-white flex flex-col px-8 py-10 shadow-md">
        {user && (
          <div className="mb-6">
            <div className="font-bold text-xl mb-1">Halo, {user.name || user.email}!</div>
            {user.email && <div className="text-gray-500 text-sm">{user.email}</div>}
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold text-gray-700 text-lg">Labels</span>
          <div className="flex gap-2">
            <button
              className="bg-[#FFC700] text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-yellow-400"
              onClick={() => setModalOpen(true)}
            >
              + New Label
            </button>
            <button
              className="bg-red-400 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-red-500"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {loading ? (
            <div>Loading...</div>
          ) : categories.length === 0 ? (
            <div className="text-gray-400">No categories found.</div>
          ) : (
            labelsByCategory.map((cat) => (
              <div key={cat.id} className="bg-[#F3F3F3] rounded-2xl p-4">
                <div className="font-bold mb-3">{cat.name}</div>
                <div className="flex flex-col gap-2">
                  {cat.labels.length === 0 ? (
                    <div className="text-gray-400 text-sm">No labels Found</div>
                  ) : (
                    cat.labels.map((label: any) => (
                      <div
                        key={label.id}
                        className="flex items-center justify-between bg-white rounded-lg px-4 py-2 mb-2 last:mb-0"
                      >
                        <span>{label.name}</span>
                        <button className="text-red-400 text-xs hover:underline">Delete</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <CreateLabelModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateLabel}
          categories={categories}
          loading={creating}
        />
      </div>
    </div>
  );
}
