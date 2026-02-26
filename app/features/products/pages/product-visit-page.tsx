import { redirect } from "react-router";
import client from "~/supa-client";
import type { Route } from "./+types/product-visit-page";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { error, data } = await client
    .from("products")
    .select("url")
    .eq("product_id", Number(params.productId))
    .single();
  if (data) {
    await client.rpc("track_event", {
      event_type: "product_visit",
      event_data: {
        product_id: params.productId,
      },
    });
    return redirect(data.url);
  }
};
