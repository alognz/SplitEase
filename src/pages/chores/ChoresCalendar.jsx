import { Link } from "react-router-dom";
import PageHeader from "../../../src/components/PageHeader";

const chores = [
  {
    id: 1,
    name: "Wash Dishes",
    assignedTo: "John",
    dueDate: 6,
    color: "bg-indigo-400",
  },
  {
    id: 2,
    name: "Trash",
    assignedTo: "Emily",
    dueDate: 2,
    color: "bg-green-400",
  },
  {
    id: 3,
    name: "Laundry",
    assignedTo: "Michael",
    dueDate: 6,
    color: "bg-pink-400",
  },
  {
    id: 4,
    name: "Vacuum",
    assignedTo: "Sarah",
    dueDate: 3,
    color: "bg-yellow-400",
  },
];

export default function ChoresCalendar() {
  return (
    <>
      <PageHeader title="Chores Calendar" />

      <div className="p-6 bg-white shadow-md rounded-md">

        {/* 星期标题 */}
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-500">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* 日期和任务 */}
        <div className="grid grid-cols-7 gap-2 mt-2">
          {Array.from({ length: 35 }, (_, i) => (
            <div
              key={i}
              className="border h-20 rounded-md flex flex-col p-1 text-xs"
            >
              {/* 日期数字 */}
              <span className="text-gray-400">{i + 1}</span>

              {/* 显示当天 chores */}
              {chores
                .filter(c => c.dueDate === i + 1)
                .map(c => (
                  <Link
                    key={c.id}
                    to={`/chores/edit/${c.id}`}
                    className={`${c.color} text-white rounded px-1 mt-1 text-xs truncate`}
                  >
                    {c.name}
                  </Link>
                ))}
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
