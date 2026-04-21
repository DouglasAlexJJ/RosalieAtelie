import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { ProductForm } from "@/components/ProductForm";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const { data: products, isLoading, refetch } = trpc.products.list.useQuery();
  const deleteProduct = trpc.products.delete.useMutation({
    onSuccess: () => refetch(),
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">Painel Administrativo</h1>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(!showForm);
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Produto
          </Button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="mb-12 bg-muted/30 p-8 rounded-lg">
            <ProductForm
              product={editingProduct}
              onSuccess={() => {
                setShowForm(false);
                setEditingProduct(null);
                refetch();
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          </div>
        )}

        {/* Products List */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-foreground">Produtos</h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="text-primary font-bold mb-4">
                      R$ {parseFloat(product.price as any).toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowForm(true);
                        }}
                        className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 rounded flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => {
                          if (confirm("Tem certeza que deseja deletar este produto?")) {
                            deleteProduct.mutate({ id: product.id });
                          }
                        }}
                        className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground py-2 rounded flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Deletar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              Nenhum produto cadastrado
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
