import PageHeader from "../../components/PageHeader";
import ChoreCard from "../../components/ChoreCard";
import ChoreItem from "../../components/ChoreItem";

const chores = [
  {
    name: "Take out trash",
    assignedTo: "John",
    dueDate: "Tomorrow",
  },
  {
    name: "Wash dishes",
    assignedTo: "Emily",
    dueDate: "Today",
  },
];

export default function ChoresList() {
  return (
    <>
      <PageHeader title="Chores List" />

      <ChoreCard title="Chores">
        <div className="space-y-2">
          {chores.map((c, index) => (
            <ChoreItem key={index} chore={c} />
          ))}
        </div>
      </ChoreCard>
    </>
  );
}
