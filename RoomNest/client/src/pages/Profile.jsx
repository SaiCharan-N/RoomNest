import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../services/api';
import { ErrorState, SuccessBanner } from '../components/StateViews';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data.user);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="container-page max-w-xl py-12">
      <h1 className="font-display text-3xl font-bold text-slate-800">Profile</h1>
      <p className="mt-2 text-slate-500">View and update your basic account information.</p>

      <div className="card mt-8 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <ErrorState message={error} />}
          {success && <SuccessBanner message={success} />}

          <div>
            <label className="label-field">Name</label>
            <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label className="label-field">Email</label>
            <input disabled className="input-field bg-slate-50 text-slate-400" value={user.email} />
          </div>

          <div>
            <label className="label-field">Role</label>
            <input disabled className="input-field bg-slate-50 text-slate-400 capitalize" value={user.role} />
          </div>

          <div>
            <label className="label-field">Phone</label>
            <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
