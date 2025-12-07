import PageHeader from "../../components/PageHeader";

export default function EditChore() {
  return (
    <>
      <PageHeader title="Edit Chore" />

      <div className="p-6 space-y-4 bg-white shadow-md rounded-md w-full max-w-md">
        <input
          className="border p-2 w-full rounded"
          placeholder="Chore Name"
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Assigned To"
        />

        <input
          className="border p-2 w-full rounded"
          placeholder="Due Date"
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Save Changes
        </button>
      </div>
    </>
  );
}
