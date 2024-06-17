"use client";

import { type User } from "next-auth";
import type { FC } from "react";
import UserHeaderImage from "./UserHeaderImage";
import UserInfo from "./UserInfo";

interface IUserView {
  user: User;
  canEdit: boolean;
}

const UserView: FC<IUserView> = ({ user }) => {
  return (
    <div className="flex h-full w-full flex-col">
      <UserHeaderImage headerImage={user.headerImage} userId={user.id} />
      <UserInfo user={user} />
    </div>
  );
};

export default UserView;
