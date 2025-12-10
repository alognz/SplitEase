import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { AppContext } from "../context/AppContext";
import { api } from "../utils/api";

export default function Profile() {
  const { saveToken } = useContext(AppContext);

  const cached = JSON.parse(localStorage.getItem("user") || "null");
  const [user, setUser] = useState(cached);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await api("/api/auth/me");
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        console.error("Failed to load user:", err);
        if (!cached) {
          setUser(null);
        }
      }
    }
    loadUser();
  }, []);

  function logout() {
    saveToken(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  if (!user) {
    return (
      <Layout>
        <p className="text-center mt-10 text-textSecondary">Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto font-sans">
        <h1 className="text-3xl font-bold text-textPrimary mb-6">Account</h1>

        <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <p className="text-sm text-textSecondary">Username</p>
            <p className="text-lg font-medium text-textPrimary">
              {user.username}
            </p>
          </div>

          <div>
            <p className="text-sm text-textSecondary">Email</p>
            <p className="text-lg font-medium text-textPrimary">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-textSecondary">Member Since</p>
            <p className="text-lg font-medium text-textPrimary">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Button width="w-full" className="mt-6" onClick={logout}>
          Log Out
        </Button>
      </div>
    </Layout>
  );
}
