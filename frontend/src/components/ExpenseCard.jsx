import { Link } from "react-router-dom";
import { MdReceipt, MdAttachMoney, MdPerson } from "react-icons/md";

export default function ExpenseCard({
  id,
  name,
  amount,
  paidBy,
  splits,
  groupId,
}) {
  if (!groupId || !id) {
    console.error("ExpenseCard missing groupId or id", { groupId, id });
    return (
      <div className="relative bg-white border rounded-lg shadow-sm p-4 flex">
        <div className="w-2 bg-red-500 rounded-l-lg absolute left-0 top-0 bottom-0"></div>
        <div className="ml-4 flex-1">
          <h3 className="font-semibold text-textPrimary">{name || "Invalid Expense"}</h3>
          <p className="text-sm text-red-500 mt-2">Missing groupId or id</p>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/groups/${groupId}/expenses/${id}`}>
      <div className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm p-5 flex hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer group">
        <div className="w-1.5 bg-gradient-to-b from-primary to-[#4F7C7A] rounded-l-xl absolute left-0 top-0 bottom-0"></div>

        <div className="ml-5 flex-1">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <MdReceipt className="text-primary text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-textPrimary text-lg mb-2">{name}</h3>

              <div className="flex items-center gap-2 text-sm text-textSecondary mb-2">
                <MdAttachMoney className="text-primary" />
                <span className="font-semibold text-textPrimary">
                  ${(amount / 100).toFixed(2)}
                </span>
                <span className="text-textSecondary">• split {splits?.length ?? 0} ways</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-textSecondary">
                <MdPerson className="text-primary" />
                <span>Paid by {paidBy?.username || "Unknown"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
