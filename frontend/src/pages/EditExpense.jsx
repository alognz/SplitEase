import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { api } from "../utils/api";

export default function EditExpense() {
  const { groupId, expenseId } = useParams();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [splitValues, setSplitValues] = useState({});
  const [manualMode, setManualMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const group = await api(`/api/groups/${groupId}`);
        setGroupMembers(group.members);

        let expense = await api(`/api/groups/${groupId}/expenses/${expenseId}`);

        setName(expense.name);
        setAmount((expense.amount / 100).toFixed(2));
        setPaidBy(expense.paidBy.id);

        setSelectedMembers(
          expense.splits.map((s) => ({
            id: s.userId,
            username: s.username,
          }))
        );

        const splitMap = {};
        expense.splits.forEach((s) => (splitMap[s.userId] = s.amount));
        setSplitValues(splitMap);
      } catch (err) {
        console.error("Failed to load expense:", err);
        setError("Failed to load expense. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [groupId, expenseId]);

  useEffect(() => {
    if (manualMode) return;
    if (!amount || selectedMembers.length === 0) return;

    const total = Math.round(parseFloat(amount) * 100);
    const share = Math.floor(total / selectedMembers.length);
    const remainder = total % selectedMembers.length;

    const updated = {};
    selectedMembers.forEach((m, i) => {
      updated[m.id] = i === 0 ? share + remainder : share;
    });

    setSplitValues(updated);
  }, [amount, selectedMembers, manualMode]);

  function addMember(member) {
    if (selectedMembers.some((m) => m.id === member.id)) return;

    const updated = [...selectedMembers, member];
    setSelectedMembers(updated);
  }

  function removeMember(id) {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== id));

    setSplitValues((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    const totalCents = Math.round(parseFloat(amount) * 100);
    const sum = Object.values(splitValues).reduce((a, b) => a + b, 0);

    if (sum !== totalCents) {
      setError("Split amounts must equal total.");
      return;
    }

    try {
      await api(`/api/groups/${groupId}/expenses/${expenseId}`, "PATCH", {
        name,
        amount: totalCents,
        paidBy,
        splits: selectedMembers.map((m) => ({
          userId: m.id,
          amount: splitValues[m.id],
        })),
      });

      nav(`/expenses?groupId=${groupId}`);
    } catch (err) {
      console.error(err);
      setError("Could not update expense.");
    }
  }

  if (loading) {
    return (
      <Layout>
        <p className="text-center mt-10 text-textSecondary">Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10 font-sans">
        <h1 className="text-3xl font-bold mb-6">Edit Expense</h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSave}>
          <p className="text-sm text-textSecondary mb-1">Expense Name</p>
          <input
            className="w-full h-11 border px-3 mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <p className="text-sm text-textSecondary mb-1">Amount</p>
          <input
            className="w-full h-11 border px-3 mb-4"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <p className="text-sm text-textSecondary mb-1">Paid By</p>
          <select
            className="w-full h-11 border px-3 mb-4"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
          >
            <option value="">Select payer</option>
            {groupMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.username}
              </option>
            ))}
          </select>

          <p className="text-sm text-textSecondary mb-2">Payees</p>
          <div className="flex flex-wrap gap-2 border p-2 rounded mb-4">
            {selectedMembers.map((m) => (
              <span
                key={m.id}
                className="px-3 py-1 border rounded-full text-sm flex items-center gap-2"
              >
                {m.username}
                <button
                  type="button"
                  onClick={() => removeMember(m.id)}
                  className="text-red-500"
                >
                  ×
                </button>
              </span>
            ))}

            <select
              className="border rounded px-2 text-sm"
              onChange={(e) => {
                const mem = groupMembers.find((m) => m.id === e.target.value);
                if (mem) addMember(mem);
              }}
            >
              <option value="">+ Add</option>
              {groupMembers
                .filter((gm) => !selectedMembers.some((s) => s.id === gm.id))
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.username}
                  </option>
                ))}
            </select>
          </div>

          <button
            type="button"
            className="text-primary text-sm mb-3 underline"
            onClick={() => setManualMode(!manualMode)}
          >
            {manualMode ? "Use equal split" : "Edit amounts manually"}
          </button>

          {manualMode && (
            <div className="mb-4 space-y-3">
              {selectedMembers.map((m) => (
                <div key={m.id} className="flex justify-between">
                  <span>{m.username}</span>
                  <input
                    className="w-24 h-10 border rounded px-2"
                    value={(splitValues[m.id] / 100).toFixed(2)}
                    onChange={(e) =>
                      setSplitValues({
                        ...splitValues,
                        [m.id]: Math.round(parseFloat(e.target.value) * 100),
                      })
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <div className="flex justify-center">
            <Button type="submit" center>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
