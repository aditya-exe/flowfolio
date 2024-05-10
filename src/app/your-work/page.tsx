import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

const YourWork = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  return <></>;
};

export default YourWork;
