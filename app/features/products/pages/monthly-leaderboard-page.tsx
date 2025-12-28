import { useParams } from "react-router";

export default function MonthlyLeaderboardPage() {
  const { year, month } = useParams();

  return (
    <div>
      <h1>Monthly Leaderboard for {year}-{month}</h1>
      {/* Add your monthly leaderboard content here */}
    </div>
  );
}