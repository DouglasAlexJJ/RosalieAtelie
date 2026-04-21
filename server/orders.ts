import { eq, desc } from "drizzle-orm";
import { orders, InsertOrder, Order } from "../drizzle/schema";
import { getDb } from "./db";

export async function createOrder(data: InsertOrder): Promise<Order> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(orders).values(data);
  const insertedId = result[0].insertId;
  
  const created = await db
    .select()
    .from(orders)
    .where(eq(orders.id, insertedId as number))
    .limit(1);
  
  if (!created[0]) throw new Error("Failed to create order");
  
  return created[0];
}

export async function getOrderById(id: number): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllOrders(): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));
  
  return result;
}

export async function updateOrderStatus(id: number, status: string): Promise<Order> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(orders).set({ status: status as any }).where(eq(orders.id, id));
  
  const updated = await getOrderById(id);
  if (!updated) throw new Error("Failed to update order");
  
  return updated;
}
