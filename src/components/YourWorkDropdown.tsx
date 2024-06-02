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
              <>
                {myIssues !== undefined ? (
                  myIssues.map((myIssue) => {
                    return (
                      <div
                        key={myIssue.id}
                        className="flex w-full flex-col items-start gap-y-1 rounded-md bg-red-200 px-2 py-1"
                      >
                        {myIssue.name}
                        <div>{myIssue.column.name}</div>
                      </div>
                    );
                  })
                ) : (
                  <div>Nothing assigned</div>
                )}
              </>
            )}
          </TabsContent>
          <TabsContent value="recent">Recent</TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default YourWorkDropdown;
