import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { api } from "../utils/api";

export default function UserMenu() {
  const { saveToken } = useContext(AppContext);
  const menuRef = useRef();

  // Load cached user immediately
  const cachedUser = JSON.parse(localStorage.getItem("user") || "null");
  const [user, setUser] = useState(cachedUser);
  const [open, setOpen] = useState(false);

  async function fetchUser() {
    try {
      const data = await api("/api/auth/me");
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch {
      // fallback to fake user for local UI testing
      const fake = {
        username: "alondra",
        email: "alondra@example.com",
        createdAt: "2025-01-05T12:00:00Z",
      };
      setUser(fake);
      localStorage.setItem("user", JSON.stringify(fake));
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function logout() {
    localStorage.removeItem("user");
    saveToken(null);
    window.location.href = "/login";
  }

  if (!user) return null;

  return (
    <div className="relative mr-5" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-4 h-10 flex items-center gap-2 rounded-lg border border-primary 
             text-primary bg-transparent hover:bg-primary hover:text-white 
             transition font-medium"
      >
        {user.username}
        <span className="text-xs opacity-70">▼</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 
                  rounded-md shadow-md py-1 z-50 text-sm"
        >
          <Link
            to="/profile"
            className="block px-3 py-1.5 hover:bg-gray-100 text-textPrimary"
            onClick={() => setOpen(false)}
          >
            Account
          </Link>

          <button
            onClick={logout}
            className="block w-full text-left px-3 py-1.5 text-red-500 hover:bg-gray-100"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
