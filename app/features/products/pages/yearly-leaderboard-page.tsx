import { useParams } from "react-router";

export default function YearlyLeaderboardPage() {
  const { year } = useParams();

  return (
    <div>
      <h1>Yearly Leaderboard for {year}</h1>
      {/* Add your yearly leaderboard content here */}
    </div>
  );
}