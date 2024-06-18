"use client";

import { type IssueWithColumn } from "@/lib/types";
import type { User } from "next-auth";
import type { FC } from "react";
import UserWorkBreadcrumb from "./UserWorkBreadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface IWorkView {
  user: User;
  issues: IssueWithColumn[];
}

const WorkView: FC<IWorkView> = ({ user, issues }) => {
  return (
    <div className="flex h-fit min-h-full grow">
      <div className="container mx-36 flex w-full flex-col gap-y-2 p-2">
        <UserWorkBreadcrumb userId={user.id} userName={user.name!} />
        <h1 className="text-xl font-bold tracking-tight">Work done</h1>
        <div className="w-full">
          <Tabs defaultValue="worked-on" className="w-fit bg-red-200">
            <TabsList className="flex w-full items-center justify-around">
              <TabsTrigger value="worked-on">Worked On</TabsTrigger>
              <TabsTrigger value="viewed">Viewed</TabsTrigger>
              <TabsContent value="worked-on"className="flex flex-col">
                {issues.map((issue)=>{
                  return (
                    <div key={issue.id}>
                      {issue.name}
                    </div>
                  )
                })}
              </TabsContent>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default WorkView;
