export default function ChoreItem({ chore }) {
  return (
    <div className="p-3 border rounded-md mb-2">
      <p className="font-semibold">{chore.name}</p>
      <p>Assigned to: {chore.assignedTo}</p>
      <p>Due: {chore.dueDate}</p>
    </div>
  )
}

