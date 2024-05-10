import CreateForm from "@/components/CreateForm";
import CreateProject from "@/components/CreateProject";
import { Icons } from "@/components/Icons";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const CreatePage = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-violet-950 text-fuchsia-500">
      <div className="flex w-full items-center justify-between p-4">
        <div className="flex items-center">
          <Link
            href="/"
            className="size-4xl flex items-center rounded-full p-1 ease-in-out hover:bg-violet-600 hover:text-white"
          >
            <Icons.arrowLeft className="size-12" />
          </Link>
          <p className="ml-4 text-3xl font-bold -tracking-tighter">
            Create New Project
          </p>
        </div>
        <CreateProject/>
      </div>
      <CreateForm user={session.user} />
    </div>
  );
};

export default CreatePage;
