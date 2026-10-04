import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import RoomForm from '../components/RoomForm';
import { resolveImageUrl } from '../utils/image';
import { LoadingState, ErrorState } from '../components/StateViews';

function toDateInputValue(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().slice(0, 10);
}

export default function EditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/rooms/${id}`)
      .then(({ data }) => setRoom(data.room))
      .catch(() => setError('Unable to load this room.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(form, files) {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'amenities') {
        formData.append('amenities', value.join(','));
      } else {
        formData.append(key, value);
      }
    });
    files.forEach((file) => formData.append('images', file));

    try {
      await api.put(`/rooms/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/owner/dashboard');
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }

  if (loading) return <LoadingState label="Loading room..." />;
  if (error) return <div className="container-page py-16"><ErrorState message={error} /></div>;
  if (!room) return null;

  return (
    <div className="container-page max-w-2xl py-12">
      <h1 className="font-display text-3xl font-bold text-slate-800">Edit Listing</h1>
      <p className="mt-2 text-slate-500">Update your room details below.</p>

      <div className="card mt-8 p-6">
        <RoomForm
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          existingImages={(room.images || []).map(resolveImageUrl)}
          initialValues={{
            title: room.title,
            description: room.description,
            rent: room.rent,
            location: room.location,
            roomType: room.roomType,
            availableFrom: toDateInputValue(room.availableFrom),
            contactNumber: room.contactNumber,
            amenities: room.amenities || [],
          }}
        />
      </div>
    </div>
  );
}
