export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">ROS</h1>
        <p className="text-slate-500 mt-1">Restaurant Operating System · v0.9 Pilot</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {[
          { label: 'Customer', path: '/table/1', color: 'bg-orange-500 hover:bg-orange-600' },
          { label: 'Floor Staff', path: '/floor', color: 'bg-sky-500 hover:bg-sky-600' },
          { label: 'Kitchen', path: '/kitchen', color: 'bg-emerald-500 hover:bg-emerald-600' },
          { label: 'Manager', path: '/manager', color: 'bg-violet-500 hover:bg-violet-600' },
        ].map((r) => (
          <a
            key={r.label}
            href={r.path}
            className={`${r.color} text-white text-center py-4 rounded-xl font-semibold transition-colors`}
          >
            {r.label}
          </a>
        ))}
      </div>

      <p className="text-xs text-slate-400">
        Backend → <code className="font-mono">http://localhost:3000/api/health</code>
      </p>
    </div>
  );
}
