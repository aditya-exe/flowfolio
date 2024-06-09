import ColumnView from "@/components/ColumnView";
import EditProjectName from "@/components/EditProjectName";
import Navbar from "@/components/Navbar";
import ProjectBreadcrumb from "@/components/ProjectBreadcrumb";
import ProjectOptions from "@/components/ProjectOptions";
import { getUserSession } from "@/server/auth";
import { api } from "@/trpc/server";

const ProjectPage = async ({ params }: { params: { projectId: string } }) => {
  const session = await getUserSession();

  const projectWithColumns = await api.project.getProjectWithColumns({
    projectId: params.projectId,
  });

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-start overflow-hidden bg-violet-950 text-fuchsia-500">
        <Navbar user={session?.user} />
        <div className="w-full p-8">
          <ProjectBreadcrumb
            projectId={params.projectId}
            projectName={projectWithColumns.name}
          />
          <div className="mt-4 flex items-center justify-between">
            <EditProjectName
              projectName={projectWithColumns.name}
              projectId={params.projectId}
            />
            <ProjectOptions />
          </div>
          {/* <div className="flex items-center ">
          // TODO: add users tab and filters
          </div> */}
          <ColumnView
            projectId={params.projectId}
            columns={projectWithColumns.columns}
          />
        </div>
      </div>
    </>
  );
};

export default ProjectPage;
