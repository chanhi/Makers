import { data, isRouteErrorResponse, Link, useParams } from "react-router";
import type { Route } from "./+types/monthly-leaderboard-page";
import { DateTime } from "luxon";
import { z } from "zod";
import { Hero } from "~/common/components/hero";
import { ProductCard } from "../components/product-card";
import ProductPagination from "~/common/components/product-pagination";
import { Button } from "~/common/components/ui/button";
import { getProductPagesByDateRange, getProductsByDateRange } from "../queries";

const paramsSchema = z.object({
  year: z.coerce.number(),
  month: z.coerce.number(),
});

export const meta: Route.MetaFunction = ({ params }) => {
  const date = DateTime.fromObject({
    year: Number(params.year),
    month: Number(params.month),
  })
    .setZone("Asia/Seoul")
    .setLocale("ko");
  return [
    {
      title: `Monthly Leaderboard - ${date.toLocaleString({
        month: "long",
        year: "2-digit",
      })} | wemake`,
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
  const date = DateTime.fromObject({
    year: parseData.year,
    month: parseData.month,
  }).setZone("Asia/Seoul");
  if (!date.isValid) {
    throw data(
      {
        error_code: "invalid_date",
        message: "The provided date is invalid.",
      },
      { status: 400 },
    );
  }
  const today = DateTime.now().setZone("Asia/Seoul").startOf("month");
  if (date > today) {
    throw data(
      {
        error_code: "date_in_future",
        message: "The provided date is in the future.",
      },
      { status: 400 },
    );
  }
  const url = new URL(request.url);
  const products = await getProductsByDateRange({
    startDate: date.startOf("month"),
    endDate: date.endOf("month"),
    limit: 15,
    page: Number(url.searchParams.get("page") || 1),
  });
  const totalPages = await getProductPagesByDateRange({
    startDate: date.startOf("month"),
    endDate: date.endOf("month"),
  });
  return {
    products,
    totalPages,
    ...parseData,
  };
};

export default function MonthlyLeaderboardPage({
  loaderData,
}: Route.ComponentProps) {
  const urlDate = DateTime.fromObject({
    year: loaderData.year,
    month: loaderData.month,
  });
  const previousMonth = urlDate.minus({ months: 1 });
  const nextMonth = urlDate.plus({ months: 1 });
  const isToday = urlDate.equals(DateTime.now().startOf("month"));
  return (
    <div className="space-y-10">
      <Hero
        title={`Best of ${urlDate.toLocaleString({
          month: "long",
          year: "2-digit",
        })}`}
      />
      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" asChild>
          <Link
            to={`/products/leaderboards/monthly/${previousMonth.year}/${previousMonth.month}`}
          >
            &larr; {previousMonth.toLocaleString(DateTime.DATE_SHORT)}
          </Link>
        </Button>
        {!isToday ? (
          <Button variant="secondary" asChild>
            <Link
              to={`/products/leaderboards/monthly/${nextMonth.year}/${nextMonth.month}`}
            >
              {nextMonth.toLocaleString(DateTime.DATE_SHORT)} &rarr;
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
