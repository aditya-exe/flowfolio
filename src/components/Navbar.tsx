"use client";

import { type User } from "next-auth";
import type { FC } from "react";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import ProjectsDropdown from "./ProjectsDropdown";
import YourWorkDropdown from "./YourWorkDropdown";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

interface INavbar {
  user: User | undefined;
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
        <YourWorkDropdown />
      </div>
      {user ? (
        <UserAvatar userName={user.name ?? ""} userImage={user.image ?? ""} />
      ) : (
        <Button onClick={() => signIn("discord")}>Sign In</Button>
      )}
    </div>
  );
};

export default Navbar;
