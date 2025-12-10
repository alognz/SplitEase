import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../utils/api";

export default function Balances() {
  const { groupId } = useParams();
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function load() {
      try {
        const data = await api(`/api/groups/${groupId}/expenses/balances`);
        setBalances(data.balances || []);
        setError("");
      } catch (err) {
        console.error("Failed to load balances:", err);
        setError("Failed to load balances. Please try again.");
        setBalances([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [groupId]);

  return (
    <Layout>
      <div className="font-sans max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Balances</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {loading ? (
          <p className="text-textSecondary text-center mt-8">
            Loading balances...
          </p>
        ) : balances.length === 0 && !error ? (
          <p className="text-textSecondary">No balances to display.</p>
        ) : (
          <div className="space-y-4">
            {balances.map((b) => (
              <div
                key={b.userId}
                className="p-4 bg-white border rounded-lg shadow-sm"
              >
                <p className="font-medium">{b.username}</p>
                <p
                  className={b.balance < 0 ? "text-red-500" : "text-green-600"}
                >
                  {b.balance < 0
                    ? `Owes $${(-b.balance / 100).toFixed(2)}`
                    : `Is owed $${(b.balance / 100).toFixed(2)}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
