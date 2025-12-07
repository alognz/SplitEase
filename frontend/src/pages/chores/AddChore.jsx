import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AddChore() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    assignedTo: "",
    dueDate: "",
    color: ""
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // TODO: API POST here
    navigate("/chores/list")
  }

  const inputClass =
    "w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"

  const buttonClass =
    "w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-semibold"

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Chore</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block mb-1 text-gray-700 font-semibold">
            Chore Name
          </label>
          <input
            name="name"
            placeholder="Laundry, Trash..."
            className={inputClass}
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-semibold">
            Assigned To
          </label>
          <input
            name="assignedTo"
            placeholder="John, Mary..."
            className={inputClass}
            value={form.assignedTo}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-semibold">
            Due Date
          </label>
          <input
            name="dueDate"
            type="date"
            className={inputClass}
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-semibold">
            Color Tag
          </label>
          <input
            name="color"
            placeholder="#ff0000"
            className={inputClass}
            value={form.color}
            onChange={handleChange}
          />
        </div>

        <button className={buttonClass}>
          Submit
        </button>

        {/* ✨ Cancel Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full bg-gray-200 hover:bg-gray-300 transition text-gray-800 py-2 rounded-lg font-semibold"
        >
          Cancel
        </button>
      </form>
    </div>
  )
}
