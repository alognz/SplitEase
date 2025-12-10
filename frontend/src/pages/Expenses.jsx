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

  const urlGroupId = searchParams.get("groupId");
  const savedGroupId = localStorage.getItem("selectedGroup");
  const selectedGroup = urlGroupId || savedGroupId || null;

  const [expenses, setExpenses] = useState(() => {
    if (!selectedGroup) return [];
    const cacheKey = `expenses_${selectedGroup}`;
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    return cached || [];
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedGroup && !urlGroupId) {
      setSearchParams({ groupId: selectedGroup });
      return;
    }

    if (selectedGroup) return;

    let cancelled = false;

    async function loadInitialGroup() {
      try {
        const data = await api("/api/groups");
        if (cancelled) return;

        const list = data.groups || [];
        localStorage.setItem("groups", JSON.stringify(list));
        const groupToSelect =
          savedGroupId && list.some((g) => g.id === savedGroupId)
            ? savedGroupId
            : list.length > 0
            ? list[0].id
            : null;
        if (groupToSelect) {
          setSearchParams({ groupId: groupToSelect });
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load groups:", err);
        const cached = JSON.parse(localStorage.getItem("groups") || "[]");
        const groupToSelect =
          savedGroupId && cached.some((g) => g.id === savedGroupId)
            ? savedGroupId
            : cached && cached.length > 0
            ? cached[0].id
            : null;
        if (groupToSelect) {
          setSearchParams({ groupId: groupToSelect });
        }
      }
    }

    loadInitialGroup();
    return () => {
      cancelled = true;
    };
  }, [selectedGroup, urlGroupId, savedGroupId, setSearchParams]);

  useEffect(() => {
    if (!selectedGroup) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
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
        if (cancelled) return;
        setExpenses(data.expenses || []);
        localStorage.setItem(cacheKey, JSON.stringify(data.expenses || []));
        setError("");
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load expenses:", err);
        if (!hasCachedData) {
          setError("Failed to load expenses. Please try again.");
          setExpenses([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadExpenses();

    return () => {
      cancelled = true;
    };
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
          <div className="relative">
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {loading && (
              <div className="absolute top-0 right-0 z-10 flex items-center gap-2 text-sm text-textSecondary bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            )}
            {expenses.length === 0 && !error && !loading ? (
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
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 transition-opacity duration-200 ${
                  loading ? "opacity-75" : "opacity-100"
                }`}
              >
                {expenses.map((exp) => (
                  <ExpenseCard key={exp.id} {...exp} groupId={selectedGroup} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
