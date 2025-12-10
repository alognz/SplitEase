import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

export default function ChoreItem({ chore, groupId, onUpdate }) {
  const navigate = useNavigate();

  async function toggleComplete(e) {
    e.stopPropagation();

    try {
      const updated = await api(
        `/api/groups/${groupId}/chores/${chore.id}`,
        "PATCH",
        { completed: !chore.completed }
      );

      if (onUpdate) onUpdate(updated);
    } catch (err) {
      console.error("Failed to toggle chore completion:", err);
    }
  }

  return (
    <div
      onClick={() => navigate(`/groups/${groupId}/chores/${chore.id}`)}
      className="p-3 border rounded-md bg-white flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
    >
      <div>
        <p className="font-medium text-textPrimary">{chore.name}</p>
        <p className="text-sm text-textSecondary">
          Assigned to: {chore.assignedTo?.username || "Unknown"}
        </p>
        <p className="text-sm text-textSecondary">
          Due:{" "}
          {chore.dueDate ? new Date(chore.dueDate).toLocaleDateString() : "—"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div
          onClick={toggleComplete}
          className={`w-5 h-5 rounded border flex items-center justify-center ${
            chore.completed
              ? "bg-primary border-primary text-white"
              : "border-gray-400"
          }`}
        >
          {chore.completed && "✓"}
        </div>

        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: chore.color || "#5A8A88" }}
        />
      </div>
    </div>
  );
}
