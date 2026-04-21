import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { Header } from "@/components/Header";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center flex flex-col items-center">
          {/* Logo */}
          <img 
            src="/manus-storage/1000406270_c3e5c29a.webp" 
            alt="Rosalie Ateliê" 
            className="h-48 w-48 md:h-64 md:w-64 object-contain mb-8"
          />
          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto font-serif">
            Roupas com estilo rústico e boho chic, feitas com amor e atenção aos detalhes
          </p>
          <Button
            onClick={() => setCartOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold"
          >
            Ver Coleção
          </Button>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
            Novidades
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Confira nossas últimas criações
          </p>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 6).map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group cursor-pointer block hover:opacity-90 transition-opacity"
                >
                  <div className="bg-muted rounded-2xl overflow-hidden mb-4 aspect-square">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="text-muted-foreground">Sem imagem</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-primary font-bold text-lg">
                    R$ {parseFloat(product.price as any).toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              Nenhum produto disponível no momento
            </p>
          )}
        </div>
      </section>

      {/* Our Story Section */}
      <section id="about" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
              Nossa História
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Rosalie Ateliê nasceu da paixão por criar peças únicas que combinam elegância rústica com o charme boho chic. Cada peça é cuidadosamente confeccionada com atenção aos detalhes e qualidade premium.
              </p>
              <p>
                Acreditamos que a moda deve ser acessível, sustentável e cheia de personalidade. Por isso, trabalhamos com materiais de qualidade e processos éticos para entregar roupas que você se sinta bem usando.
              </p>
              <p>
                Nosso objetivo é criar uma comunidade de mulheres que se sentem confiantes, bonitas e autênticas em cada peça Rosalie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2024 Rosalie Ateliê. Todos os direitos reservados.</p>
          <p className="text-sm opacity-75">
            Feito com amor e dedicação para você
          </p>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
