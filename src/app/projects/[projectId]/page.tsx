import { getServerAuthSession } from "@/server/auth";
import Navbar from "@/components/Navbar";
import { api } from "@/trpc/server";
import ProjectBreadcrumb from "@/components/ProjectBreadcrumb";
import EditProjectName from "@/components/EditProjectName";
import ProjectOptions from "@/components/ProjectOptions";
import ColumnView from "@/components/ColumnView";

const ProjectPage = async ({ params }: { params: { projectId: string } }) => {
  const session = await getServerAuthSession();

  const projectWithColumns = await api.project.getProjectWithColumns({
    projectId: params.projectId,
  });

  

  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden items-center justify-start bg-violet-950 text-fuchsia-500">
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
          <ColumnView projectId={params.projectId} columns={projectWithColumns.columns} />
        </div> 
      </div>
    </>
  );
};

export default ProjectPage;
