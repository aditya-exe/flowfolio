import Navbar from "@/components/Navbar";
import UserView from "@/components/UserView";
import { getUserSession } from "@/server/auth";
import { api } from "@/trpc/server";

const UserPage = async ({ params }: { params: { userId: string } }) => {
  const session = await getUserSession();
  const dbUser = await api.user.getUserByUserId({ userId: params.userId });

  return (
    <div className="flex h-screen flex-col items-center justify-start overflow-hidden bg-violet-950 text-fuchsia-500">
      <Navbar user={session?.user} />
      <UserView user={dbUser} canEdit={dbUser.id === session?.user.id} />
    </div>
  );
};

export default UserPage;
