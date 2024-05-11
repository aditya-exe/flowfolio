// import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createFormSchema } from "@/lib/utils";
import { columns, projects } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

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
});
