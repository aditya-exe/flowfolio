"use client";

import type { FC } from "react";
import { type Issue } from "@/server/db/schema";
import EditIssueName from "./EditIssueName";
import { Icons } from "./Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { api } from "@/trpc/react";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

interface IItemView {
  issue: Issue;
}

const ItemView: FC<IItemView> = ({ issue }) => {
  const router = useRouter();
  const { mutate: deleteIssue } = api.issue.deleteById.useMutation({
    onSuccess: () => {
      toast({ description: "Issue deleted successfully :)" });
      router.refresh();
    },
    onError: () => {
      toast({ description: "Could not issue column :/" });
    },
  });
  const { data: assignedUser } = api.user.getUserByUserId.useQuery({
    userId: issue.assignedTo,
  });

  return (
    <div className="flex w-full flex-col items-center justify-between rounded-md bg-violet-100 px-1 py-2">
      <div className="flex w-full items-center justify-between">
        <EditIssueName issueId={issue.id} issueName={issue.name} />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Icons.options className="mr-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => deleteIssue({ issueId: issue.id })}
                className="cursor-pointer hover:underline"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Link
        href={`/user/${assignedUser?.id}`}
        className="mt-2 flex w-full items-center justify-end"
      >
        <Avatar>
          <AvatarImage
            src={assignedUser?.image ?? ""}
            alt={assignedUser?.name ?? "User image"}
            className="size-10"
          />
          <AvatarFallback>{assignedUser?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
};

export default ItemView;
