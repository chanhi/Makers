import { useParams } from "react-router";

export default function CategoryPage() {
  const { category } = useParams();

  return (
    <div>
      <h1>Category: {category}</h1>
      {/* Add your category content here */}
    </div>
  );
}