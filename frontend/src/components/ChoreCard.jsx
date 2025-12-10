import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdCheckCircle, MdPerson, MdCalendarToday, MdTask } from "react-icons/md";
import { api } from "../utils/api";

export default function ChoreCard({ chore, groupId, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function toggleComplete(e) {
    e.stopPropagation();
    setLoading(true);

    try {
      const updated = await api(
        `/api/groups/${groupId}/chores/${chore.id}`,
        "PATCH",
        { completed: !chore.completed }
      );

      if (onUpdate) onUpdate(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const assignedName =
    chore.assignedTo?.username || chore.assignedTo || "Unknown";

  const dueLabel = chore.dueDate
    ? new Date(chore.dueDate).toLocaleDateString()
    : "No due date";

  const color = chore.color || "#456F64";
  const isOverdue = chore.dueDate && !chore.completed && new Date(chore.dueDate) < new Date();

  return (
    <div
      onClick={() => navigate(`/groups/${groupId}/chores/${chore.id}`)}
      className={`relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm p-5 flex cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group ${
        chore.completed ? "opacity-70" : ""
      }`}
    >
      <div
        className="w-1.5 rounded-l-xl absolute left-0 top-0 bottom-0"
        style={{ backgroundColor: color }}
      />

      <div className="ml-5 flex-1">
        <div className="flex items-start gap-3">
          <div 
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: `${color}15` }}
          >
            <MdTask className="text-xl" style={{ color: color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`font-semibold text-textPrimary text-lg ${chore.completed ? "line-through" : ""}`}>
                {chore.name}
              </h3>
              {chore.completed && (
                <MdCheckCircle className="text-green-500 text-xl" />
              )}
              {isOverdue && !chore.completed && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                  Overdue
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 text-sm text-textSecondary">
              <div className="flex items-center gap-2">
                <MdPerson className="text-primary" />
                <span>{assignedName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MdCalendarToday className={isOverdue ? "text-red-500" : "text-primary"} />
                <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                  Due: {dueLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={toggleComplete}
        className="ml-3 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
      >
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          chore.completed 
            ? "bg-green-500 border-green-500" 
            : "border-gray-300 hover:border-primary"
        }`}>
          {chore.completed && (
            <MdCheckCircle className="text-white text-sm" />
          )}
        </div>
      </button>
    </div>
  );
}
