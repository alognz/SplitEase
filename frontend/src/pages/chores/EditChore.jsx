import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function EditChore() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    assignedTo: "",
    dueDate: "",
    color: ""
  })

  useEffect(() => {
    async function fetchChore() {
      try {
        const res = await fetch(`/api/chores/${id}`)
        const data = await res.json()
        setForm(data)
      } catch (err) {
        console.error("failed to load chore", err)
      }
    }
    fetchChore()
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const res = await fetch(`/api/chores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("failed to update chore")

      navigate("/chores/list")
    } catch (err) {
      alert("Failed to update chore")
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Edit Chore</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          name="name"
          className="border p-2"
          placeholder="Chore Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="assignedTo"
          className="border p-2"
          placeholder="Assigned to"
          value={form.assignedTo}
          onChange={handleChange}
        />

        <input
          name="dueDate"
          type="date"
          className="border p-2"
          value={form.dueDate}
          onChange={handleChange}
        />

        <input
          name="color"
          className="border p-2"
          placeholder="Color"
          value={form.color}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded"
        >
          Save
        </button>
      </form>
    </div>
  )
}
