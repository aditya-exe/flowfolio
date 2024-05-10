"use client";

import { type User } from "next-auth";
import type { FC } from "react";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import ProjectsDropdown from "./ProjectsDropdown";
import YourWorkDropdown from "./YourWorkDropdown";

interface INavbar {
  user: User;
}

const Navbar: FC<INavbar> = ({ user }) => {
  return (
    <div className="flex w-full justify-between bg-violet-900 p-4 shadow-lg">
      <div className="flex items-center gap-x-5">
        <Link
          href="/"
          className="text-4xl font-extrabold tracking-tighter text-fuchsia-500"
        >
          Flowfolio
        </Link>
        <ProjectsDropdown />
        <YourWorkDropdown/>
      </div>
      <UserAvatar userName={user.name ?? ""} userImage={user.image ?? ""} />
    </div>
  );
};

export default Navbar;
