import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { columns } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const columnRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        columnName: z.string().min(1),
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { columnName, projectId } = input;

      const column = (
        await ctx.db
          .insert(columns)
          .values({
            name: columnName,
            projectId,
          })
          .returning()
      )[0];

      if (!column) {
        throw new TRPCError({
          message: "Could not create column :/",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return column;
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { columnId } = input;

      const deletedColumn = await ctx.db
        .delete(columns)
        .where(eq(columns.id, columnId));

      return deletedColumn.length === 1;
    }),
  renameColumn: protectedProcedure
    .input(
      z.object({
        columnId: z.string(),
        newColumnName: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { columnId, newColumnName } = input;

      const updatedColumn = (
        await ctx.db
          .update(columns)
          .set({
            name: newColumnName,
          })
          .where(eq(columns.id, columnId))
          .returning()
      )[0];

      if (!updatedColumn) {
        throw new TRPCError({
          message: "Cannot update column",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return true;
    }),
});
