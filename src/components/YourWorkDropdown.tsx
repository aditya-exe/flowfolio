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

// import type { FC } from "react";

// interface IYourWorkDropdown {}

const YourWorkDropdown = () => {
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
      <DropdownMenuContent
        align="start"
        className="dark w-fit rounded-none"
      >
        <DropdownMenuLabel className="mb-4">Your Work</DropdownMenuLabel>
        <Tabs defaultValue="assigned-to-me" className="p-2 w-fit">
          <TabsList className="flex w-full items-center justify-around">
            <TabsTrigger value="assigned-to-me">Assigned to me</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          <TabsContent value="assigned-to-me">Assigned to me</TabsContent>
          <TabsContent value="recent">Recent</TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default YourWorkDropdown;
