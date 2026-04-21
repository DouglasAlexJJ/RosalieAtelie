import { describe, it, expect } from "vitest";

describe("Firebase Configuration", () => {
  it("should have Firebase environment variables configured", () => {
    expect(process.env.VITE_FIREBASE_PROJECT_ID).toBeDefined();
    expect(process.env.VITE_FIREBASE_API_KEY).toBeDefined();
    expect(process.env.VITE_FIREBASE_STORAGE_BUCKET).toBeDefined();
    expect(process.env.FIREBASE_ADMIN_SDK_KEY).toBeDefined();
  });

  it("should have valid Firebase project ID format", () => {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
    expect(projectId).toMatch(/^[a-z0-9-]+$/);
  });

  it("should have valid Firebase storage bucket format", () => {
    const bucket = process.env.VITE_FIREBASE_STORAGE_BUCKET;
    expect(bucket).toMatch(/(\.appspot\.com|\.firebasestorage\.app)$/);
  });
});
