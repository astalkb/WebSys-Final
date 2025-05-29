import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Carousel } from "@/components/ui/carousel";
import { addToCart } from "@/lib/actions/cart";
import { Product } from "@prisma/client";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          {JSON.parse(product.images as string).map((image: string, index: number) => (
            <div key={index} className="relative aspect-square">
              <img
                src={image}
                alt={`${product.name} - Image ${index + 1}`}
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
        </div>

        <div className="text-2xl font-bold">${product.price}</div>

        <p className="text-muted-foreground">{product.description}</p>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <form action={addToCart}>
              <input type="hidden" name="productId" value={product.id} />
              <Button size="lg" className="w-full" type="submit">
                Add to Cart
              </Button>
            </form>
            <Button size="lg" variant="outline">
              Buy Now
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {product.stock} units in stock
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="description" className="w-full">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="space-y-2">
            <p>{product.description}</p>
          </TabsContent>
          <TabsContent value="details">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Category:</span> {product.categoryId}
              </div>
              <div>
                <span className="font-medium">Stock:</span> {product.stock}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 