export default function PageHeader({ title, children, right }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 className="text-3xl font-bold text-textPrimary">{title}</h1>
      {right || children}
    </div>
  );
}