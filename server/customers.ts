import { getDb } from "./db";
import { customers } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export interface CreateCustomerInput {
  email: string;
  name: string;
  phone: string;
  zipCode?: string;
  address?: string;
  city?: string;
  state?: string;
  passwordHash?: string;
}

export async function createCustomer(input: CreateCustomerInput) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(customers).values({
    email: input.email,
    name: input.name,
    phone: input.phone,
    zipCode: input.zipCode,
    address: input.address,
    city: input.city,
    state: input.state,
    passwordHash: input.passwordHash,
  });

  return result;
}

export async function getCustomerByEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(customers)
    .where(eq(customers.email, email))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getCustomerById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateCustomer(id: number, updates: Partial<CreateCustomerInput>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = {};
  if (updates.name) updateData.name = updates.name;
  if (updates.email) updateData.email = updates.email;
  if (updates.phone) updateData.phone = updates.phone;
  if (updates.zipCode) updateData.zipCode = updates.zipCode;
  if (updates.address) updateData.address = updates.address;
  if (updates.city) updateData.city = updates.city;
  if (updates.state) updateData.state = updates.state;
  if (updates.passwordHash) updateData.passwordHash = updates.passwordHash;

  return db.update(customers).set(updateData).where(eq(customers.id, id));
}

export async function deleteCustomer(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(customers).where(eq(customers.id, id));
}
