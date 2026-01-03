import { Link, useParams } from "react-router";
import type { Route } from "./+types/product-reviews-page";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Product Reviews | wemake" },
    { name: "description", content: "Reviews for a product" },
  ];
};

export default function ProductReviewsPage() {
  const { productId } = useParams();

  return (
    <div className="space-y-6 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold">Reviews for {productId}</h1>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border rounded">
            <div className="font-semibold">User {i + 1}</div>
            <div className="text-sm text-muted-foreground">Great product!</div>
          </div>
        ))}
      </div>
      <Link to={`/products/${productId}/reviews/new`} className="text-primary">
        Write a review
      </Link>
    </div>
  );
}
