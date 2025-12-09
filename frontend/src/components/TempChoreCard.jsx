export default function ChoreCard({ chore }) {
  const due = new Date(chore.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="border rounded-lg p-4 mb-4 bg-white"
      style={{ borderLeft: `6px solid ${chore.color || "#4CAF50"}` }}
    >
      <h3 className="font-semibold text-textPrimary">{chore.name}</h3>

      <p className="text-sm text-textSecondary">
        Assigned to: {chore.assignedTo?.username || "Unknown"}
      </p>

      <p className="text-sm text-textSecondary">Due: {due}</p>

      <p className="text-sm mt-1">
        Status:{" "}
        {chore.completed ? (
          <span className="text-green-600">Completed</span>
        ) : (
          <span className="text-red-600">Not completed</span>
        )}
      </p>
    </div>
  );
}
