import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdChevronLeft,
  MdChevronRight,
  MdCalendarViewWeek,
  MdCheckCircle,
  MdAdd,
} from "react-icons/md";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import { api } from "../../utils/api";

export default function ChoresCalendar() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [chores, setChores] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await api(`/api/groups/${groupId}/chores`);
        setChores(data.chores || []);
        setError("");
      } catch (err) {
        console.error("Failed to load chores:", err);
        setError("Failed to load chores. Please try again.");
        setChores([]);
      }
    }
    load();
  }, [groupId]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  function choresForDate(day) {
    const dateKey = new Date(currentYear, currentMonth, day)
      .toISOString()
      .slice(0, 10);

    return chores.filter((c) => c.dueDate?.slice(0, 10) === dateKey);
  }

  function handleDayClick(day, e) {
    if (e.target.closest("button")) return;

    const dayChores = choresForDate(day);
    if (dayChores.length === 0) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toISOString().slice(0, 10);
      navigate(`/groups/${groupId}/chores/new?dueDate=${dateString}`);
    }
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long" }
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title="Chores"
          right={
            <Button to={`/chores?groupId=${groupId}`} variant="outline">
              <MdCalendarViewWeek className="mr-1" />
              List View
            </Button>
          }
        />

        {error && <p className="text-red-500 mb-4 text-center px-4">{error}</p>}

        <div className="flex items-center justify-between mb-6 px-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MdChevronLeft className="text-2xl text-textPrimary" />
          </button>

          <div className="text-2xl font-bold text-textPrimary">
            {monthName} {currentYear}
          </div>

          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MdChevronRight className="text-2xl text-textPrimary" />
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-sm font-semibold text-textSecondary px-4 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-3 border-b border-gray-200">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 px-4 gap-2 mt-2">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="h-32 rounded-lg bg-transparent"
            ></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayChores = choresForDate(day);

            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            const isEmpty = dayChores.length === 0;

            return (
              <div
                key={day}
                onClick={(e) => handleDayClick(day, e)}
                className={`border rounded-xl h-36 p-2.5 flex flex-col text-sm bg-white shadow-sm transition-all ${
                  isToday ? "ring-2 ring-primary ring-offset-2" : ""
                } ${
                  isEmpty
                    ? "hover:shadow-md hover:bg-gray-50 cursor-pointer group"
                    : "hover:shadow-md"
                }`}
              >
                <div
                  className={`font-semibold mb-1 flex items-center justify-between ${
                    isToday ? "text-primary" : "text-textPrimary"
                  }`}
                >
                  <span>{day}</span>
                  {isEmpty && (
                    <MdAdd className="text-gray-400 group-hover:text-primary transition-colors text-sm opacity-0 group-hover:opacity-100" />
                  )}
                </div>

                <div className="mt-1 space-y-1 overflow-y-auto flex-1">
                  {dayChores.map((c) => {
                    const isOverdue =
                      c.dueDate &&
                      !c.completed &&
                      new Date(c.dueDate) < new Date();
                    return (
                      <button
                        key={c.id}
                        onClick={() =>
                          navigate(`/groups/${groupId}/chores/${c.id}`)
                        }
                        className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors ${
                          c.completed ? "opacity-60" : ""
                        } ${
                          isOverdue ? "bg-red-50 border border-red-200" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: c.color }}
                          />
                          {c.completed && (
                            <MdCheckCircle className="text-green-600 text-sm" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-medium text-xs truncate ${
                              c.completed ? "line-through" : ""
                            }`}
                          >
                            {c.name}
                          </div>
                          <div className="text-xs text-textSecondary truncate">
                            {c.assignedTo?.username}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
