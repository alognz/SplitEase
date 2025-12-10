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

  const urlGroupId = searchParams.get("groupId");
  const savedGroupId = localStorage.getItem("selectedGroup");
  const selectedGroup = urlGroupId || savedGroupId || null;

  const [chores, setChores] = useState(() => {
    if (!selectedGroup) return [];
    const cacheKey = `chores_${selectedGroup}`;
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
      setChores([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
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
        if (cancelled) return;
        setChores(data.chores || []);
        localStorage.setItem(cacheKey, JSON.stringify(data.chores || []));
        setError("");
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load chores:", err);
        if (!hasCachedData) {
          setError("Failed to load chores. Please try again.");
          setChores([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadChores();

    return () => {
      cancelled = true;
    };
  }, [selectedGroup]);

  function handleGroupChange(groupId) {
    if (groupId === "new") return navigate("/groups/new");
    localStorage.setItem("selectedGroup", groupId);
    setSearchParams({ groupId });
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
          <div className="relative">
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {loading && (
              <div className="absolute top-0 right-0 z-10 flex items-center gap-2 text-sm text-textSecondary bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            )}
            {chores.length === 0 && !error && !loading ? (
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
              <div
                className={`flex flex-col gap-4 mt-6 transition-opacity duration-200 ${
                  loading ? "opacity-75" : "opacity-100"
                }`}
              >
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
          </div>
        )}
      </div>
    </Layout>
  );
}
