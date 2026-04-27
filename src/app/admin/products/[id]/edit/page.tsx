import { notFound } from "next/navigation";
import { getServerRepositories } from "@/server";
import { EditProductForm } from "./edit-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { products } = await getServerRepositories();
  const product = await products.getById(id);
  if (!product) notFound();

  return <EditProductForm product={product} />;
}
