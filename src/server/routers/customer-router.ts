import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router } from "../trpc";
import { privateProcedure } from "../procedures/private-procedure";
import {
  CustomerFilterSchema,
  CustomerSchema,
} from "@/lib/validations/customer-schema";

export const customerRouter = router({
  createCustomer: privateProcedure
    .input(CustomerSchema)
    .mutation(async ({ input, ctx }) => {
      const { db, user } = ctx;

      try {
        const customer = await db.customer.create({
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            city: input.city,
            country: input.country,
            createdById: user.id,
          },
        });
        return {
          ...customer,
          id: Number(customer.id),
          createdById: Number(customer.createdById),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating customer",
        });
        console.error(error);
      }
    }),

  getCustomerById: privateProcedure
    .input(z.object({ id: z.bigint() }))
    .query(async ({ input, ctx }) => {
      const { db, user } = ctx;

      const customer = await db.customer.findFirst({
        where: {
          id: input.id,
          createdById: user.id,
          isDeleted: false,
        },
      });

      if (!customer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Customer not found or access denied",
        });
      }

      return {
        ...customer,
        id: Number(customer.id),
        createdById: Number(customer.createdById),
      };
    }),

  getCustomers: privateProcedure
    .input(CustomerFilterSchema)
    .query(async ({ input, ctx }) => {
      const { db, user } = ctx;
      const { query, page, limit } = input;
      const offset = (page - 1) * limit;

      const whereClause: any = {
        createdById: user.id,
        isDeleted: false,
      };

      if (query) {
        whereClause.OR = [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
        ];
      }

      try {
        const customers = await db.customer.findMany({
          where: whereClause,
          skip: offset,
          take: limit,
        });

        const transformedCustomers = customers.map((customer) => ({
          ...customer,
          id: Number(customer.id),
          createdById: Number(customer.createdById),
        }));

        const totalCustomers = await db.customer.count({
          where: whereClause,
        });

        return {
          customers: transformedCustomers ?? [],
          total: totalCustomers,
          page,
          pageCount: Math.ceil(totalCustomers / limit),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error retrieving customers",
        });
      }
    }),

  updateCustomer: privateProcedure
    .input(CustomerSchema.extend({ id: z.bigint() }))
    .mutation(async ({ input, ctx }) => {
      const { db, user } = ctx;

      const existingCustomer = await db.customer.findFirst({
        where: {
          id: input.id,
          createdById: user.id,
          isDeleted: false,
        },
      });

      if (!existingCustomer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Customer not found or access denied",
        });
      }

      try {
        const updatedCustomer = await db.customer.update({
          where: { id: input.id },
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            city: input.city,
            country: input.country,
          },
        });
        return {
          ...updatedCustomer,
          id: Number(updatedCustomer.id),
          createdById: Number(updatedCustomer.createdById),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error updating customer",
        });
      }
    }),

  deleteCustomer: privateProcedure
    .input(z.object({ id: z.bigint() }))
    .mutation(async ({ input, ctx }) => {
      const { db, user } = ctx;

      const existingCustomer = await db.customer.findFirst({
        where: {
          id: input.id,
          createdById: user.id,
          isDeleted: false,
        },
      });

      if (!existingCustomer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Customer not found or access denied",
        });
      }

      try {
        await db.customer.update({
          where: { id: input.id },
          data: { isDeleted: true },
        });
        return { success: true, message: "Customer deleted successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting customer",
        });
      }
    }),
});
