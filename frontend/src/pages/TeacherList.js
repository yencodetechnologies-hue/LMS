import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { API_URL } from '../data/service';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  subject: '',
  rtoNumber: '',
  instituteName: '',
  payStatus: 1
};

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchTeachers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/rto/teachers`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load teachers.');
      }
      setTeachers(data.teachers || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load teachers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (teacher) => {
    setEditingId(teacher._id);
    setForm({
      name: teacher.name || '',
      email: teacher.email || '',
      password: '', // never prefill password
      phone: teacher.phone || '',
      subject: teacher.subject || '',
      rtoNumber: teacher.rtoNumber || '',
      instituteName: teacher.instituteName || '',
      payStatus: teacher.payStatus ?? 1
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name || !form.email || (!editingId && !form.password)) {
      setFormError('Name, email, and password are required.');
      return;
    }

    setSaving(true);
    try {
      let res;
      if (editingId) {
        const { password, ...updatePayload } = form; // don't send blank password on edit
        res = await fetch(`${API_URL}/api/teachers/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload)
        });
      } else {
        res = await fetch(`${API_URL}/api/teachers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save teacher.');
      }

      closeModal();
      fetchTeachers();
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Failed to save teacher.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete teacher "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_URL}/api/teachers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete teacher.');
      }
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete teacher.');
    }
  };

  if (loading) return <div className="p-4">Loading teachers...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Teachers</h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={16} /> Add Teacher
        </button>
      </div>

      {teachers.length === 0 ? (
        <p>No teachers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Phone</th>
                <th className="py-2 px-3">RTO Number</th>
                <th className="py-2 px-3">Institute</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{t.name}</td>
                  <td className="py-2 px-3">{t.email}</td>
                  <td className="py-2 px-3">{t.phone || '-'}</td>
                  <td className="py-2 px-3">{t.rtoNumber || '-'}</td>
                  <td className="py-2 px-3">{t.instituteName || '-'}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        t.payStatus === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {t.payStatus === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2 px-3 flex gap-2">
                    <button onClick={() => openEditModal(t)} className="text-blue-600 hover:text-blue-800" title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(t._id, t.name)} className="text-red-600 hover:text-red-800" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Teacher' : 'Add Teacher'}</h3>

            {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border rounded px-3 py-2"
              />
              {!editingId && (
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border rounded px-3 py-2"
                />
              )}
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="rtoNumber"
                value={form.rtoNumber}
                onChange={handleChange}
                placeholder="RTO Number"
                className="w-full border rounded px-3 py-2"
              />
              <input
                name="instituteName"
                value={form.instituteName}
                onChange={handleChange}
                placeholder="Institute Name"
                className="w-full border rounded px-3 py-2"
              />
              <select
                name="payStatus"
                value={form.payStatus}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded border">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherList;