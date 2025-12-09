import { createContext, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const [currentGroupId, setCurrentGroupId] = useState(
    localStorage.getItem("groupId") || ""
  );

  const saveToken = (t) => {
    setToken(t);
    localStorage.setItem("token", t);
  };

  const saveGroupId = (id) => {
    setCurrentGroupId(id);
    localStorage.setItem("groupId", id);
  };

  return (
    <AppContext.Provider
      value={{ token, saveToken, currentGroupId, saveGroupId }}
    >
      {children}
    </AppContext.Provider>
  );
}
