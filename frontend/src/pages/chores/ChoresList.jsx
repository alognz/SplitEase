import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MdCheckCircle, MdAdd, MdCalendarViewWeek } from "react-icons/md";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import GroupSelector from "../../components/GroupSelector";
import ChoreCard from "../../components/ChoreCard";
import { api } from "../../utils/api";

export default function ChoresList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedGroup = searchParams.get("groupId");

  const [chores, setChores] = useState(() => {
    if (!selectedGroup) return [];
    const cacheKey = `chores_${selectedGroup}`;
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
      setChores([]);
      setLoading(false);
      return;
    }

    const cacheKey = `chores_${selectedGroup}`;
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    const hasCachedData = !!cached;

    if (cached) {
      setChores(cached);
    } else {
      setLoading(true);
    }

    async function loadChores() {
      try {
        const data = await api(`/api/groups/${selectedGroup}/chores`);
        const chores = data.chores || [];
        setChores(chores);
        localStorage.setItem(cacheKey, JSON.stringify(chores));
        setError("");
      } catch (err) {
        console.error("Failed to load chores:", err);
        if (!hasCachedData) {
          setError("Failed to load chores. Please try again.");
          setChores([]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadChores();
  }, [selectedGroup]);

  function handleGroupChange(groupId) {
    if (groupId === "new") return navigate("/groups/new");

    navigate(`/chores?groupId=${groupId}`);
  }

  return (
    <Layout>
      <div className="font-sans max-w-6xl mx-auto">
        <PageHeader
          title="Chores"
          right={
            <div className="flex items-center gap-4">
              <GroupSelector
                selectedGroup={selectedGroup}
                onChange={handleGroupChange}
              />

              {selectedGroup && (
                <>
                  <Button
                    to={`/groups/${selectedGroup}/chores/new`}
                    width="w-auto px-4"
                  >
                    <MdAdd className="mr-1" />
                    Add Chore
                  </Button>

                  <Button
                    variant="outline"
                    to={`/groups/${selectedGroup}/chores/calendar`}
                    width="w-auto px-4"
                  >
                    <MdCalendarViewWeek className="mr-1" />
                    Calendar View
                  </Button>
                </>
              )}
            </div>
          }
        />

        {!selectedGroup && (
          <div className="mt-8 p-12 bg-gray-50 border border-gray-200 rounded-xl text-center">
            <MdCheckCircle className="text-5xl text-gray-400 mx-auto mb-4" />
            <p className="text-textSecondary text-lg">
              Select a group to see its chores.
            </p>
          </div>
        )}

        {selectedGroup && (
          <>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {loading && chores.length === 0 ? (
              <p className="text-textSecondary mt-8 text-center">
                Loading chores...
              </p>
            ) : chores.length === 0 && !error ? (
              <div className="mt-8 p-12 bg-gray-50 border border-gray-200 rounded-xl text-center">
                <MdCheckCircle className="text-5xl text-gray-400 mx-auto mb-4" />
                <p className="text-textSecondary text-lg mb-4">
                  No chores yet.
                </p>
                <Button
                  to={`/groups/${selectedGroup}/chores/new`}
                  width="w-auto px-6"
                >
                  <MdAdd className="mr-1" />
                  Add Your First Chore
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-6">
                {chores.map((chore) => (
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
          </>
        )}
      </div>
    </Layout>
  );
}
