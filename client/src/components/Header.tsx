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
          {/* Logo Atualizada */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/logo-header.png" 
              alt="Rosalie Ateliê" 
              className="h-14 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Loja
            </Link>
            <Link href="/#about" className="text-foreground hover:text-primary transition-colors font-medium">
              Nossa História
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <ShoppingBag className="w-6 h-6 text-primary" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-background">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-primary"
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
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-border pt-4 animate-in slide-in-from-top-2 transition-all">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-primary transition-colors py-2">
              Loja
            </Link>
            <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-primary transition-colors py-2">
              Nossa História
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}