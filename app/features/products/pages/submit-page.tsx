import { Hero } from "~/common/components/hero";
import type { Route } from "./+types/submit-page";
import { Form, redirect } from "react-router";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import React, { useState } from "react";
import { Button } from "~/common/components/ui/button";
import { Label } from "~/common/components/ui/label";
import { Input } from "~/common/components/ui/input";
import z from "zod";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUser } from "~/features/users/queries";
import { createProduct } from "../mutations";
import { getCategories } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Submit Product | wemake" },
    { name: "description", content: "Submit your product" },
  ];
};

const formSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  url: z.string().min(1),
  description: z.string().min(1),
  howItWorks: z.string().min(1),
  category: z.coerce.number(),
  icon: z.instanceof(File).refine((file) => {
    return file.size <= 2097152 && file.type.startsWith("image/");
  }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUser(client);
  const formData = await request.formData();
  const { data, success, error } = formSchema.safeParse(
    Object.fromEntries(formData),
  );
  if (!success) {
    return { formErrors: error.flatten().fieldErrors };
  }
  const { icon, ...rest } = data;
  const { data: uploadData, error: uploadError } = await client.storage
    .from("icons")
    .upload(`${userId}/${Date.now()}`, icon, {
      contentType: icon.type,
      upsert: false,
    });
  if (uploadError) {
    return { formErrors: { icon: ["Failed to upload icon"] } };
  }
  const {
    data: { publicUrl },
  } = await client.storage.from("icons").getPublicUrl(uploadData.path);
  const productId = await createProduct(client, {
    name: rest.name,
    tagline: rest.tagline,
    description: rest.description,
    howItWorks: rest.howItWorks,
    url: rest.url,
    iconUrl: publicUrl,
    categoryId: rest.category,
    userId,
  });
  return redirect(`/products/${productId}`);
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUser(client);
  const categories = await getCategories(client);
  return { categories };
};

export default function SubmitPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [icon, setIcon] = useState<string | null>(null);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setIcon(URL.createObjectURL(file));
    }
  };
  return (
    <div>
      <Hero
        title="Submit Your Product"
        subtitle="Submit your product to wemake."
      />
      <Form
        method="post"
        encType="multipart/form-data"
        className="grid grid-cols-2 gap-10 max-w-screen-lg mx-auto"
      >
        <div className="space-y-5">
          <InputPair
            type="text"
            label="Name"
            description="The name of your product"
            id="name"
            name="name"
            required
            placeholder="Your product's name"
          />
          {actionData &&
            "formErrors" in actionData &&
            actionData?.formErrors?.name && (
              <p className="text-red-500">{actionData.formErrors.name}</p>
            )}
          <InputPair
            type="text"
            label="Tagline"
            description="60 characters or less"
            id="tagline"
            name="tagline"
            required
            placeholder="A concise description of your product"
          />
          {actionData &&
            "formErrors" in actionData &&
            actionData?.formErrors?.tagline && (
              <p className="text-red-500">{actionData.formErrors.tagline}</p>
            )}
          <InputPair
            type="url"
            label="URL"
            description="The URL of your product"
            id="url"
            name="url"
            required
            placeholder="https://your-product.com"
          />
          {actionData &&
            "formErrors" in actionData &&
            actionData?.formErrors?.url && (
              <p className="text-red-500">{actionData.formErrors.url}</p>
            )}
          <InputPair
            textarea
            type="description"
            label="Description"
            description="A detailed description of your product"
            id="description"
            name="description"
            required
            placeholder="Describe your product in detail"
          />
          {actionData &&
            "formErrors" in actionData &&
            actionData?.formErrors?.description && (
              <p className="text-red-500">
                {actionData.formErrors.description}
              </p>
            )}
          <InputPair
            textarea
            label="How it works"
            description="A detailed description of how your product howItWorks"
            id="howItWorks"
            name="howItWorks"
            required
            type="text"
            placeholder="A detailed description of how your product works"
          />
          {actionData &&
            "formErrors" in actionData &&
            actionData?.formErrors?.howItWorks && (
              <p className="text-red-500">{actionData.formErrors.howItWorks}</p>
            )}
          <SelectPair
            name="category"
            label="Category"
            required
            description="The category of your product"
            placeholder="Select a category"
            options={loaderData.categories.map((category) => ({
              label: category.name,
              value: category.category_id.toString(),
            }))}
          />
          {actionData &&
            "formErrors" in actionData &&
            actionData?.formErrors?.category && (
              <p className="text-red-500">{actionData.formErrors.category}</p>
            )}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="size-40 rounded-xl shadow-xl overflow-hidden">
            {icon ? (
              <img src={icon} className="object-cover w-full h-full" />
            ) : null}
          </div>
          <Label className="flex flex-col items-start gap-1">
            Icon
            <small className="text-muted-foreground">
              Upload a square icon for your product
            </small>
          </Label>
          <Input
            type="file"
            className="w-1/2"
            onChange={onChange}
            required
            name="icon"
          />
          {actionData &&
            "formErrors" in actionData &&
            actionData?.formErrors?.icon && (
              <p className="text-red-500">{actionData.formErrors.icon}</p>
            )}
          <div className="flex flex-col text-xs">
            <span className="text-muted-foreground">
              Recommended size: 128x128 pixels
            </span>
            <span className="text-muted-foreground">
              Accepted formats: PNG, JPG, JPEG
            </span>
            <span className="text-muted-foreground">Max file size: 1MB</span>
          </div>
        </div>
      </Form>
    </div>
  );
}
