import { useQuery } from "@tanstack/react-query";
import { CartItem, Product } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();

  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });

  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (isLoadingCart || isLoadingProducts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const productMap = new Map(products.map(p => [p.id, p]));
  const total = cartItems.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    return sum + (product ? Number(product.price) * item.quantity : 0);
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-8"
      >
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map(item => {
                const product = productMap.get(item.productId);
                if (!product) return null;
                return (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(Number(product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
              <div className="pt-4 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This is a demo application. No actual payment will be processed.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setLocation("/cart")}
                >
                  Back to Cart
                </Button>
                <Button className="flex-1" onClick={() => setLocation("/")}>
                  Complete Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
