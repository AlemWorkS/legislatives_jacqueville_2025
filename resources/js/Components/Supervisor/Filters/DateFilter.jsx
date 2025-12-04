export default function DateFilter({ value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs text-gray-600">Période</label>
      <input
        type="date"
        className="border rounded p-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
