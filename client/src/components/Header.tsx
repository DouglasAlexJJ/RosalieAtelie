import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export function Header() {
  const { itemCount } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/manus-storage/1000406270_c3e5c29a.webp" 
              alt="Rosalie Ateliê" 
              className="h-12 w-12 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Loja
            </Link>
            <Link href="/#about" className="text-foreground hover:text-primary transition-colors">
              Nossa História
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <ShoppingBag className="w-6 h-6 text-primary" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Loja
            </Link>
            <Link href="/#about" className="text-foreground hover:text-primary transition-colors">
              Nossa História
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
