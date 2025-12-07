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

    try {
      const res = await fetch("/api/chores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Failed to add chore")

      navigate("/chores/list")
    } catch (err) {
      console.error(err)
      alert("Error adding chore")
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Add Chore</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          name="name"
          placeholder="Chore name"
          className="border p-2 rounded"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="assignedTo"
          placeholder="Assigned to"
          className="border p-2 rounded"
          value={form.assignedTo}
          onChange={handleChange}
        />

        <input
          name="dueDate"
          type="date"
          className="border p-2 rounded"
          value={form.dueDate}
          onChange={handleChange}
        />

        <input
          name="color"
          placeholder="Color tag"
          className="border p-2 rounded"
          value={form.color}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Chore
        </button>
      </form>
    </div>
  )
}

