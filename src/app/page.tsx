import SignIn from "@/components/SignIn";
import { getUserSession } from "@/server/auth";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await getUserSession();

  if (session) {
    redirect("/projects");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-violet-950 text-fuchsia-500">
      <h1 className="mt-24 text-9xl font-extrabold tracking-tighter shadow-lg p-4 rounded-lg bg-violet-900">
        Flowfolio
      </h1>
      <SignIn />
    </div>
  );
};

export default Home;
