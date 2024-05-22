"use client";

import { useRef, useState, type FC } from "react";
import { Input } from "./ui/input";
import { useOnClickOutside } from "usehooks-ts";
import { api } from "@/trpc/react";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface IEditIssueName {
  issueId: string;
  issueName: string;
}

const EditIssueName: FC<IEditIssueName> = ({ issueId, issueName }) => {
  const [editMode, setEditMode] = useState(false);
  const [newIssueName, setNewIssueName] = useState(issueName);
  const editRef = useRef(null);
  const router = useRouter();
  const { mutate } = api.issue.renameIssue.useMutation({
    onError: () => {
      setNewIssueName(issueName);
      toast({
        variant: "destructive",
        title: "Couldn't update issue name",
      });
      setEditMode(false);
    },
    onSuccess: () => {
      router.refresh();
      toast({ title: "Successfully updated issue name" });
    },
    onSettled: () => {
      setEditMode(false);
    },
  });

  function handleIssueRename(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      mutate({ issueId, newIssueName });
    }
  }

  function handleOnClickOutside() {
    // update name
    setEditMode(false);
  }

  useOnClickOutside(editRef, handleOnClickOutside);

  return (
    <div className="mb-1">
      {editMode ? (
        <Input
          ref={editRef}
          className="w-[100px]"
          value={newIssueName}
          onChange={(e) => setNewIssueName(e.target.value)}
          onKeyDown={(e) => handleIssueRename(e)}
        />
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="rounded-md px-2 py-1 font-bold tracking-wide hover:bg-violet-50 hover:text-fuchsia-900"
        >
          {issueName}
        </button>
      )}
    </div>
  );
};

export default EditIssueName;
