/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type User } from "next-auth";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "./Icons";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Checkbox } from "./ui/checkbox";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";

type ProjectWithOwner = {
  id: string;
  name: string;
  owner: User;
};

export const projectColumns: ColumnDef<ProjectWithOwner>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <Icons.arrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original;

      return (
        <Link
          href={`/projects/${project.id}`}
          className={buttonVariants({ variant: "link" })}
        >
          {project.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "owner",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Owner
          <Icons.arrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original;

      return (
        <Link
          href={`/user/${project.owner.id}`}
          className="flex select-none items-center"
        >
          <Avatar>
            <AvatarImage
              src={project.owner.image ?? ""}
              alt={project.owner.name ?? "User image"}
            />
            <AvatarFallback>{project.owner.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className={buttonVariants({ variant: "link" })}>
            {project.owner.name}
          </p>
        </Link>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Icons.options className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(project.id)}
            >
              Copy Project ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/user/${project.owner.id}`}>View Owner</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/projects/${project.id}`}></Link>
              View Project details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <DeleteProject owner={project.owner.id} projectId={project.id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const DeleteProject = ({
  projectId,
  owner,
}: {
  projectId: string;
  owner: string;
}) => {
  const router = useRouter();
  const { mutate } = api.project.deleteById.useMutation({
    onSuccess: () => {
      toast({ description: "Project deleted successfully" });
      router.refresh();
    },
    onError: () => {
      toast({
        description: "Could not delete project",
        variant: "destructive",
      });
    },
  });

  return <div onClick={() => mutate({ projectId, owner })}>Delete Project</div>;
};
