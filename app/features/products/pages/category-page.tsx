import { useParams } from "react-router";
import { ProductCard } from "../components/product-card";
import { Hero } from "~/common/components/hero";
import ProductPagination from "~/common/components/product-pagination";
import type { Route } from "./+types/category-page";
import z from "zod";
import {
  getCategory,
  getCategoryPages,
  getProductsByCategory,
} from "../queries";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Developer Tools | wemake" },
    { name: "description", content: "Browse Developer Tools" },
  ];
};

const paramsSchema = z.object({
  category: z.coerce.number(),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || "1");
  const { data, success } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Response("Invalid category ID", { status: 400 });
  }
  const category = await getCategory(data.category);
  const products = await getProductsByCategory({
    categoryId: data.category,
    page,
  });
  const totalPages = await getCategoryPages(data.category);
  return { category, products, totalPages };
};

export default function CategoryPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-10">
      <Hero
        title={loaderData.category.name}
        subtitle={loaderData.category.description}
      />
      <div className="space-y-5 w-full max-w-screen-md mx-auto">
        {loaderData.products.map((product) => (
          <ProductCard
            key={product.product_id}
            id={product.product_id}
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
