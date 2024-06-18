"use client";

import type { FC } from "react";
import { type User } from "next-auth";
import UserImage from "./UserImage";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { api } from "@/trpc/react";
import { Icons } from "./Icons";

interface IUserInfo {
  user: User;
}

const UserInfo: FC<IUserInfo> = ({ user }) => {
  const { data, isLoading } = api.user.getAssignedIssues.useQuery(user.id);

  return (
    <div className="container mt-3 flex px-32">
      <div className="flex w-full items-start">
        <div className="flex flex-col items-center gap-y-4 ">
          <UserImage
            userImage={user.image}
            userId={user.id}
            userName={user.name ?? ""}
          />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
          </div>
        </div>
        <div className="flex w-full flex-col p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bol text-xl">Worked on</h2>
            <Link
              href={`/user/${user.id}/work`}
              className={buttonVariants({ variant: "link" })}
            >
              View all
            </Link>
          </div>
          <div>
            {isLoading ? (
              <>
                <Icons.loading className="size-5 animate-spin" />
              </>
            ) : (
              <>
                {data ? (
                  <>
                    {data.map((d) => (
                      // TODO add issue link
                      <div
                        key={d.id}
                        className="border-1 flex w-full flex-col items-start justify-between gap-y-1 rounded-md border-purple-400 bg-purple-900 px-3 py-2"
                      >
                        <p>{d.name}</p>
                        <p className="text-xs">{d.column.name}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="w-full bg-red-200">Nothing</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
