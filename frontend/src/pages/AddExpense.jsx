import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { api } from "../utils/api";

export default function AddExpense() {
  const { groupId } = useParams();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [splitValues, setSplitValues] = useState({});
  const [manualMode, setManualMode] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMembers() {
      try {
        const group = await api(`/api/groups/${groupId}`);
        setGroupMembers(group.members);
      } catch (err) {
        console.error(err);
      }
    }
    loadMembers();
  }, [groupId]);

  useEffect(() => {
    if (manualMode) return;
    if (!amount || selectedMembers.length === 0) return;

    const totalCents = Math.round(parseFloat(amount) * 100);
    const share = Math.floor(totalCents / selectedMembers.length);
    const remainder = totalCents % selectedMembers.length;

    const updated = {};
    selectedMembers.forEach((m, i) => {
      updated[m.id] = i === 0 ? share + remainder : share;
    });

    setSplitValues(updated);
  }, [amount, selectedMembers, manualMode]);

  function addMember(member) {
    if (selectedMembers.some((m) => m.id === member.id)) return;

    const newList = [...selectedMembers, member];
    setSelectedMembers(newList);

    if (!manualMode && amount) {
      setManualMode(false);
    }
  }

  function removeMember(id) {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== id));

    setSplitValues((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (paidBy && !selectedMembers.some((m) => m.id === paidBy)) {
      const payer = groupMembers.find((m) => m.id === paidBy);
      addMember(payer);
    }

    const totalCents = Math.round(parseFloat(amount) * 100);

    const splitSum = Object.values(splitValues).reduce(
      (a, b) => a + (isNaN(b) ? 0 : b),
      0
    );

    if (splitSum !== totalCents) {
      setError("Split amounts must add up to the total.");
      return;
    }

    try {
      await api(`/api/groups/${groupId}/expenses`, "POST", {
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
      setError(err?.error || "Could not add expense.");
    }
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10 font-sans">
        <h1 className="text-3xl font-bold text-textPrimary mb-6">
          Add An Expense
        </h1>

        <form onSubmit={handleSubmit}>
          <p className="text-sm font-medium text-textSecondary mb-1">
            Expense Name
          </p>
          <input
            className="w-full h-11 border border-gray-300 px-3 mb-4 text-sm"
            placeholder="Groceries"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <p className="text-sm font-medium text-textSecondary mb-1">Amount</p>
          <input
            className="w-full h-11 border border-gray-300 px-3 mb-4 text-sm"
            placeholder="$ 0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <p className="text-sm font-medium text-textSecondary mb-1">Paid By</p>
          <select
            className="w-full h-11 border border-gray-300 px-3 mb-4 text-sm"
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

          <p className="text-sm font-medium text-textSecondary mb-2">Payees</p>
          <div className="flex flex-wrap gap-2 border border-gray-300 p-2 rounded mb-4">
            {selectedMembers.map((m) => (
              <span
                key={m.id}
                className="px-3 py-1 bg-white border border-primary rounded-full text-sm text-primary flex items-center gap-2"
              >
                {m.username}
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => removeMember(m.id)}
                >
                  ×
                </button>
              </span>
            ))}

            <select
              className="border border-gray-300 rounded px-2 text-sm"
              onChange={(e) => {
                const mem = groupMembers.find((m) => m.id === e.target.value);
                if (mem) addMember(mem);
              }}
            >
              <option value="">+ Add</option>
              {groupMembers
                .filter((m) => !selectedMembers.some((s) => s.id === m.id))
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.username}
                  </option>
                ))}
            </select>
          </div>

          <button
            type="button"
            className="text-primary text-sm mb-3 hover:underline"
            onClick={() => setManualMode(!manualMode)}
          >
            {manualMode ? "Use equal split" : "Edit amounts manually"}
          </button>

          {manualMode && (
            <div className="mb-4 space-y-3">
              {selectedMembers.map((m) => (
                <div key={m.id} className="flex justify-between items-center">
                  <span>{m.username}</span>
                  <input
                    className="w-24 h-10 border border-gray-300 rounded px-2"
                    value={
                      splitValues[m.id]
                        ? (splitValues[m.id] / 100).toFixed(2)
                        : ""
                    }
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      const cents =
                        val === "" ? 0 : Math.round(parseFloat(val) * 100);

                      setSplitValues({
                        ...splitValues,
                        [m.id]: cents,
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <div className="flex justify-center">
            <Button type="submit" center>
              Add Expense
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
