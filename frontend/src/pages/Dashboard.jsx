import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdReceipt,
  MdCheckCircle,
  MdTrendingUp,
  MdPeople,
  MdHistory,
} from "react-icons/md";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import GroupSelector from "../components/GroupSelector";
import ExpenseCard from "../components/ExpenseCard";
import ChoreCard from "../components/ChoreCard";
import { api } from "../utils/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedGroup, setSelectedGroup] = useState(() => {
    const saved = localStorage.getItem("selectedGroup");
    if (saved) return saved;

    const newGroupId = localStorage.getItem("newGroupId");
    if (newGroupId) return newGroupId;

    return null;
  });
  const newGroupIdHandled = useRef(false);

  useEffect(() => {
    if (selectedGroup) {
      localStorage.setItem("selectedGroup", selectedGroup);
    }
  }, [selectedGroup]);

  const [expenses, setExpenses] = useState(() => {
    const cached = JSON.parse(localStorage.getItem("groups") || "[]");
    if (cached && cached.length > 0) {
      const cacheKey = `dashboard_${cached[0].id}`;
      const dashboardCache = JSON.parse(
        localStorage.getItem(cacheKey) || "null"
      );
      return dashboardCache?.expenses || [];
    }
    return [];
  });

  const [chores, setChores] = useState(() => {
    const cached = JSON.parse(localStorage.getItem("groups") || "[]");
    if (cached && cached.length > 0) {
      const cacheKey = `dashboard_${cached[0].id}`;
      const dashboardCache = JSON.parse(
        localStorage.getItem(cacheKey) || "null"
      );
      return dashboardCache?.chores || [];
    }
    return [];
  });

  const [activity, setActivity] = useState(() => {
    const cached = JSON.parse(localStorage.getItem("groups") || "[]");
    if (cached && cached.length > 0) {
      const cacheKey = `dashboard_${cached[0].id}`;
      const dashboardCache = JSON.parse(
        localStorage.getItem(cacheKey) || "null"
      );
      return dashboardCache?.activity || [];
    }
    return [];
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadInitialGroup() {
    try {
      const data = await api("/api/groups");
      const list = data.groups || [];
      localStorage.setItem("groups", JSON.stringify(list));

      if (list.length > 0) {
        setSelectedGroup(list[0].id);
      } else {
        setSelectedGroup(null);
        setError("No groups found. Create a group to get started!");
      }
    } catch (err) {
      console.error("Failed to load groups:", err);
      const cached = JSON.parse(localStorage.getItem("groups") || "[]");
      if (cached && cached.length > 0) {
        setSelectedGroup(cached[0].id);
      } else {
        setSelectedGroup(null);
        setError("Failed to load groups. Please refresh the page.");
      }
    }
  }

  function formatActivity(a) {
    const user = a.actor?.username || "Someone";
    const metadata = a.metadata || {};

    switch (a.type) {
      case "expense_added":
        return `${user} added an expense: ${metadata.name || "Unknown"}`;

      case "expense_updated":
        return `${user} updated an expense: ${metadata.name || "Unknown"}`;

      case "expense_deleted":
        return `${user} deleted an expense: ${metadata.name || "Unknown"}`;

      case "member_joined":
        return `${metadata.username || "Someone"} joined the group`;

      case "member_left":
        return `${metadata.username || "Someone"} left the group`;

      case "chore_added":
        return `${user} added a chore: ${metadata.name || "Unknown"}`;

      case "chore_completed":
        return `${user} completed a chore: ${metadata.name || "Unknown"}`;

      default:
        return `${user} did: ${a.type}`;
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api("/api/groups");
        if (cancelled) return;
        const list = data.groups || [];
        localStorage.setItem("groups", JSON.stringify(list));

        if (cancelled) return;

        const newGroupId = localStorage.getItem("newGroupId");
        if (
          newGroupId &&
          list.some((g) => g.id === newGroupId) &&
          !newGroupIdHandled.current
        ) {
          setSelectedGroup(newGroupId);
          localStorage.removeItem("newGroupId");
          newGroupIdHandled.current = true;
          return;
        }

        if (cancelled) return;

        if (selectedGroup && list.some((g) => g.id === selectedGroup)) {
          return;
        }

        if (cancelled) return;

        if (list.length > 0) {
          setSelectedGroup(list[0].id);
        } else {
          setSelectedGroup(null);
          setError("No groups found. Create a group to get started!");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load groups:", err);
        const cached = JSON.parse(localStorage.getItem("groups") || "[]");
        const newGroupId = localStorage.getItem("newGroupId");

        if (newGroupId && cached.some((g) => g.id === newGroupId)) {
          setSelectedGroup(newGroupId);
          localStorage.removeItem("newGroupId");
          newGroupIdHandled.current = true;
        } else if (
          selectedGroup &&
          cached.some((g) => g.id === selectedGroup)
        ) {
          return;
        } else if (cached && cached.length > 0) {
          setSelectedGroup(cached[0].id);
        } else {
          setSelectedGroup(null);
          setError("Failed to load groups. Please refresh the page.");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("newGroupId")) {
      return;
    }

    let cancelled = false;
    const cached = JSON.parse(localStorage.getItem("groups") || "null");

    if ((!cached || cached.length === 0) && !selectedGroup) {
      async function load() {
        try {
          const data = await api("/api/groups");
          if (cancelled) return;
          const list = data.groups || [];
          localStorage.setItem("groups", JSON.stringify(list));

          if (list.length > 0) {
            const newGroupId = localStorage.getItem("newGroupId");
            if (
              newGroupId &&
              list.some((g) => g.id === newGroupId) &&
              !newGroupIdHandled.current
            ) {
              setSelectedGroup(newGroupId);
              localStorage.removeItem("newGroupId");
              newGroupIdHandled.current = true;
            } else if (!selectedGroup) {
              setSelectedGroup(list[0].id);
            }
          }
        } catch {}
      }
      load();
    }
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!selectedGroup) return;

    let cancelled = false;

    async function load() {
      const cacheKey = `dashboard_${selectedGroup}`;
      const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
      const hasCachedData = !!cached;

      if (cached) {
        setExpenses(cached.expenses || []);
        setChores(cached.chores || []);
        setActivity(cached.activity || []);
      } else {
        setLoading(true);
      }

      try {
        const [expRes, choreRes, actRes] = await Promise.all([
          api(`/api/groups/${selectedGroup}/expenses`),
          api(`/api/groups/${selectedGroup}/chores`),
          api(`/api/groups/${selectedGroup}/activities`),
        ]);

        if (cancelled) return;

        const newData = {
          expenses: expRes.expenses || [],
          chores: choreRes.chores || [],
          activity: actRes.activities?.map(formatActivity) || [],
        };

        setExpenses(newData.expenses);
        setChores(newData.chores);
        setActivity(newData.activity);
        localStorage.setItem(cacheKey, JSON.stringify(newData));
        setError("");
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load dashboard data:", err);
        if (
          err.message?.includes("Group dne") ||
          err.message?.includes("404")
        ) {
          setError(
            "This group doesn't exist. Please select a different group."
          );
          const cached = JSON.parse(localStorage.getItem("groups") || "[]");
          const filtered = cached.filter((g) => g.id !== selectedGroup);
          localStorage.setItem("groups", JSON.stringify(filtered));
          if (filtered.length > 0) {
            setSelectedGroup(filtered[0].id);
          } else {
            setSelectedGroup(null);
          }
        } else {
          if (!hasCachedData) {
            setError("Failed to load dashboard data. Please try again.");
            setExpenses([]);
            setChores([]);
            setActivity([]);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [selectedGroup]);

  return (
    <Layout>
      <div className="font-sans max-w-6xl mx-auto">
        <PageHeader
          title="Dashboard"
          right={
            <div className="flex items-center space-x-4">
              <GroupSelector
                selectedGroup={selectedGroup}
                onChange={(g) => {
                  if (g === "new") return navigate("/groups/new");
                  setSelectedGroup(g);
                }}
              />

              {selectedGroup && (
                <>
                  <Button
                    to={`/groups/${selectedGroup}/expenses/new`}
                    width="w-auto px-4"
                  >
                    Add Expense
                  </Button>

                  <Button
                    to={`/groups/${selectedGroup}/chores/new`}
                    variant="outline"
                    width="w-auto px-4"
                  >
                    Add Chore
                  </Button>

                  <Button
                    to={`/groups/${selectedGroup}/balances`}
                    width="w-auto px-4"
                  >
                    View Balances
                  </Button>
                </>
              )}
            </div>
          }
        />

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {selectedGroup ? (
          <div className="relative">
            {loading && (
              <div className="absolute top-0 right-0 z-10 flex items-center gap-2 text-sm text-textSecondary bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            )}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 transition-opacity duration-200 ${
                loading ? "opacity-75" : "opacity-100"
              }`}
            >
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <MdReceipt className="text-primary text-2xl" />
                  </div>
                  <span className="text-2xl font-bold text-textPrimary">
                    {expenses.length}
                  </span>
                </div>
                <p className="text-sm text-textSecondary font-medium">
                  Total Expenses
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-green-200 rounded-lg">
                    <MdCheckCircle className="text-green-600 text-2xl" />
                  </div>
                  <span className="text-2xl font-bold text-textPrimary">
                    {chores.filter((c) => c.completed).length}/{chores.length}
                  </span>
                </div>
                <p className="text-sm text-textSecondary font-medium mb-2">
                  Chores Completed
                </p>
                {chores.length > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (chores.filter((c) => c.completed).length /
                            chores.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <MdTrendingUp className="text-textSecondary text-2xl" />
                  </div>
                  <span className="text-2xl font-bold text-textPrimary">
                    $
                    {expenses.length > 0
                      ? (
                          expenses.reduce(
                            (sum, e) => sum + (e.amount || 0),
                            0
                          ) /
                          expenses.length /
                          100
                        ).toFixed(0)
                      : "0"}
                  </span>
                </div>
                <p className="text-sm text-textSecondary font-medium">
                  Average Expense
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-primary/15 rounded-lg">
                    <MdHistory className="text-primary text-2xl" />
                  </div>
                  <span className="text-2xl font-bold text-textPrimary">
                    {activity.length}
                  </span>
                </div>
                <p className="text-sm text-textSecondary font-medium">
                  Recent Activities
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-textSecondary mb-3 mt-10 flex items-center gap-2">
              <MdReceipt className="text-primary" />
              Recent Expenses
            </h2>

            {expenses.length === 0 ? (
              <div className="mt-4 p-8 bg-gray-50 border border-gray-200 rounded-xl text-center">
                <MdReceipt className="text-4xl text-gray-400 mx-auto mb-3" />
                <p className="text-textSecondary">
                  No expenses yet. Add your first expense to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {expenses.slice(0, 6).map((exp) => (
                  <ExpenseCard key={exp.id} {...exp} groupId={selectedGroup} />
                ))}
              </div>
            )}

            <h2 className="text-xl font-semibold text-textSecondary mb-5 mt-10 flex items-center gap-2">
              <MdCheckCircle className="text-primary" />
              Upcoming Chores
            </h2>

            {chores.length === 0 ? (
              <div className="mt-4 p-8 bg-gray-50 border border-gray-200 rounded-xl text-center">
                <MdCheckCircle className="text-4xl text-gray-400 mx-auto mb-3" />
                <p className="text-textSecondary">
                  No chores yet. Add your first chore to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {chores.slice(0, 6).map((chore) => (
                  <ChoreCard
                    key={chore.id}
                    chore={chore}
                    groupId={selectedGroup}
                    onUpdate={(updated) =>
                      setChores((prev) =>
                        prev.map((c) => (c.id === updated.id ? updated : c))
                      )
                    }
                  />
                ))}
              </div>
            )}

            <h2 className="text-xl font-semibold text-textSecondary mb-3 mt-10 flex items-center gap-2">
              <MdHistory className="text-primary" />
              Activity Feed
            </h2>

            {activity.length === 0 ? (
              <div className="mt-4 p-8 bg-gray-50 border border-gray-200 rounded-xl text-center">
                <MdHistory className="text-4xl text-gray-400 mx-auto mb-3" />
                <p className="text-textSecondary">No recent activity.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {activity.slice(0, 10).map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="p-2 bg-primary/10 rounded-full">
                      <MdHistory className="text-primary text-sm" />
                    </div>
                    <p className="text-textSecondary flex-1">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 p-12 bg-gray-50 border border-gray-200 rounded-xl text-center">
            <MdPeople className="text-5xl text-gray-400 mx-auto mb-4" />
            <p className="text-textSecondary text-lg mb-2">No group selected</p>
            <p className="text-textSecondary">
              Select a group from the dropdown above to view your dashboard.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
