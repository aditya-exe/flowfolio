// import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createFormSchema } from "@/lib/utils";
import { columns, projects, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { projectName, owner } = input;

      const project = (
        await ctx.db
          .insert(projects)
          .values({
            name: projectName,
            owner,
          })
          .returning({
            projectId: projects.id,
          })
      )[0];

      if (!project) {
        throw new TRPCError({
          message: "ERROR: Could not create project",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const columnsWithProjectId = input.columns.map((c) => ({
        ...c,
        projectId: project.projectId,
      }));

      await ctx.db.insert(columns).values(columnsWithProjectId);

      return {
        message: "OK: project created",
      };
    }),
  getAllByUserId: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const dbProjects = (
      await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.owner, userId))
        .innerJoin(users, eq(users.id, projects.owner))
    ).map(({ project, user }) => ({ ...project, owner: user }));

    return dbProjects;
  }),
});
