import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import GroupSelector from "../components/GroupSelector";
import ExpenseCard from "../components/ExpenseCard";
import { api } from "../utils/api";

export default function Expenses() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedGroup = searchParams.get("groupId");
  const [expenses, setExpenses] = useState([]);

  const mockExpenses = [
    {
      id: "1",
      name: "Groceries",
      amount: 4520,
      paidBy: { username: "You" },
    },
    {
      id: "2",
      name: "Internet",
      amount: 3000,
      paidBy: { username: "Jintao" },
    },
  ];

  useEffect(() => {
    if (!selectedGroup) return;

    async function loadExpenses() {
      try {
        const data = await api(`/api/groups/${selectedGroup}/expenses`);
        setExpenses(data.expenses || []);
      } catch {
        console.log("Using mock expenses");
        setExpenses(mockExpenses);
      }
    }

    loadExpenses();
  }, [selectedGroup]);

  function handleGroupChange(groupId) {
    if (groupId === "new") return navigate("/groups/new");

    navigate(`/expenses?groupId=${groupId}`);
  }

  return (
    <Layout>
      <div className="font-sans max-w-6xl mx-auto">
        <PageHeader
          title="Expenses"
          right={
            <div className="flex items-center gap-4">
              <GroupSelector
                selectedGroup={selectedGroup}
                onChange={handleGroupChange}
              />

              {selectedGroup && (
                <Button
                  to={`/expenses/new?groupId=${selectedGroup}`}
                  width="w-auto px-4"
                >
                  Add Expense
                </Button>
              )}
            </div>
          }
        />

        {!selectedGroup && (
          <p className="text-textSecondary mt-8">
            Select a group to see its expenses.
          </p>
        )}

        {selectedGroup && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {expenses.map((exp) => (
              <ExpenseCard
                key={exp.id}
                {...exp}
                to={`/expenses/${exp.id}?groupId=${selectedGroup}`}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
