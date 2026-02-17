import { z } from "zod";
import { data, Outlet } from "react-router";
import type { Route } from "./+types/leaderboard-layout";

const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { success, data: parseData } = searchParamsSchema.safeParse(
    Object.fromEntries(url.searchParams),
  );
  if (!success) {
    throw data(
      {
        error_code: "invalid_query",
        message: "Invalid query parameters.",
      },
      { status: 400 },
    );
  }
};

export default function LeaderboardLayout() {
  return <Outlet />;
}
