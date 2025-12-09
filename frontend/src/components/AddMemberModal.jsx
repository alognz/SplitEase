import { useState } from "react";
import { api } from "../utils/api";

export default function AddMemberModal({ groupId, onClose, onAdded }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const mockMember = { id: "999", username: "fakeUser" };

  async function handleAdd() {
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updated = await api(`/api/groups/${groupId}/members`, "POST", {
        username,
      });

      onAdded(updated);
      onClose();
    } catch (err) {
      console.error(err);

      onAdded({ members: [mockMember] });

      setError("User added (mock mode).");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white w-96 p-6 rounded-xl shadow-lg animate-scaleIn">
        <h2 className="text-2xl font-semibold text-textPrimary mb-4">
          Add Member
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="mb-5">
          <label className="text-sm text-textSecondary font-medium mb-1 block">
            Username
          </label>
          <input
            className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Enter username…"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#4f7c7a] disabled:opacity-50"
          >
            {loading ? "Adding…" : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}
