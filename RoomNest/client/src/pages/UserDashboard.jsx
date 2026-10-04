import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { resolveImageUrl } from '../utils/image';
import { LoadingState, EmptyState, ErrorState } from '../components/StateViews';

export default function UserDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/requests/user')
      .then(({ data }) => setRequests(data.requests))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading your requests..." />;

  return (
    <div className="container-page py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-800">My Rental Requests</h1>
          <p className="mt-2 text-slate-500">Track the status of the rooms you've requested.</p>
        </div>
        <Link to="/rooms" className="btn-secondary">Browse More Rooms</Link>
      </div>

      {error && <div className="mb-6"><ErrorState message={error} /></div>}

      {requests.length === 0 ? (
        <EmptyState
          title="You haven't requested any rooms yet."
          action={<Link to="/rooms" className="btn-primary mt-2">Browse Rooms</Link>}
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="card flex flex-col gap-4 p-5 md:flex-row md:items-center">
              <img
                src={resolveImageUrl(req.room?.images?.[0])}
                alt={req.room?.title}
                className="h-24 w-full flex-shrink-0 rounded-xl object-cover md:w-32"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display font-semibold text-slate-800">{req.room?.title}</h3>
                  <StatusBadge status={req.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">📍 {req.room?.location}</p>
                <p className="mt-1 text-sm font-semibold text-brand-700">
                  ₹{Number(req.room?.rent).toLocaleString('en-IN')}/mo
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Requested on {new Date(req.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link to={`/rooms/${req.room?._id}`} className="btn-secondary !px-4 !py-2 text-xs">
                View Room
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
