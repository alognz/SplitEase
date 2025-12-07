export default function PageHeader({ title }) {
  return (
    <div className="border-b mb-6 pb-4 flex justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}
