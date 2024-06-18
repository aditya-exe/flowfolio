import Navbar from "@/components/Navbar";
import { getUserSession } from "@/server/auth";
import { api } from "@/trpc/server";
import WorkView from "@/components/WorkView";

const WorkPage = async ({ params }: { params: { userId: string } }) => {
  const user = await api.user.getUserByUserId({ userId: params.userId });
  const userIssues = await api.user.getAssignedIssues(params.userId);
  const session = await getUserSession();

  return (
    <div className="min-h-screen">
      <Navbar user={session?.user} />
      <WorkView user={user} issues={userIssues}/>
    </div>
  );
};

export default WorkPage;
