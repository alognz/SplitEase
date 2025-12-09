import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../utils/api";

export default function Balances() {
  const { groupId } = useParams();
  const [balances, setBalances] = useState([]);

  const mockBalances = [
    { userId: "123", username: "You", balance: -3000 },
    { userId: "456", username: "Jintao", balance: 3000 }
  ];

  useEffect(() => {
    async function load() {
      try {
        const data = await api(
          `/api/groups/${groupId}/expenses/balances`
        );
        setBalances(data.balances);
      } catch {
        setBalances(mockBalances);
      }
    }
    load();
  }, [groupId]);

  return (
    <Layout>
      <div className="max-w-lg mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6">Balances</h1>

        <div className="space-y-4">
          {balances.map((b) => (
            <div
              key={b.userId}
              className="p-4 bg-white border rounded-lg shadow-sm"
            >
              <p className="font-medium">{b.username}</p>
              <p
                className={
                  b.balance < 0 ? "text-red-500" : "text-green-600"
                }
              >
                {b.balance < 0
                  ? `Owes $${(-b.balance / 100).toFixed(2)}`
                  : `Is owed $${(b.balance / 100).toFixed(2)}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}