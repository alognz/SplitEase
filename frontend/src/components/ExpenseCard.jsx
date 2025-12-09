import { Link } from "react-router-dom";

export default function ExpenseCard({
  id,
  name,
  amount,
  paidBy,
  splits,
  groupId,
}) {
  const formattedAmount = (amount / 100).toFixed(2);

  return (
    <Link to={`/groups/${groupId}/expenses/${id}`}>
      <div className="relative bg-white border rounded-lg shadow-sm p-4 flex hover:shadow">
        <div className="w-2 bg-primary rounded-l-lg absolute left-0 top-0 bottom-0" />

        <div className="ml-4">
          <h3 className="font-semibold text-textPrimary">{name}</h3>
          <p className="text-sm text-textSecondary mt-2">
            ${formattedAmount} total — split {splits?.length} ways
          </p>
          <p className="text-sm text-textSecondary mt-4">
            Paid by: {paidBy?.username}
          </p>
        </div>
      </div>
    </Link>
  );
}
