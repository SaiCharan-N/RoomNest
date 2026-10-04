import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../utils/image';
import { LoadingState, ErrorState, SuccessBanner } from '../components/StateViews';

export default function RoomDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', preferredMoveInDate: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    api
      .get(`/rooms/${id}`)
      .then(({ data }) => setRoom(data.room))
      .catch(() => setError('Room not found or has been removed.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, name: user.name, email: user.email }));
    }
  }, [user]);

  async function handleSubmitRequest(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    try {
      await api.post('/requests', { roomId: id, ...form });
      setSubmitSuccess('Your rental request has been submitted!');
      setShowForm(false);
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState label="Loading room details..." />;
  if (error) return <div className="container-page py-16"><ErrorState message={error} /></div>;
  if (!room) return null;

  const images = room.images?.length ? room.images : [null];

  return (
    <div className="container-page py-12">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Gallery */}
          <div className="card overflow-hidden">
            <img
              src={resolveImageUrl(images[activeImage])}
              alt={room.title}
              className="h-96 w-full object-cover"
            />
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                      idx === activeImage ? 'border-brand-600' : 'border-transparent'
                    }`}
                  >
                    <img src={resolveImageUrl(img)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="card mt-6 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-800">{room.title}</h1>
                <p className="mt-1 text-slate-500">📍 {room.location}</p>
              </div>
              <span className="font-display text-2xl font-bold text-brand-700">
                ₹{Number(room.rent).toLocaleString('en-IN')}
                <span className="text-sm font-medium text-slate-400"> /month</span>
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                {room.roomType}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  room.availability ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {room.availability ? 'Available' : 'Not Available'}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Available from {new Date(room.availableFrom).toLocaleDateString()}
              </span>
            </div>

            <h3 className="mt-6 font-display text-lg font-semibold text-slate-800">Description</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{room.description}</p>

            {room.amenities?.length > 0 && (
              <>
                <h3 className="mt-6 font-display text-lg font-semibold text-slate-800">Amenities</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {room.amenities.map((a) => (
                    <span key={a} className="rounded-lg bg-sand-100 px-3 py-1.5 text-sm text-slate-600">
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold text-slate-800">Owner Information</h3>
            <p className="mt-3 text-sm text-slate-600">{room.owner?.name}</p>
            <p className="text-sm text-slate-500">{room.owner?.email}</p>
            <p className="text-sm text-slate-500">{room.contactNumber}</p>
          </div>

          <div className="card p-6">
            {submitSuccess && <div className="mb-4"><SuccessBanner message={submitSuccess} /></div>}
            {!user ? (
              <p className="text-sm text-slate-500">Please <Link to="/login" className="font-semibold text-brand-600">login</Link> to request this room.</p>
            ) : user.role !== 'seeker' ? (
              <p className="text-sm text-slate-500">Only room seekers can submit rental requests.</p>
            ) : !showForm ? (
              <button onClick={() => setShowForm(true)} className="btn-primary w-full">
                Request This Room
              </button>
            ) : (
              <form onSubmit={handleSubmitRequest} className="space-y-3">
                {submitError && <ErrorState message={submitError} />}
                <div>
                  <label className="label-field">Name</label>
                  <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="label-field">Email</label>
                  <input required type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="label-field">Phone</label>
                  <input required className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="label-field">Preferred Move-in Date</label>
                  <input required type="date" className="input-field" value={form.preferredMoveInDate} onChange={(e) => setForm({ ...form, preferredMoveInDate: e.target.value })} />
                </div>
                <div>
                  <label className="label-field">Message</label>
                  <textarea rows={3} className="input-field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="btn-primary flex-1">
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
