import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { api } from "../utils/api";
import Button from "../components/Button";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const nav = useNavigate();
  const { saveToken, token } = useContext(AppContext);

  useEffect(() => {
    if (token) {
      nav("/", { replace: true });
    }
  }, [token, nav]);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be Password Requirements: Minimum 8 characters, at least 1 uppercase letter, at least 1 lowercase letter, at least 1 number, at least 1 special character"
      );
      return;
    }

    try {
      const data = await api("/api/auth/signup", "POST", {
        username,
        email,
        password,
      });

      if (data.token) {
        saveToken(data.token);
        nav("/", { replace: true });
      } else {
        setError("No token received. Please try again.");
      }
    } catch (err) {
      setError(err.message || err.error || "Signup failed. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-background font-sans">
      <form onSubmit={handleSignup} className="w-full max-w-xs">
        <h1 className="text-3xl font-bold mb-2 text-textPrimary">Sign Up</h1>

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

        <p className="text-sm font-medium text-textSecondary mb-1">Email</p>
        <input
          className="w-full h-11 border border-gray-300 px-3 mb-4 text-sm text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <p className="text-sm font-medium text-textSecondary mb-1">Password</p>
        <input
          className="w-full h-11 border border-gray-300 px-3 mb-4 text-sm text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Create password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="text-sm font-medium text-textSecondary mb-1">
          Confirm Password
        </p>
        <input
          className="w-full h-11 border border-gray-300 px-3 mb-6 text-sm text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="flex justify-center">
          <Button type="submit" center>
            Sign Up
          </Button>
        </div>

        <div className="mt-4 text-sm text-textSecondary text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
