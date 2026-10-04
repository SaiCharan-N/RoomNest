const CARDS = [
  { icon: '🎯', title: 'Our Mission', desc: 'To make finding and renting a room simple, transparent, and stress-free for everyone.' },
  { icon: '⚙️', title: 'How It Works', desc: 'Owners list their rooms with photos and details. Seekers browse, filter, and send requests directly to owners.' },
  { icon: '⭐', title: 'Why Use RoomNest', desc: 'No middlemen, no clutter — just verified listings and direct communication between owners and seekers.' },
];

export default function About() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-slate-800">About RoomNest</h1>
        <p className="mt-4 text-slate-500">
          RoomNest is a simple room rental platform that connects room owners with people looking for
          affordable and comfortable accommodation.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {CARDS.map((c) => (
          <div key={c.title} className="card p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-3xl">
              {c.icon}
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-800">{c.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
