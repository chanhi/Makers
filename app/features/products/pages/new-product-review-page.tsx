import { Form, useParams } from "react-router";
import { Button } from "~/common/components/ui/button";
import type { Route } from "./+types/new-product-review-page";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Write Review | wemake" },
    { name: "description", content: "Write a review for a product" },
  ];
};

export default function NewProductReviewPage() {
  const { productId } = useParams();

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Write a review for {productId}</h1>
      <Form method="post" className="flex flex-col gap-4">
        <textarea
          name="review"
          className="textarea"
          placeholder="Your review"
        />
        <Button type="submit">Submit Review</Button>
      </Form>
    </div>
  );
}
