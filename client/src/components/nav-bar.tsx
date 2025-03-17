import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ShoppingCart, LogOut, User } from "lucide-react";

export function NavBar() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold">E-Shop</a>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/cart">
                <a className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Cart
                </a>
              </Link>
              {user.isAdmin ? (
                <Link href="/admin">
                  <Button variant="outline">Admin</Button>
                </Link>
              ) : null}
              <Button 
                variant="ghost" 
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button>
                <User className="w-5 h-5 mr-2" />
                Login / Register
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
