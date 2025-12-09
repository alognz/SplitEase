import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { api } from "../utils/api";

export default function ExpenseDetails() {
  const { expenseId } = useParams();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");

  const nav = useNavigate();
  const [expense, setExpense] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExpense() {
      try {
        const data = await api(`/api/groups/${groupId}/expenses/${expenseId}`);
        setExpense(data);
      } catch {
        setError("Couldn't load expense.");
      }
    }

    fetchExpense();
  }, [expenseId, groupId]);

  async function handleDelete() {
    if (!confirm("Delete this expense?")) return;

    try {
      await api(`/api/groups/${groupId}/expenses/${expenseId}`, "DELETE");
      nav(`/expenses?groupId=${groupId}`);
    } catch {
      setError("Failed to delete expense.");
    }
  }

  if (!expense) {
    return (
      <Layout>
        <p className="text-center mt-10 text-textSecondary">Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-10 font-sans">
        {/* Title */}
        <h1 className="text-3xl font-bold text-textPrimary mb-6">
          {expense.name}
        </h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Card */}
        <div className="bg-white rounded-lg border shadow-sm p-6 space-y-6">
          {/* Amount */}
          <div>
            <p className="text-sm text-textSecondary">Total Amount</p>
            <p className="text-2xl font-bold text-textPrimary mt-1">
              ${(expense.amount / 100).toFixed(2)}
            </p>
          </div>

          {/* Paid By */}
          <div>
            <p className="text-sm text-textSecondary">Paid By</p>
            <p className="font-medium text-textPrimary mt-1">
              {expense.paidBy?.username}
            </p>
          </div>

          {/* Splits */}
          <div>
            <p className="text-sm text-textSecondary mb-2">Split Between</p>

            <div className="space-y-2">
              {expense.splits?.map((s) => (
                <div
                  key={s.userId}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border"
                >
                  <span className="text-textPrimary font-medium">
                    {s.username}
                  </span>
                  <span className="text-textSecondary">
                    ${(s.amount / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Created At */}
          <div>
            <p className="text-sm text-textSecondary">Created On</p>
            <p className="text-textPrimary mt-1">
              {new Date(expense.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <Button
            width="w-36"
            to={`/expenses/${expenseId}/edit?groupId=${groupId}`}
          >
            Edit
          </Button>

          <Button width="w-36" variant="outline" onClick={handleDelete}>
            Delete
          </Button>

          <Button
            width="w-48"
            variant="secondary"
            to={`/expenses?groupId=${groupId}`}
          >
            Back to Expenses
          </Button>
        </div>
      </div>
    </Layout>
  );
}
