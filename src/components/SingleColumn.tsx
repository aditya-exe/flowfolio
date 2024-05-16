"use client";

import { type Column } from "@/server/db/schema";
import { useState, type FC } from "react";
import { Icons } from "./Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";

interface ISingleColumn {
  column: Column;
}

const SingleColumn: FC<ISingleColumn> = ({ column }) => {
  const router = useRouter();
  const { mutate: deleteColumn } = api.column.deleteById.useMutation({
    onSuccess: () => {
      toast({ description: "Column deleted successfully :)" });
      router.refresh();
    },
    onError: () => {
      toast({ description: "Could not delete column :/" });
    },
  });
  const [createNewIssue, setCreateNewIssue] = useState(false);
  const [issueName, setIssueName] = useState("");
  const { mutate: createIssue } = api.item.create.useMutation({
    onSuccess: () => {
      setCreateNewIssue(false);
      toast({ description: "Issue created successfully :)" });
      router.refresh();
    },
    onError: () => {
      toast({ description: "Could not create Issue :/" });
    },
  });

  return (
    <div className="group flex h-[400px] w-[250px] shrink-0  grow-0 flex-col items-start rounded-md bg-violet-200 p-4">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-md font-bold text-fuchsia-600">{column.name}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Icons.options />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => deleteColumn({ columnId: column.id })}
                className="cursor-pointer hover:underline"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        onClick={() => setCreateNewIssue(true)}
        className={cn("hidden", {
          "mt-6 hidden w-full cursor-pointer items-center gap-x-2 rounded-md p-2 ease-in-out hover:bg-violet-100 group-hover:flex":
            !createNewIssue,
        })}
      >
        <Icons.plus />
        Create Issue
      </div>
      {createNewIssue ? (
        <Textarea
          placeholder="What needs to be done?"
          rows={6}
          className="mt-2 w-full rounded-md bg-violet-50"
          onChange={(e) => setIssueName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createIssue({
                name: issueName,
                columnId: column.id,
              });
            }
          }}
        />
      ) : null}
    </div>
  );
};

export default SingleColumn;
