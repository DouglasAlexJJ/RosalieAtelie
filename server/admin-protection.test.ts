import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createRegularUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Admin Panel Protection", () => {
  it("should allow admin to delete products", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // This should not throw
    expect(async () => {
      await caller.products.delete({ id: 999 });
    }).not.toThrow();
  });

  it("should prevent regular users from deleting products", async () => {
    const ctx = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.products.delete({ id: 999 });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Unauthorized");
    }
  });

  it("should prevent regular users from creating products", async () => {
    const ctx = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.products.create({
        name: "Test",
        price: "100",
        availableSizes: ["P"],
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Unauthorized");
    }
  });

  it("should allow admin to create products", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // This should not throw
    expect(async () => {
      await caller.products.create({
        name: "Test Product",
        price: "100.00",
        availableSizes: ["P", "M"],
      });
    }).not.toThrow();
  });

  it("should prevent regular users from listing orders", async () => {
    const ctx = createRegularUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.orders.list();
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Unauthorized");
    }
  });

  it("should allow admin to list orders", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // This should not throw
    expect(async () => {
      await caller.orders.list();
    }).not.toThrow();
  });
});
