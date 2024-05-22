"use client";

import { useRef, useState, type FC } from "react";
import { Input } from "./ui/input";
import { useOnClickOutside } from "usehooks-ts";
import { api } from "@/trpc/react";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface IEditColumnName {
  columnName: string;
  columnId: string;
}

const EditColumnName: FC<IEditColumnName> = ({ columnId, columnName }) => {
  const [editMode, setEditMode] = useState(false);
  const [newColumnName, setNewColumnName] = useState(columnName);
  const editRef = useRef(null);
  const router = useRouter();
  const { mutate } = api.column.renameColumn.useMutation({
    onError: () => {
      setNewColumnName(columnName);
      toast({
        variant: "destructive",
        title: "Couldn't update column name",
      });
      setEditMode(false);
    },
    onSuccess: () => {
      router.refresh();
      toast({ title: "Successfully updated column name" });
    },
    onSettled: () => {
      setEditMode(false);
    },
  });

  function handleColumnRename(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      mutate({ columnId, newColumnName });
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
          className="w-[190px]"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          onKeyDown={(e) => handleColumnRename(e)}
        />
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="font-bold rounded-md px-2 cursor py-1 text-md tracking-wide hover:bg-fuchsia-300 hover:text-fuchsia-900"
        >
          {columnName}
        </button>
      )}
    </div>
  );
};

export default EditColumnName;
