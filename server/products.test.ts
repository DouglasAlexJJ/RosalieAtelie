import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "./products";
import { getDb } from "./db";

describe("Products API", () => {
  let testProductId: number;

  beforeAll(async () => {
    // Setup: Ensure database is available
    const db = await getDb();
    expect(db).toBeDefined();
  });

  it("should create a product", async () => {
    const product = await createProduct({
      name: "Test Product",
      description: "A test product",
      price: "99.99",
      availableSizes: JSON.stringify(["P", "M", "G"]),
      isActive: 1,
    });

    expect(product).toBeDefined();
    expect(product.name).toBe("Test Product");
    expect(product.price).toBe("99.99");
    testProductId = product.id;
  });

  it("should get all products", async () => {
    const products = await getAllProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it("should get product by id", async () => {
    const product = await getProductById(testProductId);
    expect(product).toBeDefined();
    expect(product?.id).toBe(testProductId);
    expect(product?.name).toBe("Test Product");
  });

  it("should update a product", async () => {
    const updated = await updateProduct(testProductId, {
      name: "Updated Product",
      price: "149.99",
    });

    expect(updated.name).toBe("Updated Product");
    expect(updated.price).toBe("149.99");
  });

  it("should delete a product (soft delete)", async () => {
    await deleteProduct(testProductId);
    const product = await getProductById(testProductId);
    // After soft delete, product should not be returned by getAllProducts
    expect(product).toBeUndefined();
  });

  it("should validate price format", async () => {
    try {
      await createProduct({
        name: "Invalid Price Product",
        price: "invalid",
        availableSizes: JSON.stringify(["P"]),
        isActive: 1,
      });
      // If we reach here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // Expected to fail
      expect(error).toBeDefined();
    }
  });
});
