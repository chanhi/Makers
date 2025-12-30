import { DateTime } from "luxon";
import { data, redirect } from "react-router";
import type { Route } from "./+types/leaderboards-redirection-page";

export function loader({ params }: Route.LoaderArgs) {
  const { period } = params;
  let url: string;
  const today = DateTime.now().setZone("Asia/Seoul");
  switch (period) {
    case "daily":
      url = `/products/leaderboards/daily/${today.year}/${today.month}/${today.day}`;
      break;
    case "weekly":
      url = `/products/leaderboards/weekly/${today.weekYear}/${today.weekNumber}`;
      break;
    case "monthly":
      url = `/products/leaderboards/monthly/${today.toFormat("yyyy/MM")}`;
      break;
    case "yearly":
      url = `/products/leaderboards/yearly/${today.toFormat("yyyy")}`;
      break;
    default:
      return data(null, { status: 400 });
  }
  return redirect(url);
}
