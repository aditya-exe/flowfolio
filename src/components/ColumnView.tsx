"use client";

import { type ColumnWithIssues } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState, type FC } from "react";
import { Icons } from "./Icons";
import SingleColumn from "./SingleColumn";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

interface IColumnView {
  columns: ColumnWithIssues[];
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
    <div className="flex">
      <div className="flex w-fit items-center justify-start gap-x-8 overflow-auto p-12">
        {columns.map((col) => {
          return <SingleColumn key={col.id} column={col} />;
        })}
        {createNewColumn ? (
          <div className="flex h-[400px] w-[250px] shrink-0 flex-col rounded-md bg-violet-200 p-4">
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
      </div>
      <div className="flex h-[400px] flex-col justify-center">
        <Button className="mt-15" onClick={() => setCreateNewColumn(true)}>
          <Icons.plus className="h-5 w-5" />
        </Button>
      </div>
      <div className="h-full  p-4" />
    </div>
  );
};

export default ColumnView;
