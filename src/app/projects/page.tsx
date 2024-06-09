import AllProjectList from "@/components/AllProjectList";
import Navbar from "@/components/Navbar";
import { projectColumns } from "@/components/project-columns";
import { buttonVariants } from "@/components/ui/button";
import { getUserSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await getUserSession();

  if (!session) {
    redirect("/");
  }

  const dbProjects = await api.project.getAllByUserId();

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-violet-950 text-fuchsia-500">
      <Navbar user={session.user} />
      <div className="flex w-full items-center justify-between p-4">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <Link
          href="/create"
          className={buttonVariants({
            variant: "default",
          })}
        >
          Create Project
        </Link>
      </div>
      <div className="w-full p-6">
        <AllProjectList columns={projectColumns} data={dbProjects} />
      </div>
    </div>
  );
};

export default Dashboard;
