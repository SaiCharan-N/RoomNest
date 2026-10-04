import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import StatCard from '../components/StatCard';
import { resolveImageUrl } from '../utils/image';
import { LoadingState, EmptyState, ErrorState, SuccessBanner } from '../components/StateViews';

export default function OwnerDashboard() {
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [statsRes, roomsRes] = await Promise.all([
        api.get('/users/owner/stats'),
        api.get('/rooms/owner/mine'),
      ]);
      setStats(statsRes.data);
      setRooms(roomsRes.data.rooms);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(roomId) {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/rooms/${roomId}`);
      setNotice('Room deleted successfully.');
      setRooms((prev) => prev.filter((r) => r._id !== roomId));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (loading) return <LoadingState label="Loading your dashboard..." />;

  return (
    <div className="container-page py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-800">Owner Dashboard</h1>
          <p className="mt-2 text-slate-500">Manage your listings and rental requests.</p>
        </div>
        <Link to="/owner/add-room" className="btn-primary">+ Add New Room</Link>
      </div>

      {error && <div className="mb-6"><ErrorState message={error} /></div>}
      {notice && <div className="mb-6"><SuccessBanner message={notice} /></div>}

      {stats && (
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon="🏠" label="Total Listings" value={stats.totalListings} />
          <StatCard icon="✅" label="Available Rooms" value={stats.availableRooms} />
          <StatCard icon="📨" label="Rental Requests" value={stats.rentalRequests} />
          <StatCard icon="⏳" label="Pending Requests" value={stats.pendingRequests} />
        </div>
      )}

      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-slate-800">My Listings</h2>
        <Link to="/owner/requests" className="text-sm font-semibold text-brand-600">View Rental Requests →</Link>
      </div>

      {rooms.length === 0 ? (
        <EmptyState
          title="You haven't listed any rooms yet."
          action={<Link to="/owner/add-room" className="btn-primary mt-2">+ List Your First Room</Link>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div key={room._id} className="card overflow-hidden">
              <img src={resolveImageUrl(room.images?.[0])} alt={room.title} className="h-40 w-full object-cover" />
              <div className="space-y-1 p-4">
                <h3 className="truncate font-display font-semibold text-slate-800">{room.title}</h3>
                <p className="text-sm text-slate-500">📍 {room.location}</p>
                <p className="text-sm font-semibold text-brand-700">₹{Number(room.rent).toLocaleString('en-IN')}/mo</p>
                <p className="text-xs text-slate-400">{room.availability ? 'Available' : 'Not Available'}</p>
                <div className="flex gap-2 pt-2">
                  <Link to={`/rooms/${room._id}`} className="btn-secondary flex-1 !px-2 !py-1.5 text-xs">View</Link>
                  <Link to={`/owner/edit-room/${room._id}`} className="btn-secondary flex-1 !px-2 !py-1.5 text-xs">Edit</Link>
                  <button onClick={() => handleDelete(room._id)} className="btn-danger flex-1 !px-2 !py-1.5 text-xs">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
