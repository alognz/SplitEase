import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api";
import Layout from "../components/Layout";

export default function Groups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const data = await api("/api/groups");

        if (data.groups?.length > 0) {
          setGroups(data.groups);
          localStorage.setItem("groups", JSON.stringify(data.groups));
          return;
        }
      } catch (err) {
        console.error("API failed, using mock groups.");
      }

      const mock = [
        { id: "1", name: "My Apartment" },
        { id: "2", name: "CS 409 Roommates" },
      ];
      setGroups(mock);
      localStorage.setItem("groups", JSON.stringify(mock));
    }

    fetchGroups();
  }, []);

  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-textPrimary mb-6">Groups</h1>

        <div className="space-y-4">
          {groups.map((g) => (
            <Link key={g.id} to={`/groups/${g.id}`}>
              <div className="w-full bg-white p-4 border rounded-lg shadow-sm hover:shadow transition cursor-pointer">
                <h2 className="font-medium text-textPrimary">{g.name}</h2>
              </div>
            </Link>
          ))}
        </div>

        <Link
          to="/groups/new"
          className="mt-6 block w-40 mx-auto text-center bg-primary text-white rounded-lg py-3 font-medium hover:bg-[#4F7C7A] transition"
        >
          Create Group
        </Link>
      </div>
    </Layout>
  );
}
