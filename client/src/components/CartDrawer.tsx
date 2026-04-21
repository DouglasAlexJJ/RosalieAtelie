import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingType, setShippingType] = useState<"local" | "national">("national");
  const [zipCode, setZipCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWhatsAppCheckout = async () => {
    if (!customerName || !customerPhone) {
      alert("Por favor, preencha nome e telefone");
      return;
    }

    const whatsappNumber = "41992063104";
    const itemsList = items
      .map(
        (item) =>
          `${item.productName} (${item.size}) - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`
      )
      .join("%0A");

    const message = `Olá! Gostaria de fazer um pedido:%0A%0A${itemsList}%0A%0ATotal: R$ ${total.toFixed(2)}%0A%0ANome: ${customerName}%0AEmail: ${customerEmail || "Não informado"}%0ATipo de Entrega: ${shippingType === "local" ? "Motoboy Local" : "Envio Nacional"}${zipCode ? `%0ACEP: ${zipCode}` : ""}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");

    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-lg z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Carrinho</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Seu carrinho está vazio
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-4 pb-4 border-b border-border"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-muted-foreground">Tamanho: {item.size}</p>
                    <p className="text-sm font-semibold text-primary">
                      R$ {item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        className="p-1 hover:bg-muted rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        className="p-1 hover:bg-muted rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        className="ml-auto p-1 hover:bg-destructive/10 rounded text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Form */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email (opcional)</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Entrega</label>
              <select
                value={shippingType}
                onChange={(e) => setShippingType(e.target.value as "local" | "national")}
                className="w-full px-3 py-2 border border-border rounded-lg"
              >
                <option value="national">Envio Nacional</option>
                <option value="local">Motoboy Local (Curitiba)</option>
              </select>
            </div>
            {shippingType === "local" && (
              <div>
                <label className="block text-sm font-medium mb-1">CEP</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="80000-000"
                />
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold pt-4 border-t border-border">
              <span>Total:</span>
              <span className="text-primary">R$ {total.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleWhatsAppCheckout}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Finalizar Pedido via WhatsApp"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
