import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import { LoadingState } from '../components/StateViews';

const FEATURES = [
  { icon: '🔎', title: 'Easy Room Discovery', desc: 'Search and filter through verified listings in seconds.' },
  { icon: '💸', title: 'Affordable Rentals', desc: 'Options across every budget, from shared rooms to premium apartments.' },
  { icon: '🗂️', title: 'Simple Listing Management', desc: 'Owners can list, edit, and manage rooms from one dashboard.' },
  { icon: '🤝', title: 'Direct Owner Requests', desc: 'Message owners directly and track your request status.' },
];

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/rooms', { params: { sort: 'newest' } })
      .then(({ data }) => setRooms(data.rooms.slice(0, 6)))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="container-page relative z-10 flex min-h-[560px] flex-col items-start justify-center gap-6 py-20">
          <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
            Find a room that feels like home.
          </span>
          <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight md:text-6xl">
            Find your perfect room without the hassle.
          </h1>
          <p className="max-w-xl text-lg text-brand-50">
            Discover affordable rooms, comfortable spaces, and verified rental listings near you.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/rooms" className="btn-primary !bg-white !text-brand-700 hover:!bg-brand-50">
              Explore Rooms
            </Link>
            <Link to="/register" className="btn-secondary !border-white !bg-transparent !text-white hover:!bg-white/10">
              List Your Room
            </Link>
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1600&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </section>

      {/* Featured Rooms */}
      <section className="container-page py-20">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl font-bold text-slate-800">Featured Rooms</h2>
            <p className="mt-2 text-slate-500">Hand-picked listings available right now.</p>
          </div>
          <Link to="/rooms" className="btn-secondary">View All Rooms</Link>
        </div>

        {loading ? (
          <LoadingState label="Loading featured rooms..." />
        ) : rooms.length === 0 ? (
          <p className="text-slate-500">No rooms available yet. Check back soon!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </section>

      {/* Why RoomNest */}
      <section className="bg-white py-20">
        <div className="container-page">
          <h2 className="text-center font-display text-3xl font-bold text-slate-800">Why RoomNest?</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-3xl">
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-slate-800">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-20">
        <div className="card flex flex-col items-center gap-5 bg-gradient-to-r from-brand-600 to-brand-500 p-12 text-center text-white">
          <h2 className="font-display text-3xl font-bold">Have a room to rent?</h2>
          <p className="max-w-xl text-brand-50">
            List your property on RoomNest and connect with verified room seekers in your city.
          </p>
          <Link to="/register" className="btn-primary !bg-white !text-brand-700 hover:!bg-brand-50">
            List Your Room
          </Link>
        </div>
      </section>
    </div>
  );
}
