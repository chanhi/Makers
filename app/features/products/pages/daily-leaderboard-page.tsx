import { useParams } from "react-router";

export default function DailyLeaderboardPage() {
  const { year, month, day } = useParams();

  return (
    <div>
      <h1>Daily Leaderboard for {year}-{month}-{day}</h1>
      {/* Add your daily leaderboard content here */}
    </div>
  );
}