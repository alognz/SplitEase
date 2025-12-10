import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import { api } from "../../utils/api";

export default function EditChore() {
  const { groupId, choreId } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    assignedTo: "",
    dueDate: "",
    color: "#5A8A88",
    completed: false,
  });

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const group = await api(`/api/groups/${groupId}`);
        setMembers(group.members || []);

        const data = await api(`/api/groups/${groupId}/chores`);
        const chores = data.chores || [];
        const chore = chores.find((c) => c.id === choreId);

        if (chore) {
          setForm({
            name: chore.name,
            assignedTo: chore.assignedTo?.id || "",
            dueDate: chore.dueDate ? chore.dueDate.slice(0, 10) : "",
            color: chore.color || "#5A8A88",
            completed: chore.completed || false,
          });
        } else {
          setError("Chore not found.");
        }
      } catch (err) {
        console.error("Failed to load chore:", err);
        setError(err.message || "Unable to load chore.");
      }

      setLoading(false);
    }

    loadData();
  }, [groupId, choreId]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api(`/api/groups/${groupId}/chores/${choreId}`, "PATCH", form);

      nav(`/groups/${groupId}/chores/${choreId}`);
    } catch (err) {
      console.error("Failed to update chore:", err);
      setError(err?.error || err.message || "Failed to update chore.");
    }

    setSaving(false);
  }

  const colors = [
    "#92D36E",
    "#C9B3FF",
    "#76C9DB",
    "#FFA959",
    "#FF747C",
    "#D3D3D3",
    "#000000",
    "#E8C9FF",
  ];

  if (loading) {
    return (
      <Layout>
        <p className="text-center mt-10 text-textSecondary">Loading chore...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10 font-sans">
        <h1 className="text-3xl font-bold text-textPrimary mb-6">Edit Chore</h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <p className="text-sm text-textSecondary mb-1">Chore Name</p>
            <input
              className="w-full h-11 border px-3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <p className="text-sm text-textSecondary mb-1">Assigned To</p>
            <select
              className="w-full h-11 border px-3"
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            >
              <option value="">Select member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.username}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm text-textSecondary mb-1">Due Date</p>
            <input
              type="date"
              className="w-full h-11 border px-3"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

          <div>
            <p className="text-sm text-textSecondary mb-2">Color</p>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-10 h-10 rounded-md border ${
                    form.color === c ? "ring-2 ring-primary" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="completed"
              checked={form.completed}
              onChange={(e) =>
                setForm({ ...form, completed: e.target.checked })
              }
              className="w-5 h-5 cursor-pointer"
            />
            <label
              htmlFor="completed"
              className="text-sm text-textSecondary cursor-pointer"
            >
              Mark as completed
            </label>
          </div>

          <Button width="w-full" type="submit">
            {saving ? "Saving..." : "Save Changes"}
          </Button>

          <Button width="w-full" variant="outline" onClick={() => nav(-1)}>
            Cancel
          </Button>
        </form>
      </div>
    </Layout>
  );
}
