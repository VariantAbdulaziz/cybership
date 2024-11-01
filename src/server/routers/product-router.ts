import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router } from "../trpc";
import { privateProcedure } from "../procedures/private-procedure";
import {
  ProductFilterSchema,
  ProductSchema,
} from "@/lib/validations/product-schema";

export const productRouter = router({
  createProduct: privateProcedure
    .input(ProductSchema)
    .mutation(async ({ input, ctx }) => {
      const { db, user } = ctx;

      try {
        const product = await db.product.create({
          data: {
            name: input.name,
            details: input.details,
            image: input.image,
            createdById: user.id,
          },
        });
        return {
          ...product,
          id: product.id.toString(),
          createdById: product.createdById.toString(),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating product",
        });
      }
    }),

  getProductById: privateProcedure
    .input(z.object({ id: z.bigint() }))
    .query(async ({ input, ctx }) => {
      const { db, user } = ctx;

      const product = await db.product.findFirst({
        where: {
          id: input.id,
          createdById: user.id,
          isDeleted: false,
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found or access denied",
        });
      }

      return {
        ...product,
        id: product.id.toString(),
        createdById: product.createdById.toString(),
      };
    }),

  getProducts: privateProcedure
    .input(ProductFilterSchema)
    .query(async ({ input, ctx }) => {
      const { db, user } = ctx;
      const { name, startDate, endDate, page, limit } = input;

      const offset = (page - 1) * limit;

      const whereClause: any = {
        createdById: user.id,
        isDeleted: false,
      };

      if (name) {
        whereClause.name = { contains: name, mode: "insensitive" };
      }

      if (startDate && endDate) {
        whereClause.createdAt = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      } else if (startDate) {
        whereClause.createdAt = { gte: new Date(startDate) };
      } else if (endDate) {
        whereClause.createdAt = { lte: new Date(endDate) };
      }

      try {
        const products = await db.product.findMany({});

        const transformedProducts = products.map((product) => ({
          ...product,
          id: product.id.toString(),
          createdById: product.createdById.toString(),
        }));

        const totalProducts = await db.product.count({
          where: whereClause,
        });

        return {
          products: transformedProducts,
          total: totalProducts,
          page,
          pageCount: Math.ceil(totalProducts / limit),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error retrieving products",
        });
      }
    }),

  updateProduct: privateProcedure
    .input(ProductSchema.extend({ id: z.bigint() }))
    .mutation(async ({ input, ctx }) => {
      const { db, user } = ctx;

      const existingProduct = await db.product.findFirst({
        where: {
          id: input.id,
          createdById: user.id,
          isDeleted: false,
        },
      });

      if (!existingProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found or access denied",
        });
      }

      try {
        const updatedProduct = await db.product.update({
          where: { id: input.id },
          data: {
            name: input.name,
            details: input.details,
            image: input.image,
          },
        });
        return {
          ...updatedProduct,
          id: updatedProduct.id.toString(),
          createdById: updatedProduct.createdById.toString(),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error updating product",
        });
      }
    }),

  deleteProduct: privateProcedure
    .input(z.object({ id: z.bigint() }))
    .mutation(async ({ input, ctx }) => {
      const { db, user } = ctx;

      const existingProduct = await db.product.findFirst({
        where: {
          id: input.id,
          createdById: user.id,
          isDeleted: false,
        },
      });

      if (!existingProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found or access denied",
        });
      }

      try {
        await db.product.update({
          where: { id: input.id },
          data: { isDeleted: true },
        });
        return { success: true, message: "Product deleted successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting product",
        });
      }
    }),
});
