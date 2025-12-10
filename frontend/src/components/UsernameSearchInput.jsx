import { useState, useEffect, useRef } from "react";
import { api } from "../utils/api";

export default function UsernameSearchInput({
  value,
  onChange,
  placeholder = "Enter username...",
  className = "",
  onSelect,
}) {
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function searchUsers(query) {
    if (!query || query.trim().length < 1) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const results = await api(
        `/api/users/search?username=${encodeURIComponent(query.trim())}`
      );

      let users = [];
      if (results.users && Array.isArray(results.users)) {
        users = results.users;
      } else if (Array.isArray(results)) {
        users = results;
      }

      setSearchResults(users);
      setShowDropdown(true);
    } catch (err) {
      console.error("Error searching users:", err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e) {
    const newValue = e.target.value;
    onChange(newValue);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (newValue.trim().length > 0) {
        searchUsers(newValue.trim());
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);
  }

  function handleSelectUser(user) {
    const username = typeof user === "string" ? user : user.username;
    onChange(username);
    setShowDropdown(false);
    if (onSelect) {
      onSelect(user);
    }
  }

  function handleFocus() {
    if (value.trim().length > 0 && searchResults.length > 0) {
      setShowDropdown(true);
    }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        autoComplete="off"
      />
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {loading ? (
            <div className="p-3 text-sm text-textSecondary text-center">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <ul className="py-1">
              {searchResults.map((user, index) => {
                const username =
                  typeof user === "string" ? user : user.username;
                const displayName =
                  typeof user === "string" ? user : user.username;
                return (
                  <li key={user.id || index}>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      onClick={() => handleSelectUser(user)}
                    >
                      {displayName}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : value.trim().length > 0 ? (
            <div className="p-3 text-sm text-textSecondary text-center">
              No matching users found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
