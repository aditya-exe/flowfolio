"use client";
// TODO: add fav and options
import type { FC } from "react";
import { Icons } from "./Icons";

interface IProjectOptions {
  temp?: number;
}

const ProjectOptions: FC<IProjectOptions> = () => {
  return (
    <div className="flex items-center gap-x-4">
      <Icons.fav className="rounded-full" />
      <Icons.options />
    </div>
  );
};

export default ProjectOptions;
