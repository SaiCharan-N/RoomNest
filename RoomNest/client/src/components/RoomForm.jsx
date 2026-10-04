import { useState } from 'react';
import { ErrorState } from './StateViews';

const ROOM_TYPES = ['Single Room', 'Shared Room', '1 BHK', '2 BHK', 'Apartment', 'Hostel'];
const AMENITY_OPTIONS = ['WiFi', 'Parking', 'Attached Bathroom', 'AC', 'Furnished', 'Kitchen', 'Laundry'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export default function RoomForm({ initialValues, onSubmit, submitLabel, existingImages = [] }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    rent: '',
    location: '',
    roomType: ROOM_TYPES[0],
    availableFrom: '',
    contactNumber: '',
    amenities: [],
    ...initialValues,
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function toggleAmenity(amenity) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a) => a !== amenity)
        : [...f.amenities, amenity],
    }));
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []);
    setError('');

    for (const file of selected) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Only JPEG, PNG, or WEBP images are allowed.');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setError('Each image must be smaller than 5MB.');
        return;
      }
    }

    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.title || !form.description || !form.rent || !form.location || !form.availableFrom || !form.contactNumber) {
      setError('Please fill in all required fields.');
      return;
    }
    if (Number(form.rent) <= 0) {
      setError('Rent must be a positive number.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(form, files);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <ErrorState message={error} />}

      <div>
        <label className="label-field">Room Title</label>
        <input required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>

      <div>
        <label className="label-field">Description</label>
        <textarea required rows={4} className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Monthly Rent (₹)</label>
          <input required type="number" min="1" className="input-field" value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })} />
        </div>
        <div>
          <label className="label-field">Room Type</label>
          <select className="input-field" value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}>
            {ROOM_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Location</label>
          <input required className="input-field" placeholder="e.g. Gachibowli, Hyderabad" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <div>
          <label className="label-field">Contact Number</label>
          <input required className="input-field" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
        </div>
      </div>

      <div>
        <label className="label-field">Available From</label>
        <input required type="date" className="input-field" value={form.availableFrom} onChange={(e) => setForm({ ...form, availableFrom: e.target.value })} />
      </div>

      <div>
        <label className="label-field">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => toggleAmenity(a)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                form.amenities.includes(a)
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-slate-200 text-slate-500 hover:border-brand-300'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label-field">Room Images (JPEG/PNG/WEBP, max 5MB each)</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileChange} className="input-field" />

        {existingImages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {existingImages.map((img, i) => (
              <img key={i} src={img} alt="" className="h-20 w-20 rounded-lg object-cover" />
            ))}
          </div>
        )}

        {previews.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="h-20 w-20 rounded-lg object-cover" />
            ))}
          </div>
        )}
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
