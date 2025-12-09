import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import GroupSelector from "../components/GroupSelector";
import ExpenseCard from "../components/ExpenseCard";
import ChoreCard from "../components/TempChoreCard";
import { api } from "../utils/api";

export default function Dashboard() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [chores, setChores] = useState([]);
  const [activity, setActivity] = useState([]);

  const mockExpenses = [
    {
      id: "1",
      name: "Groceries",
      amount: 4520,
      paidBy: { username: "You" },
      splits: [],
    },
    {
      id: "2",
      name: "Internet",
      amount: 3000,
      paidBy: { username: "Jintao" },
      splits: [],
    },
  ];

  const mockChores = [
    { id: "c1", name: "Vacuum", assignedTo: "You", completed: false },
    { id: "c2", name: "Trash Day", assignedTo: "Sarah", completed: false },
  ];

  const mockActivity = [
    "You added an expense: Groceries",
    "Jintao completed: Dishes",
    "Sarah joined the group",
  ];

  async function loadInitialGroup() {
    try {
      const cached = JSON.parse(localStorage.getItem("groups") || "null");
      let list = cached;

      if (!list) {
        const data = await api("/api/groups");
        list = data.groups;
        localStorage.setItem("groups", JSON.stringify(list));
      }

      if (list.length > 0) setSelectedGroup(list[0].id);
    } catch {
      setSelectedGroup("mock-group");
    }
  }

  async function loadDashboardData(groupId) {
    const cacheKey = `dashboard_${groupId}`;
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");

    if (cached) {
      setExpenses(cached.expenses);
      setChores(cached.chores);
      setActivity(cached.activity);
    }

    try {
      const [expRes, choreRes, actRes] = await Promise.all([
        api(`/api/groups/${groupId}/expenses`),
        api(`/api/groups/${groupId}/chores`),
        api(`/api/groups/${groupId}/activities`),
      ]);

      const newData = {
        expenses: expRes.expenses || [],
        chores: choreRes.chores || [],
        activity:
          actRes.activities?.map((a) => `${a.actor.username} did: ${a.type}`) ||
          [],
      };

      setExpenses(newData.expenses);
      setChores(newData.chores);
      setActivity(newData.activity);
      localStorage.setItem(cacheKey, JSON.stringify(newData));
    } catch {
      setExpenses(mockExpenses);
      setChores(mockChores);
      setActivity(mockActivity);
    }
  }

  useEffect(() => {
    loadInitialGroup();
  }, []);

  useEffect(() => {
    if (selectedGroup) loadDashboardData(selectedGroup);
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
                  if (g === "new")
                    return (window.location.href = "/groups/new");
                  setSelectedGroup(g);
                }}
              />

              <Button
                to={`/groups/${selectedGroup}/expenses/new`}
                width="w-auto px-4"
              >
                Add Expense
              </Button>

              <Button variant="outline" width="w-auto px-4">
                Add Chore
              </Button>

              <Button
                to={`/groups/${selectedGroup}/balances`}
                width="w-auto px-4"
              >
                View Balances
              </Button>
            </div>
          }
        />

        <h2 className="text-xl font-semibold text-textSecondary mb-3 mt-10">
          Recent Expenses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {expenses.map((exp) => (
            <ExpenseCard key={exp.id} {...exp} groupId={selectedGroup} />
          ))}
        </div>

        <h2 className="text-xl font-semibold text-textSecondary mb-5 mt-10">
          Upcoming Chores
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {chores.map((c) => (
            <ChoreCard key={c.id} chore={c} />
          ))}
        </div>

        <h2 className="text-xl font-semibold text-textSecondary mb-3 mt-10">
          Activity Feed
        </h2>

        <ul className="space-y-2">
          {activity.map((item, i) => (
            <li key={i} className="text-textSecondary">
              • {item}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
