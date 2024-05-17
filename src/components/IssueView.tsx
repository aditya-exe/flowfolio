"use client";

import type { FC } from "react";
import { type Issue } from "@/server/db/schema";

interface IItemView {
  issue: Issue;
}

const ItemView: FC<IItemView> = ({ issue }) => {
  return (
    <div className="w-full rounded-md bg-violet-50 p-2 hover:bg-violet-100">
      <h3>{issue.name}</h3>
      {issue.status==="pending"}
    </div>
  );
};

export default ItemView;
