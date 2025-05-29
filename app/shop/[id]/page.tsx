import { notFound } from "next/navigation";
import { getProductById } from "@/lib/actions/product";
import { ProductDetail } from "@/components/shop/product-detail";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} />
    </div>
  );
} 