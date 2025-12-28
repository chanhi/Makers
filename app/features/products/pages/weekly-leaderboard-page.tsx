import { useParams } from "react-router";

export default function WeeklyLeaderboardPage() {
  const { year, week } = useParams();

  return (
    <div>
      <h1>Weekly Leaderboard for {year} Week {week}</h1>
      {/* Add your weekly leaderboard content here */}
    </div>
  );
}