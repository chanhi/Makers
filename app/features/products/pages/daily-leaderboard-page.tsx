import { data, isRouteErrorResponse, Link, useParams } from "react-router";
import type { Route } from "./+types/daily-leaderboard-page";
import { DateTime } from "luxon";
import { z } from "zod";
import { Hero } from "~/common/components/hero";
import { ProductCard } from "../components/product-card";
import ProductPagination from "~/common/components/product-pagination";
import { Button } from "~/common/components/ui/button";
import { getProductPagesByDateRange, getProductsByDateRange } from "../queries";
import { PAGE_SIZE } from "../constants";

const paramsSchema = z.object({
  year: z.coerce.number(),
  month: z.coerce.number(),
  day: z.coerce.number(),
});

export const meta: Route.MetaFunction = ({ params }) => {
  const date = DateTime.fromObject({
    year: Number(params.year),
    month: Number(params.month),
    day: Number(params.day),
  })
    .setZone("Asia/Seoul")
    .setLocale("ko");
  return [
    {
      title: `Daily Leaderboard - ${date.toLocaleString(DateTime.DATE_MED)} | wemake`,
    },
  ];
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data: parseData } = paramsSchema.safeParse(params);
  if (!success) {
    throw data(
      {
        error_code: "invalid_params",
        message: "invalid_params",
      },
      { status: 400 },
    );
  }
  const url = new URL(request.url);

  const date = DateTime.fromObject(parseData).setZone("Asia/Seoul");
  if (!date.isValid) {
    throw data(
      {
        error_code: "invalid_date",
        message: "The provided date is invalid.",
      },
      { status: 400 },
    );
  }
  const today = DateTime.now().setZone("Asia/Seoul").startOf("day");
  if (date > today) {
    throw data(
      {
        error_code: "date_in_future",
        message: "The provided date is in the future.",
      },
      { status: 400 },
    );
  }
  const products = await getProductsByDateRange({
    startDate: date.startOf("day"),
    endDate: date.endOf("day"),
    limit: PAGE_SIZE,
    page: Number(url.searchParams.get("page") ?? "1"),
  });
  const totalPages = await getProductPagesByDateRange({
    startDate: date.startOf("day"),
    endDate: date.endOf("day"),
  });
  return {
    products,
    totalPages,
    ...parseData,
  };
};

export default function DailyLeaderboardPage({
  loaderData,
}: Route.ComponentProps) {
  const urlDate = DateTime.fromObject({
    year: loaderData.year,
    month: loaderData.month,
    day: loaderData.day,
  });
  const previousDate = urlDate.minus({ days: 1 });
  const nextDate = urlDate.plus({ days: 1 });
  const isToday = urlDate.equals(DateTime.now().startOf("day"));
  return (
    <div className="space-y-10">
      <Hero
        title={`The best products of ${urlDate.toLocaleString(DateTime.DATE_MED)}`}
      />
      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" asChild>
          <Link
            to={`/products/leaderboards/daily/${previousDate.year}/${previousDate.month}/${previousDate.day}`}
          >
            &larr; {previousDate.toLocaleString(DateTime.DATE_SHORT)}
          </Link>
        </Button>
        {!isToday ? (
          <Button variant="secondary" asChild>
            <Link
              to={`/products/leaderboards/daily/${nextDate.year}/${nextDate.month}/${nextDate.day}`}
            >
              {nextDate.toLocaleString(DateTime.DATE_SHORT)} &rarr;
            </Link>
          </Button>
        ) : null}
      </div>
      <div className="space-y-5 w-full max-w-screen-md mx-auto">
        {loaderData.products.map((product) => (
          <ProductCard
            key={product.product_id}
            id={product.product_id.toString()}
            name={product.name}
            description={product.description}
            reviewsCount={product.reviews}
            viewsCount={product.views}
            votesCount={product.upvotes}
          />
        ))}
      </div>
      <ProductPagination totalPages={loaderData.totalPages} />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        {error.data.message} / {error.data.error_code}
      </div>
    );
  }
  if (error instanceof Error) {
    return (
      <div>
        <h1>{error.message}</h1>
      </div>
    );
  }
  return (
    <div>
      <h1>Unknown Error in Daily Leaderboard</h1>
    </div>
  );
}
