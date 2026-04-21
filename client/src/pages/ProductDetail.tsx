import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useRoute, Link } from "wouter";
import { useState } from "react";
import { Loader2, ChevronLeft } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";

const SIZES = ["P", "M", "G", "GG", "EXG", "G1", "G2", "Tamanho Único"];

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : null;
  
  const { data: product, isLoading } = trpc.products.getById.useQuery(
    { id: productId! },
    { enabled: !!productId }
  );
  
  const { data: images } = trpc.products.getImages.useQuery(
    { productId: productId! },
    { enabled: !!productId }
  );

  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");

  const availableSizes = product?.availableSizes 
    ? (typeof product.availableSizes === "string" 
        ? JSON.parse(product.availableSizes) 
        : product.availableSizes)
    : [];

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      alert("Por favor, selecione um tamanho");
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      price: parseFloat(product.price as any),
      size: selectedSize,
      quantity,
      imageUrl: mainImage || product.imageUrl || undefined,
    });

    setCartOpen(true);
  };

  if (!productId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Produto não encontrado</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Produto não encontrado</p>
        </div>
      </div>
    );
  }

  const allImages = images && images.length > 0 
    ? images.map(img => img.imageUrl)
    : (product.imageUrl ? [product.imageUrl] : []);

  const displayImage = mainImage || allImages[0] || "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </a>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {displayImage && (
              <div className="bg-muted rounded-2xl overflow-hidden aspect-square">
                <img
                  src={displayImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`rounded-lg overflow-hidden aspect-square border-2 transition-colors ${
                      mainImage === img
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-primary">
                R$ {parseFloat(product.price as any).toFixed(2)}
              </p>
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Tamanho</h3>
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map((size) => {
                  const isAvailable = availableSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`py-3 px-2 rounded-lg font-semibold transition-colors ${
                        !isAvailable
                          ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                          : selectedSize === size
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Quantidade</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-lg font-semibold text-lg"
            >
              Adicionar ao Carrinho
            </Button>

            {/* Info */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                ✓ Frete calculado no checkout
              </p>
              <p className="text-sm text-muted-foreground">
                ✓ Entrega rápida e segura
              </p>
              <p className="text-sm text-muted-foreground">
                ✓ Finalize seu pedido via WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
