import { eq, and, desc } from "drizzle-orm";
import { products, productImages, InsertProduct, Product, ProductImage, InsertProductImage } from "../drizzle/schema";
import { getDb } from "./db";

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(products)
    .where(eq(products.isActive, 1))
    .orderBy(desc(products.createdAt));
  
  return result;
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.isActive, 1)))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(data: InsertProduct): Promise<Product> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(products).values(data);
  const insertedId = result[0].insertId;
  
  const created = await getProductById(insertedId as number);
  if (!created) throw new Error("Failed to create product");
  
  return created;
}

export async function updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(products).set(data).where(eq(products.id, id));
  
  const updated = await getProductById(id);
  if (!updated) throw new Error("Failed to update product");
  
  return updated;
}

export async function deleteProduct(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Soft delete - mark as inactive
  await db.update(products).set({ isActive: 0 }).where(eq(products.id, id));
}

export async function getProductImages(productId: number): Promise<ProductImage[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(productImages.order);
  
  return result;
}

export async function addProductImage(data: InsertProductImage): Promise<ProductImage> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(productImages).values(data);
  const insertedId = result[0].insertId;
  
  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.id, insertedId as number))
    .limit(1);
  
  if (!images[0]) throw new Error("Failed to add product image");
  
  return images[0];
}

export async function deleteProductImage(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(productImages).where(eq(productImages.id, id));
}
