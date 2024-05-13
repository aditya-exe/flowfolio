"use client";

import { type Column } from "@/server/db/schema";
import { useState, type FC } from "react";
import { Button } from "./ui/button";
import { Icons } from "./Icons";
import { api } from "@/trpc/react";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface IColumnView {
  columns: Column[];
  projectId: string;
}

const ColumnView: FC<IColumnView> = ({ columns, projectId }) => {
  const router = useRouter();
  const [createNewColumn, setCreateNewColumn] = useState(false);
  const { mutate } = api.column.create.useMutation({
    onError: () => {
      toast({
        variant: "destructive",
        description: "Cannot create column :/",
      });
      setNewColumnName("");
    },
    onSuccess: () => {
      toast({
        description: "New Column created :)",
      });
      setCreateNewColumn(false);
      router.refresh();
    },
  });
  const [newColumnName, setNewColumnName] = useState("");

  function handleCreateNewColumn() {
    mutate({
      columnName: newColumnName,
      projectId,
    });
  }

  return (
    <div className="flex w-fit items-center bg-red-200 justify-start gap-x-8 p-12">
      {columns.map((col) => {
        return (
          <div
            key={col.id}
            className="h-[400px] w-[250px] rounded-md bg-violet-200 p-4"
          >
            <h3 className="text-md font-bold text-fuchsia-600">{col.name}</h3>
          </div>
        );
      })}
      {createNewColumn ? (
        <div className="h-[400px] w-[250px] rounded-md bg-violet-200 p-4">
          <input
            placeholder="Column Name"
            onChange={(e) => setNewColumnName(e.target.value)}
            className="w-full border-b border-gray-300 bg-transparent px-2 py-1 text-gray-900 caret-fuchsia-700 placeholder:text-gray-500 focus:border-gray-500 focus:outline-none dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
          />
          <div className="mt-2 flex w-full items-center justify-end gap-x-2">
            <Icons.tick
              onClick={handleCreateNewColumn}
              className="hover:text-green-600"
            />
            <Icons.cross
              onClick={() => setCreateNewColumn(false)}
              className="hover:text-red-600"
            />
          </div>
        </div>
      ) : null}

      <Button onClick={() => setCreateNewColumn(true)}>
        <Icons.plus className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ColumnView;
