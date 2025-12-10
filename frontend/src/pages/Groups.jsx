import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdGroups, MdAdd, MdPeople } from "react-icons/md";
import { api } from "../utils/api";
import Layout from "../components/Layout";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";

export default function Groups() {
  const [groups, setGroups] = useState(() => {
    const cached = JSON.parse(localStorage.getItem("groups") || "null");
    return cached || [];
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!groups || groups.length === 0);

  useEffect(() => {
    if (groups.length > 0) {
      setLoading(false);
    }

    async function fetchGroups() {
      try {
        const data = await api("/api/groups");

        if (data.groups?.length > 0) {
          setGroups(data.groups);
          localStorage.setItem("groups", JSON.stringify(data.groups));
          setError("");
        } else {
          setGroups([]);
        }
      } catch (err) {
        console.error("Failed to load groups:", err);
        if (groups.length === 0) {
          setError("Failed to load groups. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, []);

  return (
    <Layout>
      <div className="font-sans max-w-6xl mx-auto">
        <PageHeader
          title="My Groups"
          right={
            <Button to="/groups/new" width="w-auto px-6">
              <MdAdd className="mr-1" />
              Create Group
            </Button>
          }
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {loading && groups.length === 0 ? (
          <p className="text-textSecondary text-center mt-8">
            Loading groups...
          </p>
        ) : groups.length === 0 && !error ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl shadow-sm">
            <MdGroups className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-textSecondary text-lg mb-2 font-semibold">
              No groups yet
            </p>
            <p className="text-textSecondary mb-6">
              Create your first group to start splitting expenses and managing
              chores!
            </p>
            <Button to="/groups/new" width="w-auto px-6" center={true}>
              <MdAdd className="mr-1" />
              Create Your First Group
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map((g) => (
              <Link key={g.id} to={`/groups/${g.id}`}>
                <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-xl font-semibold text-textPrimary group-hover:text-primary transition">
                        {g.name}
                      </h2>
                      <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition"></div>
                    </div>
                    {g.members && (
                      <div className="flex items-center gap-2 text-sm text-textSecondary">
                        <MdPeople className="text-primary" />
                        <span className="font-medium">{g.members.length}</span>
                        <span>
                          {g.members.length === 1 ? "member" : "members"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="h-1 bg-gradient-to-r from-primary to-[#4F7C7A] opacity-0 group-hover:opacity-100 transition"></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
