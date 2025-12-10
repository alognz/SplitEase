import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import { api } from "../../utils/api";

export default function ChoreDetails() {
  const { groupId, choreId } = useParams();
  const nav = useNavigate();

  const [chore, setChore] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId || !choreId) {
      setError("Missing group ID or chore ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    api(`/api/groups/${groupId}/chores`)
      .then((data) => {
        const chores = data.chores || [];
        const foundChore = chores.find((c) => c.id === choreId);

        if (foundChore) {
          setChore(foundChore);
        } else {
          setError("Chore not found.");
          setChore(null);
        }
      })
      .catch((err) => {
        console.error("Failed to load chore:", err);
        setError(err.message || "Failed to load chore. Please try again.");
        setChore(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [groupId, choreId]);

  async function markComplete() {
    try {
      const updated = await api(
        `/api/groups/${groupId}/chores/${choreId}`,
        "PATCH",
        { completed: true }
      );
      setChore(updated);
    } catch {
      setError("Failed to mark complete.");
    }
  }

  async function deleteChore() {
    if (!confirm("Delete this chore?")) return;

    try {
      await api(`/api/groups/${groupId}/chores/${choreId}`, "DELETE");
      nav(`/chores?groupId=${groupId}`);
    } catch {
      setError("Failed to delete chore.");
    }
  }

  if (loading) {
    return (
      <Layout>
        <p className="mt-10 text-center text-textSecondary">Loading...</p>
      </Layout>
    );
  }

  if (!chore) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto mt-10 font-sans">
          <p className="text-center text-red-500 mb-4">
            {error || "Chore not found."}
          </p>
          <Button
            variant="secondary"
            to={`/chores?groupId=${groupId || ""}`}
            width="w-48"
          >
            Back to Chores
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10 font-sans">
        <h1 className="text-3xl font-bold text-textPrimary mb-6">
          {chore.name}
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="bg-white border rounded-lg shadow-sm p-6 space-y-5">
          <div>
            <p className="text-sm text-textSecondary">Assigned To</p>
            <p className="text-lg font-medium">
              {chore.assignedTo?.username || "Unknown"}
            </p>
          </div>

          <div>
            <p className="text-sm text-textSecondary">Due Date</p>
            <p className="text-lg font-medium">
              {chore.dueDate
                ? new Date(chore.dueDate).toLocaleDateString()
                : "No due date"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm text-textSecondary">Color</p>
            <span
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: chore.color }}
            />
          </div>

          <div>
            <p className="text-sm text-textSecondary">Status</p>
            <p className="text-lg font-medium">
              {chore.completed ? "Completed" : "Not Completed"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-10">
          <div className="flex gap-4">
            {!chore.completed && (
              <Button variant="outline" onClick={markComplete} width="w-40">
                Mark Complete
              </Button>
            )}

            <Button
              to={`/groups/${groupId}/chores/${choreId}/edit`}
              width="w-32"
            >
              Edit
            </Button>

            <Button onClick={deleteChore} variant="secondary" width="w-32">
              Delete
            </Button>
            <Button
              to={`/chores?groupId=${groupId}`}
              variant="outline"
              width="w-40"
            >
              Back to Chores
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
