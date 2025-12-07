import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";

export default function EditChore() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    assignedTo: "",
    dueDate: "",
    color: ""
  });

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

  useEffect(() => {
    async function fetchChore() {
      try {
        const res = await fetch(`/api/chores/${id}`);
        const data = await res.json();
        setForm({
          name: data.name || "",
          assignedTo: data.assignedTo || "",
          dueDate: data.dueDate ? data.dueDate.slice(0, 10) : "",
          color: data.color || ""
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchChore();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave(e) {
    e.preventDefault();

    setSaving(true);

    await fetch(`/api/chores/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setSaving(false);

    alert("Chore updated!");
    navigate("/chores/list");
  }

  if (loading) {
    return (
      <Layout>
        <PageHeader title="Edit Chore" />
        <p className="text-gray-500 px-4">Loading chore...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader title="Edit Chore" />

      <div className="mt-10 flex justify-center">
        <form
          onSubmit={handleSave}
          className="border border-[#456F64] rounded-lg px-10 py-8 w-[400px] shadow-sm"
        >
          <h2 className="text-center font-semibold text-xl mb-6">
            Edit Chore
          </h2>

          {/* Name */}
          <div className="mb-4">
            <label className="text-sm font-medium">Chore Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md px-3 h-[36px]"
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

          {/* Color */}
          <label className="text-sm font-medium mb-1 block">Color</label>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {colors.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setForm({ ...form, color: c })}
                className={`w-10 h-10 rounded-md border ${form.color === c ? "ring-2 ring-[#456F64]" : ""}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Buttons */}
          <button
            type="submit"
            disabled={saving}
            className="bg-[#456F64] text-white px-6 py-2 rounded-md w-full mb-3"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full bg-gray-200 hover:bg-gray-300 transition text-gray-800 py-2 rounded-md font-medium"
          >
            Cancel
          </button>
        </form>
      </div>
    </Layout>
  );
}

