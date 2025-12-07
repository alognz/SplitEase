export default function ChoreCard({ title, children }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      {children}
    </div>
  );
}
