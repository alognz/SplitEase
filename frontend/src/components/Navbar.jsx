import { Link, useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    location.pathname === path
      ? "text-[#5A8A88] font-semibold border-[#5A8A88] pb-1"
      : "text-[#555555] hover:text-[#5A8A88]";

  return (
    <div className="flex items-center justify-between py-4 border-b bg-white">
      <h1 className="px-5 text-2xl font-semibold text-[#5A8A88]">SplitEase</h1>

      <div className="flex items-center gap-6 text-lg px-5">
        <Link to="/" className={linkClass("/")}>
          Dashboard
        </Link>
        <Link to="/expenses" className={linkClass("/expenses")}>
          Expenses
        </Link>
        <Link to="/chores" className={linkClass("/chores")}>
          Chores
        </Link>
        <Link to="/groups" className={linkClass("/groups")}>
          Groups
          </Link>
          <UserMenu />
      </div>
    </div>
  );
}
