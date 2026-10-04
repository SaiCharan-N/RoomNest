import { useState } from 'react';
import api, { getErrorMessage } from '../services/api';
import { ErrorState, SuccessBanner } from '../components/StateViews';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/contact', form);
      setSuccess(data.message);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page max-w-xl py-16">
      <h1 className="font-display text-3xl font-bold text-slate-800">Contact Us</h1>
      <p className="mt-2 text-slate-500">Have a question or feedback? Send us a message.</p>

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
            <input required type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Subject</label>
            <input required className="input-field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Message</label>
            <textarea required rows={4} className="input-field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
