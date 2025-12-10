import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../utils/api";
import Button from "../components/Button";
import UsernameSearchInput from "../components/UsernameSearchInput";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([""]);
  const [error, setError] = useState("");
  const nav = useNavigate();

  function handleAddMember() {
    setMembers([...members, ""]);
  }

  function handleRemoveMember(index) {
    setMembers(members.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!groupName.trim()) {
      setError("Group name cannot be empty.");
      return;
    }

    const memberUsernames = members
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    try {
      const data = await api("/api/groups", "POST", {
        name: groupName,
        memberUsernames: memberUsernames,
      });

      localStorage.removeItem("groups");

      if (data?.id) {
        localStorage.setItem("newGroupId", data.id);
      }

      nav("/");
    } catch (err) {
      console.error(err);
      setError(
        err?.error || err.message || "Failed to create group. Please try again."
      );
    }
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10 font-sans">
        <h1 className="text-3xl font-bold text-textPrimary mb-6">
          Create Group
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <p className="text-xl font-semibold text-textPrimary mb-1">
            My group name is ...
          </p>

          <input
            className="w-full h-11 border border-gray-300 px-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter group name..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <hr className="my-4" />

          <h2 className="text-lg font-semibold text-textPrimary">
            Group Members
          </h2>
          <p className="text-sm text-textSecondary mb-3">
            Add friends by username (optional)
          </p>

          {members.map((value, i) => (
            <div key={i} className="flex items-center mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-textSecondary mb-1">
                  Username
                </p>
                <UsernameSearchInput
                  value={value}
                  onChange={(newValue) => {
                    const newMembers = [...members];
                    newMembers[i] = newValue;
                    setMembers(newMembers);
                  }}
                  placeholder="Enter username..."
                  className="w-full h-11 border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="button"
                className="ml-3 text-textSecondary hover:text-red-500 text-lg"
                onClick={() => handleRemoveMember(i)}
              >
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            className="text-primary text-sm font-medium hover:underline mb-6"
            onClick={handleAddMember}
          >
            + Add more people
          </button>

          <div className="flex">
            <Button type="submit" width="w-36">
              Create Group
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
