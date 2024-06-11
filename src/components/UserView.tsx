"use client";

import { type User } from "next-auth";
import type { FC } from "react";
import UserHeader from "./UserHeader";

interface IUserView {
  user: User;
  canEdit: boolean;
}

const UserView: FC<IUserView> = ({ user }) => {
  return (
    <div className="bg=green=200 flex h-full w-full">
      <UserHeader headerImage={user.headerImage} userId={user.id} />
    </div>
  );
};

export default UserView;
