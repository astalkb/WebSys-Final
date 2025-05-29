import { getProducts } from "@/lib/actions/product";
import { InventoryList } from "@/components/admin/inventory-list";

export default async function InventoryPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
      </div>
      <InventoryList products={products} />
    </div>
  );
} 