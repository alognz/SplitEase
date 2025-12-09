import { useState, useEffect, useRef } from "react";
import { api } from "../utils/api";

export default function GroupSelector({ selectedGroup, onChange }) {
  const [groups, setGroups] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function loadGroups() {
      try {
        const cached = JSON.parse(localStorage.getItem("groups") || "null");

        let list;

        if (cached) {
          list = cached;
        } else {
          const data = await api("/api/groups");
          list = data.groups;
          localStorage.setItem("groups", JSON.stringify(list));
        }

        setGroups(list);
      } catch {
        const mock = [
          { id: "1", name: "My Apartment" },
          { id: "2", name: "CS 409 Roommates" },
        ];
        setGroups(mock);
        localStorage.setItem("groups", JSON.stringify(mock));
      }
    }

    loadGroups();
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedName =
    groups.find((g) => g.id === selectedGroup)?.name || "Select Group";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="
          h-11 px-4 flex items-center gap-2
          rounded-lg border border-primary 
          text-primary bg-transparent hover:bg-primary hover:text-white
          font-medium transition
        "
      >
        {selectedName}
        <span className="text-xs opacity-70">▼</span>
      </button>

      {open && (
        <div
          className="
            absolute mt-1 w-48 bg-white border border-gray-200 
            rounded-lg shadow-md z-50 py-1
          "
        >
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                localStorage.setItem("selectedGroup", g.id);
                onChange(g.id);
                setOpen(false);
              }}
              className="
                w-full text-left px-4 py-2 text-sm 
                hover:bg-gray-100 text-textPrimary
              "
            >
              {g.name}
            </button>
          ))}

          <div className="border-t my-1" />

          <button
            onClick={() => {
              onChange("new");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-gray-100"
          >
            + Create New Group
          </button>
        </div>
      )}
    </div>
  );
}
