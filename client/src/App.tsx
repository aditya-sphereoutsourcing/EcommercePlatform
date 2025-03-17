import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { NavBar } from "@/components/nav-bar";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import CartPage from "@/pages/cart-page";
import ProductPage from "@/pages/product-page";
import CheckoutPage from "@/pages/checkout-page";
import AdminPage from "@/pages/admin-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <div>
      <NavBar />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/product/:id" component={ProductPage} />
        <ProtectedRoute path="/cart" component={CartPage} />
        <ProtectedRoute path="/checkout" component={CheckoutPage} />
        <ProtectedRoute path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;