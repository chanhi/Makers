import { Hero } from "~/common/components/hero";
import type { Route } from "./+types/submit-page";
import { Form } from "react-router";
import InputPair from "~/common/components/input-pair";
import SelectPair from "~/common/components/select-pair";
import React, { useState } from "react";
import { Button } from "~/common/components/ui/button";
import { Label } from "~/common/components/ui/label";
import { Input } from "~/common/components/ui/input";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Submit Product | wemake" },
    { name: "description", content: "Submit your product" },
  ];
};

export default function SubmitPage({ actionData }: Route.ComponentProps) {
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
      <Form className="grid grid-cols-2 gap-10 max-w-screen-lg mx-auto">
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
          <InputPair
            type="text"
            label="Tagline"
            description="60 characters or less"
            id="tagline"
            name="tagline"
            required
            placeholder="A concise description of your product"
          />
          <InputPair
            type="url"
            label="URL"
            description="The URL of your product"
            id="url"
            name="url"
            required
            placeholder="https://your-product.com"
          />
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
          <SelectPair
            name="category"
            label="Category"
            required
            description="The category of your product"
            placeholder="Select a category"
            options={[
              { value: "web", label: "Web" },
              { value: "mobile", label: "Mobile" },
              { value: "desktop", label: "Desktop" },
              { value: "other", label: "Other" },
            ]}
          />
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
