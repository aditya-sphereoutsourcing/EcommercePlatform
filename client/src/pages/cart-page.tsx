import { CartItem, Product } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CartItemCard } from "@/components/cart-item";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function CartPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });

  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/orders", {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!"
      });
      setLocation("/");
    }
  });

  const productMap = new Map(products.map(p => [p.id, p]));
  const total = cartItems.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    return sum + (product ? Number(product.price) * item.quantity : 0);
  }, 0);

  if (isLoadingCart || isLoadingProducts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Button onClick={() => setLocation("/")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="grid gap-4 mb-6">
        {cartItems.map((item) => {
          const product = productMap.get(item.productId);
          if (!product) return null;
          return <CartItemCard key={item.id} item={item} product={product} />;
        })}
      </div>

      <div className="flex flex-col items-end gap-4">
        <div className="text-xl font-bold">
          Total: ${total.toFixed(2)}
        </div>
        <Button
          size="lg"
          onClick={() => checkoutMutation.mutate()}
          disabled={checkoutMutation.isPending}
        >
          {checkoutMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Checkout
        </Button>
      </div>
    </div>
  );
}
