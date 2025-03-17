import { CartItem, Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

type CartItemProps = {
  item: CartItem;
  product: Product;
};

export function CartItemCard({ item, product }: CartItemProps) {
  const updateQuantityMutation = useMutation({
    mutationFn: async (quantity: number) => {
      const res = await apiRequest("PATCH", `/api/cart/${item.id}`, { quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/cart/${item.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    }
  });

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-20 h-20 object-cover rounded"
        />
        
        <div className="flex-1">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateQuantityMutation.mutate(item.quantity - 1)}
            disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <Input
            type="number"
            value={item.quantity}
            className="w-16 text-center"
            min={1}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value > 0) {
                updateQuantityMutation.mutate(value);
              }
            }}
          />
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateQuantityMutation.mutate(item.quantity + 1)}
            disabled={updateQuantityMutation.isPending}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeItemMutation.mutate()}
          disabled={removeItemMutation.isPending}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
