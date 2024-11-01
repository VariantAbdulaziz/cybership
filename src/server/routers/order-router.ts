import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router } from "../trpc";
import { privateProcedure } from "../procedures/private-procedure";
import { OrderFilterSchema, OrderSchema } from "@/lib/validations/order-schema";

export const orderRouter = router({
  createOrder: privateProcedure
    .input(OrderSchema)
    .mutation(async ({ input, ctx }) => {
      const { db, user } = ctx;

      try {
        const order = await db.order.create({
          data: {
            customerId: input.customerId,
            productId: input.productId,
            fulfillmentStatus: input.fulfillmentStatus,
            createdById: user.id,
          },
        });
        return {
          ...order,
          customerId: Number(order.customerId),
          productId: Number(order.productId),
          createdById: Number(order.createdById),
          Id: Number(order.Id),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating order",
        });
      }
    }),

  getOrderById: privateProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { db, user } = ctx;

      const order = await db.order.findFirst({
        where: {
          Id: input.id,
          createdById: user.id,
          isDeleted: false,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found or access denied",
        });
      }

      return {
        ...order,
        customerId: Number(order.customerId),
        productId: Number(order.productId),
        createdById: Number(order.createdById),
        Id: Number(order.Id),
      };
    }),

  getOrders: privateProcedure
    .input(OrderFilterSchema)
    .query(async ({ input, ctx }) => {
      const { db, user } = ctx;
      const { minOrderDate, maxOrderDate, page, limit } = input;
      const offset = (page - 1) * limit;

      const whereClause: any = {
        createdById: user.id,
        isDeleted: false,
      };

      if (minOrderDate) {
        const minDate = new Date(minOrderDate);
        whereClause.createdAt = { gte: minDate };
      }

      if (maxOrderDate) {
        const maxDate = new Date(maxOrderDate);
        whereClause.createdAt = {
          ...whereClause.createdAt,
          lte: maxDate,
        };
      }

      try {
        const orders = await db.order.findMany({
          where: whereClause,
          skip: offset,
          take: limit,
          include: {
            customer: true,
            product: true,
          },
        });

        const transformedOrders = orders.map((order) => ({
          ...order,
          Id: Number(order.Id),
          customerId: Number(order.customerId),
          productId: Number(order.productId),
          createdById: Number(order.createdById),
          customer: order.customer
            ? {
                ...order.customer,
                id: Number(order.customer.id),
                createdById: Number(order.customer.createdById),
              }
            : null,
          product: order.product
            ? {
                ...order.product,
                id: Number(order.product.id),
                createdById: Number(order.product.createdById),
              }
            : null,
        }));

        const totalOrders = await db.order.count({
          where: whereClause,
        });

        return {
          orders: transformedOrders,
          total: totalOrders,
          page,
          pageCount: Math.ceil(totalOrders / limit),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error retrieving orders",
        });
      }
    }),

  updateOrder: privateProcedure
    .input(OrderSchema.extend({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { db, user } = ctx;

      const existingOrder = await db.order.findFirst({
        where: {
          Id: input.id,
          createdById: user.id,
          isDeleted: false,
        },
      });

      if (!existingOrder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found or access denied",
        });
      }

      try {
        const updatedOrder = await db.order.update({
          where: { Id: input.id },
          data: {
            customerId: input.customerId,
            productId: input.productId,
            fulfillmentStatus: input.fulfillmentStatus,
          },
        });
        return {
          ...updatedOrder,
          customerId: Number(updatedOrder.customerId),
          productId: Number(updatedOrder.productId),
          createdById: Number(updatedOrder.createdById),
          Id: Number(updatedOrder.Id),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error updating order",
        });
      }
    }),

  deleteOrder: privateProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { db, user } = ctx;

      const existingOrder = await db.order.findFirst({
        where: {
          Id: input.id,
          createdById: user.id,
          isDeleted: false,
        },
      });

      if (!existingOrder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found or access denied",
        });
      }

      try {
        await db.order.update({
          where: { Id: input.id },
          data: { isDeleted: true },
        });
        return { success: true, message: "Order deleted successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting order",
        });
      }
    }),
});
