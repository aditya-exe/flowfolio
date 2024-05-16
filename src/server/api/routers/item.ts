import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { items } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

export const itemRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        columnId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, columnId } = input;

      const createdItem = (
        await ctx.db
          .insert(items)
          .values({
            name,
            columnId,
          })
          .returning()
      )[0];

      if (!createdItem) {
        throw new TRPCError({
          message: "Cannot create new Issue",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return createdItem;
    }),
});
