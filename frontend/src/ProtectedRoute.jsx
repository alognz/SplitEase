import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "./context/AppContext";

export default function ProtectedRoute({ children }) {
  const { token } = useContext(AppContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
