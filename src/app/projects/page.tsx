import Navbar from "@/components/Navbar";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-violet-950 text-fuchsia-500">
      <Navbar user={session.user} />
    </div>
  );
};

export default Dashboard;
