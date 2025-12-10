import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { api } from "../utils/api";
import Button from "../components/Button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { saveToken, token } = useContext(AppContext);
  const nav = useNavigate();

  useEffect(() => {
    if (token) {
      nav("/", { replace: true });
    }
  }, [token, nav]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const data = await api("/api/auth/login", "POST", { username, password });

      if (data.token) {
        saveToken(data.token);
        nav("/", { replace: true });
      } else {
        setError("No token received. Please try again.");
      }
    } catch (err) {
      setError(
        err.message ||
          "Invalid login, check if your username and password are correct!"
      );
      console.error(err);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-background font-sans">
      <form onSubmit={handleLogin} className="w-full max-w-xs">
        <h1 className="text-3xl font-bold mb-2 text-textPrimary">Log In</h1>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <p className="text-sm font-medium text-textSecondary mb-1">Username</p>
        <input
          className="w-full h-11 border border-gray-300 px-3 mb-4 text-sm text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <p className="text-sm font-medium text-textSecondary mb-1">Password</p>
        <input
          className="w-full h-11 border border-gray-300 px-3 mb-6 text-sm text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-center">
          <Button type="submit" center>
            Log In
          </Button>
        </div>

        <div className="mt-4 text-sm text-textSecondary text-center">
          Need an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-medium hover:underline"
          >
            Sign up!
          </Link>
        </div>
      </form>
    </div>
  );
}
