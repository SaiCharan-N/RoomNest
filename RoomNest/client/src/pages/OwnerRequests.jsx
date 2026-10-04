import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { resolveImageUrl } from '../utils/image';
import { LoadingState, EmptyState, ErrorState } from '../components/StateViews';

export default function OwnerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    try {
      const { data } = await api.get('/requests/owner');
      setRequests(data.requests);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    setUpdatingId(id);
    try {
      await api.put(`/requests/${id}/status`, { status });
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <LoadingState label="Loading rental requests..." />;

  return (
    <div className="container-page py-12">
      <h1 className="font-display text-3xl font-bold text-slate-800">Rental Requests</h1>
      <p className="mt-2 text-slate-500">Review and respond to requests for your rooms.</p>

      {error && <div className="my-6"><ErrorState message={error} /></div>}

      {requests.length === 0 ? (
        <div className="mt-8"><EmptyState title="No rental requests yet." subtitle="Once seekers request your rooms, they'll show up here." /></div>
      ) : (
        <div className="mt-8 space-y-4">
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
                <p className="mt-1 text-sm text-slate-500">
                  Applicant: <span className="font-medium text-slate-700">{req.name}</span> · {req.email} · {req.phone}
                </p>
                {req.message && <p className="mt-1 text-sm text-slate-500">"{req.message}"</p>}
                <p className="mt-1 text-xs text-slate-400">
                  Move-in: {new Date(req.preferredMoveInDate).toLocaleDateString()} · Requested {new Date(req.createdAt).toLocaleDateString()}
                </p>
              </div>
              {req.status === 'Pending' && (
                <div className="flex gap-2 md:flex-col">
                  <button
                    disabled={updatingId === req._id}
                    onClick={() => updateStatus(req._id, 'Accepted')}
                    className="btn-primary !bg-emerald-600 hover:!bg-emerald-700 !px-4 !py-2 text-xs"
                  >
                    Accept
                  </button>
                  <button
                    disabled={updatingId === req._id}
                    onClick={() => updateStatus(req._id, 'Rejected')}
                    className="btn-danger !px-4 !py-2 text-xs"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
