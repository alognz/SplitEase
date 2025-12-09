import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppProvider from "./context/AppContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Groups from "./pages/Groups";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Profile from "./pages/Profile";
import CreateGroup from "./pages/CreateGroup";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import ExpenseDetails from "./pages/ExpenseDetails";
import GroupDetails from "./pages/GroupDetails";
import Balances from "./pages/Balances";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/new" element={<CreateGroup />} />
          <Route path="/groups/:groupId" element={<GroupDetails />} />
          <Route path="/groups/:groupId/balances" element={<Balances />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/groups/:groupId/expenses/new" element={<AddExpense />} />
          <Route path="/groups/:groupId/expenses/:expenseId" element={<ExpenseDetails />} />
          <Route path="/groups/:groupId/expenses/:expenseId/edit" element={<EditExpense />} />
          <Route path="/chores" element={<div>Chores coming soon</div>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;