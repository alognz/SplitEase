import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdReceipt,
  MdCheckCircle,
  MdGroups,
} from "react-icons/md";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-2 transition-colors ${
      isActive
        ? "text-[#5A8A88] font-semibold"
        : "text-[#555555] hover:text-[#5A8A88]"
    }`;
  };

  return (
    <div className="flex items-center justify-between py-4 border-b bg-white shadow-sm">
      <h1 className="px-5 text-2xl font-bold text-[#5A8A88] flex items-center gap-2">
        SplitEase
      </h1>

      <div className="flex items-center gap-6 text-lg px-5">
        <Link to="/" className={linkClass("/")}>
          <MdDashboard className="text-xl" />
          <span>Dashboard</span>
        </Link>
        <Link to="/expenses" className={linkClass("/expenses")}>
          <MdReceipt className="text-xl" />
          <span>Expenses</span>
        </Link>
        <Link to="/chores" className={linkClass("/chores")}>
          <MdCheckCircle className="text-xl" />
          <span>Chores</span>
        </Link>
        <Link to="/groups" className={linkClass("/groups")}>
          <MdGroups className="text-xl" />
          <span>Groups</span>
        </Link>
        <UserMenu />
      </div>
    </div>
  );
}
