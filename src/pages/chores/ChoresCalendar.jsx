import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";

export default function ChoresCalendar() {
  const [chores, setChores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChores() {
      const res = await fetch("/api/chores");
      const data = await res.json();
      setChores(data);
    }

    fetchChores();
  }, []);

  // 根据日期分类
  const choresByDate = chores.reduce((acc, chore) => {
    const date = chore.dueDate?.slice(0,10); // yyyy-mm-dd
    if (!acc[date]) acc[date] = [];
    acc[date].push(chore);
    return acc;
  }, {});

  // 获取所有日期排序
  const sortedDates = Object.keys(choresByDate).sort();

  return (
    <Layout>
      <PageHeader title="Chore Calendar" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-10">

        {sortedDates.length === 0 && (
          <p className="text-gray-500 px-4">No chores found.</p>
        )}

        {sortedDates.map((date) => (
          <div key={date} className="bg-white rounded-xl shadow p-4">
            <div className="text-lg font-semibold mb-3">{date}</div>

            {choresByDate[date].map((c) => (
              <button
                key={c._id}
                onClick={() => navigate(`/chores/edit/${c._id}`)}
                className="flex items-center gap-3 w-full text-left py-2 px-2 rounded hover:bg-gray-100 transition"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: c.color }}
                ></span>

                <div className="flex-1">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-sm text-gray-500">
                    {c.assignedTo}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </Layout>
  );
}


