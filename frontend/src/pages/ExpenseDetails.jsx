import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { api } from "../utils/api";

export default function ExpenseDetails() {
  const { groupId, expenseId } = useParams();
  const nav = useNavigate();

  const [expense, setExpense] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpense() {
      if (!groupId || !expenseId) {
        setError("Missing group ID or expense ID.");
        setLoading(false);
        return;
      }

      try {
        const data = await api(`/api/groups/${groupId}/expenses/${expenseId}`);
        setExpense(data);
        setError("");
      } catch (err) {
        console.error("Failed to load expense:", err);
        setError("Couldn't load expense. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchExpense();
  }, [groupId, expenseId]);

  if (loading) {
    return (
      <Layout>
        <p className="text-center mt-10 text-textSecondary">Loading...</p>
      </Layout>
    );
  }

  if (!expense) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto mt-10 font-sans">
          <p className="text-center text-red-500 mb-4">
            {error || "Expense not found."}
          </p>
          <Button
            variant="secondary"
            to={`/expenses?groupId=${groupId || ""}`}
            width="w-48"
          >
            Back to Expenses
          </Button>
        </div>
      </Layout>
    );
  }

  async function handleDelete() {
    if (!confirm("Delete this expense?")) return;

    try {
      await api(`/api/groups/${groupId}/expenses/${expenseId}`, "DELETE");
      nav(`/expenses?groupId=${groupId}`);
    } catch {
      setError("Failed to delete expense.");
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-10 font-sans">
        <h1 className="text-3xl font-bold mb-6">{expense.name}</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <p className="text-sm text-textSecondary">Total Amount</p>
            <p className="text-2xl font-bold">
              ${(expense.amount / 100).toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-textSecondary">Paid By</p>
            <p>{expense.paidBy?.username}</p>
          </div>

          <div>
            <p className="text-sm text-textSecondary mb-2">Split Between</p>
            <div className="space-y-2">
              {expense.splits?.map((s) => (
                <div
                  key={s.userId}
                  className="flex justify-between p-3 bg-gray-50 border rounded-lg"
                >
                  <span>{s.username}</span>
                  <span>${(s.amount / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-textSecondary">Created On</p>
            <p>
              {expense.createdAt
                ? new Date(expense.createdAt).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Button
            to={`/groups/${groupId}/expenses/${expenseId}/edit`}
            width="w-36"
          >
            Edit
          </Button>

          <Button variant="outline" onClick={handleDelete} width="w-36">
            Delete
          </Button>

          <Button
            variant="secondary"
            to={`/expenses?groupId=${groupId}`}
            width="w-48"
          >
            Back to Expenses
          </Button>
        </div>
      </div>
    </Layout>
  );
}
