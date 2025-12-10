import { createContext, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const [currentGroupId, setCurrentGroupId] = useState(
    localStorage.getItem("groupId") || ""
  );

  const saveToken = (t) => {
    if (t) {
      setToken(t);
      localStorage.setItem("token", t);
    } else {
      setToken("");
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    setToken("");
    setCurrentGroupId("");
    localStorage.removeItem("token");
    localStorage.removeItem("groupId");
    localStorage.removeItem("groups");
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("dashboard_") || key.startsWith("cache_")) {
        localStorage.removeItem(key);
      }
    });
  };

  const saveGroupId = (id) => {
    setCurrentGroupId(id);
    localStorage.setItem("groupId", id);
  };

  return (
    <AppContext.Provider
      value={{ token, saveToken, logout, currentGroupId, saveGroupId }}
    >
      {children}
    </AppContext.Provider>
  );
}
