/**
 * Configuração de CEPs permitidos para entrega local (Motoboy)
 * Formato: CEP inicial - CEP final
 */
export const LOCAL_DELIVERY_RANGES = [
  { start: "80000000", end: "82799999" }, // Curitiba
];

export const SHIPPING_COSTS = {
  local: 15.0,
  national: 25.0,
};

export function isEligibleForLocalDelivery(zipCode: string): boolean {
  const cleanZipCode = zipCode.replace(/\D/g, "");
  
  if (cleanZipCode.length !== 8) {
    return false;
  }

  return LOCAL_DELIVERY_RANGES.some(
    (range) =>
      cleanZipCode >= range.start && cleanZipCode <= range.end
  );
}

export function getShippingCost(
  shippingType: "local" | "national",
  zipCode?: string
): number {
  if (shippingType === "local") {
    if (!zipCode || !isEligibleForLocalDelivery(zipCode)) {
      throw new Error("CEP não elegível para entrega local");
    }
    return SHIPPING_COSTS.local;
  }
  return SHIPPING_COSTS.national;
}

export function formatWhatsAppMessage(
  items: Array<{
    productName: string;
    size: string;
    quantity: number;
    price: number;
  }>,
  total: number,
  customerName: string,
  customerEmail: string | undefined,
  shippingType: "local" | "national",
  zipCode?: string
): string {
  const itemsList = items
    .map(
      (item) =>
        `${item.productName} (${item.size}) - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`
    )
    .join("%0A");

  const shippingLabel =
    shippingType === "local" ? "Motoboy Local (Curitiba)" : "Envio Nacional";

  const message = `Olá! Gostaria de fazer um pedido:%0A%0A${itemsList}%0A%0ATotal: R$ ${total.toFixed(2)}%0A%0ANome: ${customerName}%0AEmail: ${customerEmail || "Não informado"}%0ATipo de Entrega: ${shippingLabel}${zipCode ? `%0ACEP: ${zipCode}` : ""}`;

  return message;
}
