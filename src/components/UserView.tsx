"use client";

import { type User } from "next-auth";
import type { FC } from "react";
import UserHeader from "./UserHeader";

interface IUserView {
  user: User;
  canEdit: boolean;
}

const UserView: FC<IUserView> = ({ user, canEdit }) => {
  return (
    <div className="bg=green=200 flex h-full w-full">
      <UserHeader headerImage={user.headerImage} />
    </div>
  );
};

export default UserView;
