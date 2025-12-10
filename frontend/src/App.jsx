import { Routes, Route } from "react-router-dom";
import AppProvider from "./context/AppContext";
import ProtectedRoute from "./ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import CreateGroup from "./pages/CreateGroup";
import GroupDetails from "./pages/GroupDetails";
import Balances from "./pages/Balances";
import Expenses from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import ExpenseDetails from "./pages/ExpenseDetails";
import Profile from "./pages/Profile";
import AddChore from "./pages/chores/AddChore";
import ChoresList from "./pages/chores/ChoresList";
import EditChore from "./pages/chores/EditChore";
import ChoresCalendar from "./pages/chores/ChoresCalendar";
import ChoreDetails from "./pages/chores/ChoreDetails";

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <Groups />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/new"
          element={
            <ProtectedRoute>
              <CreateGroup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId"
          element={
            <ProtectedRoute>
              <GroupDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId/balances"
          element={
            <ProtectedRoute>
              <Balances />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId/expenses/new"
          element={
            <ProtectedRoute>
              <AddExpense />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId/expenses/:expenseId"
          element={
            <ProtectedRoute>
              <ExpenseDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId/expenses/:expenseId/edit"
          element={
            <ProtectedRoute>
              <EditExpense />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/:groupId/chores/new"
          element={
            <ProtectedRoute>
              <AddChore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chores"
          element={
            <ProtectedRoute>
              <ChoresList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId/chores/calendar"
          element={
            <ProtectedRoute>
              <ChoresCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId/chores/:choreId/edit"
          element={
            <ProtectedRoute>
              <EditChore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId/chores/:choreId"
          element={
            <ProtectedRoute>
              <ChoreDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppProvider>
  );
}

export default App;
