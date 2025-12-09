import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { api } from "../utils/api";
import Button from "../components/Button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { saveToken } = useContext(AppContext);
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const data = await api("/api/auth/login", "POST", { username, password });
      saveToken(data.token);
      nav("/");
    } catch (err) {
      alert("Invalid login, check if your username and password are correct!");
      console.error(err);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-background font-sans">
      <form onSubmit={handleLogin} className="w-full max-w-xs">
        <h1 className="text-3xl font-bold mb-2 text-textPrimary">Log In</h1>

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
