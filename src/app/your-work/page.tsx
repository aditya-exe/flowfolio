import { getUserSession } from "@/server/auth";
import { redirect } from "next/navigation";

const YourWork = async () => {
  const session = await getUserSession();

  if (!session) {
    redirect("/");
  }

  return <></>;
};

export default YourWork;
