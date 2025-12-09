import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddChore() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    assignedTo: "",
    dueDate: "",
    color: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // 📌 提交 POST API
  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/chores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    navigate("/chores/list");
  }

  // Figma颜色 palette
  const colors = [
    "#92D36E",
    "#C9B3FF",
    "#76C9DB",
    "#FFA959",
    "#FF747C",
    "#D3D3D3",
    "#000000",
    "#E8C9FF",
  ];

  return (
    <div className="mt-10 flex justify-center">
      <form 
         onSubmit={handleSubmit}
         className="border border-[#456F64] rounded-lg px-10 py-8 w-[400px] shadow-sm"
      >
        <h2 className="text-center font-semibold text-xl mb-6">
          Add A Chore
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm font-medium">Chore Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md px-3 h-[36px]"
            placeholder="Take out trash"
          />
        </div>

        {/* Assigned */}
        <div className="mb-4">
          <label className="text-sm font-medium">Assigned To</label>
          <input
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md px-3 h-[36px]"
            placeholder="Maya"
          />
        </div>

        {/* Due Date */}
        <div className="mb-4">
          <label className="text-sm font-medium">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md px-3 h-[36px]"
          />
        </div>

        {/* Colors */}
        <label className="text-sm font-medium mb-1 block">Color</label>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {colors.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setForm({ ...form, color: c })}
              className="w-10 h-10 rounded-md"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-[#456F64] text-white px-6 py-2 rounded-md w-full"
        >
          Add
        </button>
      </form>
    </div>
  );
}
