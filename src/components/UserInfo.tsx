"use client";

import type { FC } from "react";
import { type User } from "next-auth";
import UserImage from "./UserImage";

interface IUserInfo {
  user: User;
}

const UserInfo: FC<IUserInfo> = ({ user }) => {
  return (
    <div className="container mt-3 px-32">
      <div className="flex items-center">
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
        <div className="bg-green-200"></div>
      </div>
    </div>
  );
};

export default UserInfo;
