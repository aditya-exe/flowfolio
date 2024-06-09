import { createFormSchema, type ColumnWithIssues } from "@/lib/utils";
import { columns, issues, projects, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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

      await ctx.db.insert(columns).values(columnsWithProjectId).returning();

      return {
        projectId: project.projectId,
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
  getProjectWithColumns: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { projectId } = input;

      const dbProject = await ctx.db.query.projects.findFirst({
        where: eq(projects.id, projectId),
      });

      if (!dbProject) {
        throw new TRPCError({
          message: "ERROR: Cannot retrieve project",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const dbColumns = await ctx.db
        .select()
        .from(columns)
        .where(eq(columns.projectId, projectId));

      const promises = dbColumns.map(async (column) => {
        const dbIssues = await ctx.db
          .select()
          .from(issues)
          .where(eq(issues.columnId, column.id));

        return {
          ...column,
          issues: dbIssues,
        };
      });

      const dbColumnsWithItems = (await Promise.allSettled(promises))
        .filter(
          (r): r is PromiseFulfilledResult<ColumnWithIssues> =>
            r.status === "fulfilled",
        )
        .map((r) => r.value);

      return {
        ...dbProject,
        columns: dbColumnsWithItems,
      };
    }),
  renameProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        newProjectName: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { newProjectName, projectId } = input;

      const updatedProject = (
        await ctx.db
          .update(projects)
          .set({ name: newProjectName })
          .where(eq(projects.id, projectId))
          .returning()
      )[0];

      if (!updatedProject) {
        throw new TRPCError({
          message: "Cannot update project",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return true;
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        owner: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, owner } = input;
      const userId = ctx.session.user.id;

      if (userId !== owner) {
        throw new TRPCError({ message: "Wrong user id", code: "UNAUTHORIZED" });
      }

      await ctx.db.delete(projects).where(eq(projects.id, projectId));
    }),
});
/* 
{
  id,
  name,
  owner,
  columns: {
    id,
    name,
    items[]
  }[]
}
*/
