import { Button } from "~/common/components/ui/button";
import type { Route } from "./+types/post-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Post - ProductHunt Clone" }];
};

export default function PostPage() {
  return <div></div>;
}
