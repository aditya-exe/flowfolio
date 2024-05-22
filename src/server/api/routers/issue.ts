import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { issues } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const issueRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        columnId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, columnId } = input;
      const userId = ctx.session.user.id;
      
      const createdIssue = (
        await ctx.db
          .insert(issues)
          .values({
            name,
            columnId,
            assignedTo: userId,
          })
          .returning()
      )[0];

      if (!createdIssue) {
        throw new TRPCError({
          message: "Cannot create new Issue",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return createdIssue;
    }),
  renameIssue: protectedProcedure
    .input(
      z.object({
        newIssueName: z.string(),
        issueId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { newIssueName, issueId } = input;

      const updatedIssue = (
        await ctx.db
          .update(issues)
          .set({ name: newIssueName })
          .where(eq(issues.id, issueId))
          .returning()
      )[0];

      if (!updatedIssue) {
        throw new TRPCError({
          message: "ERROR: Could not update issue name",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return true;
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        issueId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { issueId } = input;

      const deletedIssue = (
        await ctx.db.delete(issues).where(eq(issues.id, issueId)).returning()
      )[0];

      if (!deletedIssue) {
        throw new TRPCError({
          message: "ERROR: Could not delete issue",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return true;
    }),
});
