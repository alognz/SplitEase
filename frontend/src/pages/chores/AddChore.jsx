import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import { api } from "../../utils/api";

export default function AddChore() {
  const { groupId } = useParams();
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState(searchParams.get("dueDate") || "");
  const [color, setColor] = useState("#5A8A88");

  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMembers() {
      try {
        const group = await api(`/api/groups/${groupId}`);
        setMembers(group.members);
      } catch {
        setMembers([]);
      }
    }
    loadMembers();
  }, [groupId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await api(`/api/groups/${groupId}/chores`, "POST", {
        name,
        assignedTo,
        dueDate,
        color,
      });

      nav(`/chores?groupId=${groupId}`);
    } catch (err) {
      setError(err?.error || "Could not add chore.");
    }
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

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10 font-sans">
        <h1 className="text-3xl font-bold text-textPrimary mb-6">Add Chore</h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-textSecondary mb-1">Chore Name</p>
            <input
              className="w-full h-11 border px-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <p className="text-sm text-textSecondary mb-1">Assigned To</p>
            <select
              className="w-full h-11 border px-3"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
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
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <p className="text-sm text-textSecondary mb-2">Color</p>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-md border ${
                    color === c ? "ring-2 ring-primary" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <Button width="w-full" type="submit">
            Add Chore
          </Button>
        </form>
      </div>
    </Layout>
  );
}
