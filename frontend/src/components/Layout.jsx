import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Left Navigation */}
      <aside className="w-48 bg-white shadow-lg p-4 space-y-4">
        <h2 className="font-bold text-lg">SplitEase</h2>
        <nav className="space-y-2">
          <Link className="block text-sm">Dashboard</Link>
          <Link className="block text-sm">Expenses</Link>
          <Link className="block text-sm">Chores</Link>
          <Link className="block text-sm">Profile</Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
