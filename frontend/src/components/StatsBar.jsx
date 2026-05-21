export default function StatsBar({ tasks }) {
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const total = tasks.length;

  const stats = [
    { label: 'Total', value: total, valueColor: 'text-violet-700', bg: 'bg-violet-50 border-violet-100' },
    { label: 'Pending', value: pending, valueColor: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
    { label: 'Done', value: completed, valueColor: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} rounded-2xl p-4 border shadow-sm`}
        >
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            {stat.label}
          </p>
          <p className={`text-2xl font-bold mt-1 ${stat.valueColor}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
