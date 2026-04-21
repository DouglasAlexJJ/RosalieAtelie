import { describe, it, expect, beforeAll } from "vitest";
import { createOrder, getOrderById, getAllOrders, updateOrderStatus } from "./orders";
import { getDb } from "./db";

describe("Orders API", () => {
  let testOrderId: number;

  beforeAll(async () => {
    const db = await getDb();
    expect(db).toBeDefined();
  });

  it("should create an order", async () => {
    const order = await createOrder({
      customerName: "Test Customer",
      customerPhone: "11999999999",
      customerEmail: "test@example.com",
      items: JSON.stringify([
        {
          productId: 1,
          productName: "Test Product",
          size: "M",
          quantity: 2,
          price: "99.99",
        },
      ]),
      totalPrice: "199.98",
      shippingType: "national",
      shippingCost: "15.00",
      status: "pending",
    });

    expect(order).toBeDefined();
    expect(order.customerName).toBe("Test Customer");
    expect(order.status).toBe("pending");
    testOrderId = order.id;
  });

  it("should get order by id", async () => {
    const order = await getOrderById(testOrderId);
    expect(order).toBeDefined();
    expect(order?.id).toBe(testOrderId);
    expect(order?.customerName).toBe("Test Customer");
  });

  it("should get all orders", async () => {
    const orders = await getAllOrders();
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);
  });

  it("should update order status", async () => {
    const updated = await updateOrderStatus(testOrderId, "confirmed");
    expect(updated.status).toBe("confirmed");
  });

  it("should validate customer data", async () => {
    try {
      await createOrder({
        customerName: "",
        customerPhone: "",
        items: JSON.stringify([]),
        totalPrice: "0",
        shippingType: "national",
        status: "pending",
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
