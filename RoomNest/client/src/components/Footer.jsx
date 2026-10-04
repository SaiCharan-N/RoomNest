import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-100 bg-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold text-brand-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">🏠</span>
            RoomNest
          </div>
          <p className="mt-3 text-sm text-slate-500">Find a room that feels like home.</p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-800">Company</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link to="/about" className="hover:text-brand-600">About</Link></li>
            <li><Link to="/contact" className="hover:text-brand-600">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-800">Explore</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link to="/rooms" className="hover:text-brand-600">Browse Rooms</Link></li>
            <li><Link to="/register" className="hover:text-brand-600">List Your Room</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-800">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><span className="cursor-default">Privacy Policy</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} RoomNest. All rights reserved.
      </div>
    </footer>
  );
}
