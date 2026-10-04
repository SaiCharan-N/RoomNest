import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import RoomForm from '../components/RoomForm';

export default function AddRoom() {
  const navigate = useNavigate();

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
      await api.post('/rooms', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/owner/dashboard');
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }

  return (
    <div className="container-page max-w-2xl py-12">
      <h1 className="font-display text-3xl font-bold text-slate-800">List a New Room</h1>
      <p className="mt-2 text-slate-500">Fill in the details below to publish your listing.</p>

      <div className="card mt-8 p-6">
        <RoomForm onSubmit={handleSubmit} submitLabel="+ Publish Listing" />
      </div>
    </div>
  );
}
