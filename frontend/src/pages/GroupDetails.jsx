import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { api } from "../utils/api";
import AddMemberModal from "../components/AddMemberModal";

export default function GroupDetails() {
  const { groupId } = useParams();
  const nav = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const mockGroup = {
    id: "1",
    name: "My Apartment",
    members: [
      { id: "a", username: "You" },
      { id: "b", username: "Jintao" },
    ],
  };

  async function fetchGroup() {
    setLoading(true);
    try {
      const data = await api(`/api/groups/${groupId}`);
      setGroup(data);
      localStorage.setItem(`group_${groupId}`, JSON.stringify(data));
    } catch {
      setGroup(mockGroup);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const cached = JSON.parse(
      localStorage.getItem(`group_${groupId}`) || "null"
    );
    if (cached) setGroup(cached);
    fetchGroup();
  }, [groupId]);

  async function deleteGroup() {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      await api(`/api/groups/${groupId}`, "DELETE");
    } catch {}

    nav("/groups");
  }

  if (loading || !group) {
    return (
      <Layout>
        <div className="p-10 text-center text-textSecondary">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto font-sans">
        <h1 className="text-3xl font-bold text-textPrimary mb-6">
          {group.name}
        </h1>

        <div className="flex items-center gap-4 mt-3 mb-8">
          <Button
            variant="primary"
            width="w-auto px-4"
            onClick={() => setShowAddModal(true)}
          >
            Add Member
          </Button>

          <Button
            variant="primary"
            width="w-auto px-4"
            to={`/groups/${groupId}/balances`}
          >
            View Balances
          </Button>
          <Button variant="secondary" width="w-auto px-4" onClick={deleteGroup}>
            Delete Group
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-textPrimary mb-4">
            Members
          </h2>

          <div className="space-y-3">
            {group.members?.map((m) => (
              <div
                key={m.id}
                className="w-full border border-gray-200 bg-white rounded-lg p-3 text-textPrimary"
              >
                {m.username}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddMemberModal
          groupId={groupId}
          onClose={() => setShowAddModal(false)}
          onAdded={(updated) => {
            setGroup(updated);
            localStorage.setItem(`group_${groupId}`, JSON.stringify(updated));
            setShowAddModal(false);
          }}
        />
      )}
    </Layout>
  );
}
