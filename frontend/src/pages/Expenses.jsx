import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MdReceipt, MdAdd } from "react-icons/md";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import GroupSelector from "../components/GroupSelector";
import ExpenseCard from "../components/ExpenseCard";
import { api } from "../utils/api";

export default function Expenses() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedGroup = searchParams.get("groupId");

  const [expenses, setExpenses] = useState(() => {
    if (!selectedGroup) return [];
    const cacheKey = `expenses_${selectedGroup}`;
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    return cached || [];
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedGroup) return;

    async function loadInitialGroup() {
      try {
        const data = await api("/api/groups");
        const list = data.groups || [];
        localStorage.setItem("groups", JSON.stringify(list));

        if (list.length > 0) {
          setSearchParams({ groupId: list[0].id });
        }
      } catch (err) {
        console.error("Failed to load groups:", err);
        const cached = JSON.parse(localStorage.getItem("groups") || "[]");
        if (cached && cached.length > 0) {
          setSearchParams({ groupId: cached[0].id });
        }
      }
    }

    loadInitialGroup();
  }, [selectedGroup, setSearchParams]);

  useEffect(() => {
    if (!selectedGroup) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    const cacheKey = `expenses_${selectedGroup}`;
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    const hasCachedData = !!cached;

    if (cached) {
      setExpenses(cached);
    } else {
      setLoading(true);
    }

    async function loadExpenses() {
      try {
        const data = await api(`/api/groups/${selectedGroup}/expenses`);
        const expenses = data.expenses || [];
        setExpenses(expenses);
        localStorage.setItem(cacheKey, JSON.stringify(expenses));
        setError("");
      } catch (err) {
        console.error("Failed to load expenses:", err);
        if (!hasCachedData) {
          setError("Failed to load expenses. Please try again.");
          setExpenses([]);
        }
      } finally {
        setLoading(false);
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
                  to={`/groups/${selectedGroup}/expenses/new`}
                  width="w-auto px-4"
                >
                  <MdAdd className="mr-1" />
                  Add Expense
                </Button>
              )}
            </div>
          }
        />

        {!selectedGroup && (
          <div className="mt-8 p-12 bg-gray-50 border border-gray-200 rounded-xl text-center">
            <MdReceipt className="text-5xl text-gray-400 mx-auto mb-4" />
            <p className="text-textSecondary text-lg">
              Select a group to see its expenses.
            </p>
          </div>
        )}

        {selectedGroup && (
          <>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {loading && expenses.length === 0 ? (
              <p className="text-textSecondary mt-8 text-center">
                Loading expenses...
              </p>
            ) : expenses.length === 0 && !error ? (
              <div className="mt-8 p-12 bg-gray-50 border border-gray-200 rounded-xl text-center">
                <MdReceipt className="text-5xl text-gray-400 mx-auto mb-4" />
                <p className="text-textSecondary text-lg mb-4">
                  No expenses yet.
                </p>
                <Button
                  to={`/groups/${selectedGroup}/expenses/new`}
                  width="w-auto px-6"
                >
                  <MdAdd className="mr-1" />
                  Add Your First Expense
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {expenses.map((exp) => (
                  <ExpenseCard key={exp.id} {...exp} groupId={selectedGroup} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
