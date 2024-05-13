import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { columns } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

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
});
