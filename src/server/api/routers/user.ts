import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { columns, issues, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { type IssueWithColumn } from "@/lib/utils";

export const userRouter = createTRPCRouter({
  getUserByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      const dbUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!dbUser) {
        throw new TRPCError({
          message: "ERROR: Could not get user",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return dbUser;
    }),
  getAssignedIssues: protectedProcedure.query(async ({ ctx }) => {
    // const { userId } = input;
    const userId = ctx.session.user.id;

    const dbIssues = await ctx.db
      .select()
      .from(issues)
      .where(eq(issues.assignedTo, userId));

    const promises = dbIssues.map(async (issue) => {
      const dbColumn = await ctx.db.query.columns.findFirst({
        where: eq(columns.id, issue.columnId),
      });

      if (!dbColumn) {
        throw new TRPCError({
          message: "ERROR: Cannot retrieve column for issue",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return {
        ...issue,
        column: dbColumn,
      };
    });

    const dbIssuesWithColumn = (await Promise.allSettled(promises))
      .filter(
        (r): r is PromiseFulfilledResult<IssueWithColumn> =>
          r.status === "fulfilled",
      )
      .map((r) => r.value);

    return dbIssuesWithColumn;
  }),
});
