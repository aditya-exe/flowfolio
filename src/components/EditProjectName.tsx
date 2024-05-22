"use client";

import { useRef, useState, type FC } from "react";
import { Input } from "./ui/input";
import { useOnClickOutside } from "usehooks-ts";
import { api } from "@/trpc/react";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface IEditProjectName {
  projectId: string;
  projectName: string;
}

const EditProjectName: FC<IEditProjectName> = ({ projectName, projectId }) => {
  const  [editMode, setEditMode] = useState(false);
  const [newProjectName, setNewProjectName] = useState(projectName);
  const editRef = useRef(null);
  const router = useRouter();
  const { mutate } = api.project.renameProject.useMutation({
    onError: () => {
      setNewProjectName(projectName);
      toast({
        variant: "destructive",
        title: "Couldn't update project name",
      });
      setEditMode(false);
    },
    onSuccess: () => {
      router.refresh();
      toast({ title: "Successfully updated project name" });
    },
    onSettled: () => {
      setEditMode(false);
    },
  });

  function handleProjectRename(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      mutate({ projectId, newProjectName });
    }
  }

  function handleOnClickOutside() {
    // update name
    setEditMode(false);
  }

  useOnClickOutside(editRef, handleOnClickOutside);

  return (
    <>
      {editMode ? (
        <Input
          ref={editRef}
          className="w-[300px]"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          onKeyDown={(e) => handleProjectRename(e)}
        />
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="font-bold rounded-md px-2 py-1 text-xl tracking-wide hover:bg-fuchsia-300 hover:text-fuchsia-900"
        >
          {projectName}
        </button>
      )}
    </>
  );
};

export default EditProjectName;
