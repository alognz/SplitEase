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
        console.error(err)
      }
    }
    fetchChore()
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // TODO: API PUT here
    navigate("/chores/list")
  }

  const inputClass =
    "w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Chore</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-gray-700 font-semibold">
            Chore Name
          </label>
          <input
            name="name"
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
            Color
          </label>
          <input
            name="color"
            className={inputClass}
            value={form.color}
            onChange={handleChange}
          />
        </div>

        <button className="w-full bg-green-600 hover:bg-green-700 transition text-white py-2 rounded-lg font-semibold">
          Save
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
        console.error(err)
      }
    }
    fetchChore()
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // TODO: API PUT here
    navigate("/chores/list")
  }

  const inputClass =
    "w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Chore</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-gray-700 font-semibold">
            Chore Name
          </label>
          <input
            name="name"
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
            Color
          </label>
          <input
            name="color"
            className={inputClass}
            value={form.color}
            onChange={handleChange}
          />
        </div>

        <button className="w-full bg-green-600 hover:bg-green-700 transition text-white py-2 rounded-lg font-semibold">
          Save
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
