"use client";

// import type { FC } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Icons } from "./Icons";
import Link from "next/link";

const ProjectsDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant={"link"}
          className="text-md text-fuchsia-500 active:bg-violet-900"
        >
          Projects
          <Icons.arrowDown className="text-sm" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="dark w-56 rounded-none">
        <DropdownMenuLabel className="mb-4">Projects</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link href="/projects">View all projects</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/create">Create new project</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectsDropdown;
