import { useEffect, useState } from 'react';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import { LoadingState, EmptyState, ErrorState } from '../components/StateViews';

const ROOM_TYPES = ['Single Room', 'Shared Room', '1 BHK', '2 BHK', 'Apartment', 'Hostel'];

const DEFAULT_FILTERS = {
  search: '',
  minRent: '',
  maxRent: '',
  location: '',
  roomType: '',
  availability: '',
  sort: 'newest',
};

export default function Rooms() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timeout = setTimeout(fetchRooms, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function fetchRooms() {
    setLoading(true);
    setError('');
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const { data } = await api.get('/rooms', { params });
      setRooms(data.rooms);
    } catch (err) {
      setError('Unable to load rooms right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-800">Browse Rooms</h1>
        <p className="mt-2 text-slate-500">Search available rooms and find the one that suits you best.</p>
      </div>

      {/* Search + Filters */}
      <div className="card mb-8 grid gap-4 p-6 lg:grid-cols-6">
        <input
          className="input-field lg:col-span-2"
          placeholder="Search by location, room name..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
        <input
          className="input-field"
          type="number"
          placeholder="Min rent"
          value={filters.minRent}
          onChange={(e) => updateFilter('minRent', e.target.value)}
        />
        <input
          className="input-field"
          type="number"
          placeholder="Max rent"
          value={filters.maxRent}
          onChange={(e) => updateFilter('maxRent', e.target.value)}
        />
        <select
          className="input-field"
          value={filters.roomType}
          onChange={(e) => updateFilter('roomType', e.target.value)}
        >
          <option value="">Any Room Type</option>
          {ROOM_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          className="input-field"
          value={filters.sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="rent_asc">Rent: Low to High</option>
          <option value="rent_desc">Rent: High to Low</option>
        </select>

        <input
          className="input-field lg:col-span-2"
          placeholder="Filter by location"
          value={filters.location}
          onChange={(e) => updateFilter('location', e.target.value)}
        />
        <select
          className="input-field"
          value={filters.availability}
          onChange={(e) => updateFilter('availability', e.target.value)}
        >
          <option value="">Any Availability</option>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
        <button onClick={resetFilters} className="btn-secondary lg:col-span-1">
          Clear Filters
        </button>
      </div>

      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingState label="Loading rooms..." />
      ) : rooms.length === 0 ? (
        <EmptyState title="No rooms found." subtitle="Try changing your search or filters." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
