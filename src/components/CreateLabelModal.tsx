import React, { useState } from 'react';
import Modal from './Modal';

interface Category {
  id: number;
  name: string;
}

interface CreateLabelModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; categoryId: number }) => void;
  categories: Category[];
  loading?: boolean;
}

const CreateLabelModal: React.FC<CreateLabelModalProps> = ({ open, onClose, onCreate, categories, loading }) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId) return;
    onCreate({ name, categoryId });
  };

  React.useEffect(() => {
    if (open) {
      setName('');
      setCategoryId(categories[0]?.id || 0);
    }
  }, [open, categories]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create new Label"
      actions={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-label-form"
            className="px-4 py-2 rounded-lg bg-[#FFC700] text-white font-semibold hover:bg-yellow-400 disabled:opacity-60"
            disabled={loading || !name}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </>
      }
    >
      <form id="create-label-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full rounded-lg bg-[#F3F3F3] border-none px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
            placeholder="Enter Label Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category Label</label>
          <select
            className="w-full rounded-lg bg-[#F3F3F3] border-none px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
            value={categoryId}
            onChange={e => setCategoryId(Number(e.target.value))}
            required
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  );
};

export default CreateLabelModal; 