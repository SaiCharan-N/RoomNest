import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../utils/image';

export default function RoomCard({ room }) {
  const image = resolveImageUrl(room.images?.[0]);

  return (
    <div className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={room.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-700 shadow">
          {room.roomType}
        </span>
        {!room.availability && (
          <span className="absolute right-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
            Not Available
          </span>
        )}
      </div>
      <div className="space-y-2 p-5">
        <h3 className="truncate font-display text-lg font-semibold text-slate-800">{room.title}</h3>
        <p className="flex items-center gap-1 text-sm text-slate-500">📍 {room.location}</p>
        <p className="line-clamp-2 text-sm text-slate-500">{room.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="font-display text-lg font-bold text-brand-700">
            ₹{Number(room.rent).toLocaleString('en-IN')}
            <span className="text-xs font-medium text-slate-400"> /month</span>
          </span>
          <Link to={`/rooms/${room._id}`} className="btn-secondary !px-4 !py-2 text-xs">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
