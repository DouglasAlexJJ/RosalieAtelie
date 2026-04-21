import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductImages, addProductImage, deleteProductImage } from "./products";
import { createOrder, getOrderById, getAllOrders, updateOrderStatus } from "./orders";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(() => getAllProducts()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getProductById(input.id)),
    
    getImages: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(({ input }) => getProductImages(input.productId)),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.string(),
        availableSizes: z.array(z.string()),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        
        const priceNum = parseFloat(input.price);
        if (isNaN(priceNum) || priceNum < 0) throw new Error("Invalid price");
        
        return createProduct({
          name: input.name,
          description: input.description,
          price: input.price,
          availableSizes: JSON.stringify(input.availableSizes),
          imageUrl: input.imageUrl,
          isActive: 1,
        });
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        availableSizes: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        
        const updateData: any = {};
        if (input.name) updateData.name = input.name;
        if (input.description) updateData.description = input.description;
        if (input.price) {
          const priceNum = parseFloat(input.price);
          if (isNaN(priceNum) || priceNum < 0) throw new Error("Invalid price");
          updateData.price = input.price;
        }
        if (input.availableSizes) updateData.availableSizes = JSON.stringify(input.availableSizes);
        if (input.imageUrl) updateData.imageUrl = input.imageUrl;
        
        return updateProduct(input.id, updateData);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        await deleteProduct(input.id);
        return { success: true };
      }),
    
    addImage: protectedProcedure
      .input(z.object({
        productId: z.number(),
        imageUrl: z.string(),
        imageKey: z.string().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        if (!input.imageKey) throw new Error("Image key is required");
        return addProductImage({
          productId: input.productId,
          imageUrl: input.imageUrl,
          imageKey: input.imageKey,
          order: input.order || 0,
        });
      }),
    
    deleteImage: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        await deleteProductImage(input.id);
        return { success: true };
      }),
  }),
  
  orders: router({
    create: publicProcedure
      .input(z.object({
        customerName: z.string().min(1),
        customerPhone: z.string().min(1),
        customerEmail: z.string().email().optional(),
        items: z.array(z.object({
          productId: z.number(),
          productName: z.string(),
          size: z.string(),
          quantity: z.number().min(1),
          price: z.string(),
        })),
        totalPrice: z.string(),
        shippingType: z.enum(["local", "national"]),
        shippingCost: z.string().optional(),
        zipCode: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const totalNum = parseFloat(input.totalPrice);
        if (isNaN(totalNum) || totalNum < 0) throw new Error("Invalid total price");
        
        return createOrder({
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerEmail: input.customerEmail,
          items: JSON.stringify(input.items),
          totalPrice: input.totalPrice,
          shippingType: input.shippingType,
          shippingCost: input.shippingCost || "0",
          zipCode: input.zipCode,
          status: "pending",
        });
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getOrderById(input.id)),
    
    list: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return getAllOrders();
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return updateOrderStatus(input.id, input.status);
      }),
  }),
});

export type AppRouter = typeof appRouter;
