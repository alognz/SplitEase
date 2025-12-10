export default function ActivityFeed({ activity = [] }) {
  if (activity.length === 0) {
    return <p className="text-textSecondary mt-2">No recent activity.</p>;
  }

  return (
    <div className="space-y-3 mt-4">
      {activity.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-3 bg-white border rounded-lg p-3 shadow-sm"
        >
          <div className="text-primary text-lg mt-0.5">•</div>

          <div className="flex-1">
            <p className="text-textPrimary font-medium">{item.message}</p>

            {item.time && (
              <p className="text-xs text-textSecondary mt-1">{item.time}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
