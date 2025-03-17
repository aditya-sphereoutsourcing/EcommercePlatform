import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Product } from "@shared/schema";
import { ProductCard } from "@/components/product-card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductPage() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const product = products.find(p => p.id === Number(productId));
  const relatedProducts = products
    .filter(p => p.id !== Number(productId))
    .slice(0, 3);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-8"
      >
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-bold text-primary mt-2">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Stock</h2>
            <p className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
              {product.stock > 0 ? `${product.stock} units available` : "Out of stock"}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
