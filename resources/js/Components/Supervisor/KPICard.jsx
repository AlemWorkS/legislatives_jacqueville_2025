export default function KPICard({ title, value, subtitle }) {
  return (
    <div className="bg-white/5 p-4 rounded shadow-sm min-h-[80px] flex flex-col justify-between">
      <div className="text-sm text-gray-500 truncate" title={title}>{title}</div>
      <div className="text-2xl font-bold break-words">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  );
}
