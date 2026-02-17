import { data, isRouteErrorResponse, Link, useParams } from "react-router";
import type { Route } from "./+types/yearly-leaderboard-page";
import { DateTime } from "luxon";
import { z } from "zod";
import { Hero } from "~/common/components/hero";
import { ProductCard } from "../components/product-card";
import ProductPagination from "~/common/components/product-pagination";
import { Button } from "~/common/components/ui/button";
import { getProductPagesByDateRange, getProductsByDateRange } from "../queries";

const paramsSchema = z.object({
  year: z.coerce.number(),
});

export const meta: Route.MetaFunction = ({ params }) => {
  const date = DateTime.fromObject({
    year: Number(params.year),
  })
    .setZone("Asia/Seoul")
    .setLocale("ko");
  return [
    {
      title: `Yearly Leaderboard - ${date.toLocaleString({
        year: "numeric",
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
  const today = DateTime.now().setZone("Asia/Seoul").startOf("year");
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
    startDate: date.startOf("year"),
    endDate: date.endOf("year"),
    limit: 15,
    page: Number(url.searchParams.get("page") || 1),
  });
  const totalPages = await getProductPagesByDateRange({
    startDate: date.startOf("year"),
    endDate: date.endOf("year"),
  });
  return {
    ...parseData,
    products,
    totalPages,
  };
};

export default function YearlyLeaderboardPage({
  loaderData,
}: Route.ComponentProps) {
  const urlDate = DateTime.fromObject({
    year: loaderData.year,
  });
  const previousYear = urlDate.minus({ years: 1 });
  const nextYear = urlDate.plus({ years: 1 });
  const isToday = urlDate.equals(DateTime.now().startOf("year"));
  return (
    <div className="space-y-10">
      <Hero
        title={`Best of ${urlDate.toLocaleString({
          year: "numeric",
        })}`}
      />
      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" asChild>
          <Link to={`/products/leaderboards/yearly/${previousYear.year}`}>
            &larr; {previousYear.toLocaleString(DateTime.DATE_SHORT)}
          </Link>
        </Button>
        {!isToday ? (
          <Button variant="secondary" asChild>
            <Link to={`/products/leaderboards/yearly/${nextYear.year}`}>
              {nextYear.toLocaleString(DateTime.DATE_SHORT)} &rarr;
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
