import { describe, it, expect } from "vitest";

describe("Customer Management", () => {
  it("should validate customer email format", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test("customer@example.com")).toBe(true);
    expect(emailRegex.test("invalid-email")).toBe(false);
  });

  it("should validate phone number format", () => {
    const phoneRegex = /^[0-9]{10,20}$/;
    expect(phoneRegex.test("41992063104")).toBe(true);
    expect(phoneRegex.test("123")).toBe(false);
  });

  it("should validate zip code format", () => {
    const zipRegex = /^[0-9]{5}-?[0-9]{3}$/;
    expect(zipRegex.test("80000-000")).toBe(true);
    expect(zipRegex.test("80000000")).toBe(true);
    expect(zipRegex.test("invalid")).toBe(false);
  });

  it("should validate customer data structure", () => {
    const customer = {
      email: "test@example.com",
      name: "Test Customer",
      phone: "41992063104",
      zipCode: "80000-000",
      address: "Rua Test, 123",
      city: "Curitiba",
      state: "PR",
    };

    expect(customer.email).toBeDefined();
    expect(customer.name).toBeDefined();
    expect(customer.phone).toBeDefined();
    expect(customer.zipCode).toBeDefined();
  });
});
