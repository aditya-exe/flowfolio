"use client";

import { Icons } from "./Icons";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

const YourWorkDropdown = () => {
  const { data: myIssues, isLoading } = api.user.getAssignedIssues.useQuery();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant={"link"}
          className="text-md text-fuchsia-500 active:bg-violet-900"
        >
          Your Work
          <Icons.arrowDown className="text-sm" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="dark w-fit rounded-none">
        <DropdownMenuLabel className="mb-4">Your Work</DropdownMenuLabel>
        <Tabs defaultValue="assigned-to-me" className="w-fit p-2">
          <TabsList className="flex w-full items-center justify-around">
            <TabsTrigger value="assigned-to-me">Assigned to me</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          <TabsContent value="assigned-to-me">
            {isLoading ? (
              <Icons.loading />
            ) : (
              <div className="flex flex-col gap-y-2">
                {myIssues !== undefined ? (
                  myIssues.map((myIssue) => {
                    return (
                      <div
                        key={myIssue.id}
                        className="border-1 flex w-full flex-col items-start justify-between gap-y-1 rounded-md border-purple-400 bg-neutral-800 px-2 py-1"
                      >
                        {myIssue.name}
                        <Link
                          href={`/${myIssue.user.id}`}
                          className="flex w-full items-center justify-between"
                        >
                          <>{myIssue.column.name}</>
                          <Avatar>
                            <AvatarImage
                              src={myIssue.user.name ?? ""}
                              alt={myIssue.user.image ?? "User image"}
                              className="size-10"
                            />
                            <AvatarFallback>
                              {myIssue.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <div>Nothing assigned</div>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="recent">Recent</TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default YourWorkDropdown;
