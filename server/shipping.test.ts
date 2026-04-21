import { describe, it, expect } from "vitest";
import {
  isEligibleForLocalDelivery,
  getShippingCost,
  formatWhatsAppMessage,
  LOCAL_DELIVERY_RANGES,
} from "./shipping";

describe("Shipping Logic", () => {
  describe("isEligibleForLocalDelivery", () => {
    it("should return true for valid Curitiba zip codes", () => {
      expect(isEligibleForLocalDelivery("80000000")).toBe(true);
      expect(isEligibleForLocalDelivery("80010000")).toBe(true);
      expect(isEligibleForLocalDelivery("82799999")).toBe(true);
    });

    it("should return false for zip codes outside Curitiba", () => {
      expect(isEligibleForLocalDelivery("01000000")).toBe(false); // São Paulo
      expect(isEligibleForLocalDelivery("30000000")).toBe(false); // Belo Horizonte
    });

    it("should return false for invalid zip codes", () => {
      expect(isEligibleForLocalDelivery("invalid")).toBe(false);
      expect(isEligibleForLocalDelivery("123")).toBe(false);
      expect(isEligibleForLocalDelivery("")).toBe(false);
    });

    it("should handle formatted zip codes", () => {
      expect(isEligibleForLocalDelivery("80000-000")).toBe(true);
      expect(isEligibleForLocalDelivery("80.010-000")).toBe(true);
    });
  });

  describe("getShippingCost", () => {
    it("should return local shipping cost for valid Curitiba zip", () => {
      const cost = getShippingCost("local", "80000000");
      expect(cost).toBe(15.0);
    });

    it("should return national shipping cost", () => {
      const cost = getShippingCost("national");
      expect(cost).toBe(25.0);
    });

    it("should throw error for invalid local zip code", () => {
      expect(() => getShippingCost("local", "01000000")).toThrow(
        "CEP não elegível para entrega local"
      );
    });

    it("should throw error for local shipping without zip code", () => {
      expect(() => getShippingCost("local")).toThrow(
        "CEP não elegível para entrega local"
      );
    });
  });

  describe("formatWhatsAppMessage", () => {
    const mockItems = [
      {
        productName: "Camiseta Boho",
        size: "M",
        quantity: 2,
        price: 89.99,
      },
      {
        productName: "Calça Rústica",
        size: "G",
        quantity: 1,
        price: 149.99,
      },
    ];

    it("should format message for local delivery", () => {
      const message = formatWhatsAppMessage(
        mockItems,
        329.97,
        "Maria Silva",
        "maria@example.com",
        "local",
        "80000000"
      );

      expect(message).toContain("Camiseta Boho");
      expect(message).toContain("Calça Rústica");
      expect(message).toContain("R$ 329.97");
      expect(message).toContain("Maria Silva");
      expect(message).toContain("maria@example.com");
      expect(message).toContain("Motoboy Local (Curitiba)");
      expect(message).toContain("80000000");
    });

    it("should format message for national delivery", () => {
      const message = formatWhatsAppMessage(
        mockItems,
        329.97,
        "João Santos",
        undefined,
        "national"
      );

      expect(message).toContain("João Santos");
      expect(message).toContain("Não informado");
      expect(message).toContain("Envio Nacional");
      expect(message).not.toContain("CEP");
    });

    it("should encode URL properly", () => {
      const message = formatWhatsAppMessage(
        mockItems,
        329.97,
        "Test User",
        "test@example.com",
        "national"
      );

      // Should contain URL encoded spaces and special characters
      expect(message).toContain("%0A");
      expect(message).toContain("Olá!");
    });
  });
});
