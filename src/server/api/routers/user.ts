import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

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
});
