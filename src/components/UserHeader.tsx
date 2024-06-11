"use client";

import { useRef, type ChangeEvent, type FC } from "react";
import { Input } from "./ui/input";
import { api } from "@/trpc/react";

interface IUserHeader {
  headerImage?: string | null;
  userId: string;
}

const UserHeader: FC<IUserHeader> = ({ userId }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate } = api.user.changeUserHeader.useMutation();

  function uploadFile(e: ChangeEvent<HTMLInputElement>) {
    let file;

    if (e.target.files) {
      file = e.target.files[0];
    }

    if (file !== undefined) {
      console.log(file);
      mutate({ userId, headerImage: file });
    }
  }

  return (
    <>
      <div
        className="h-1/3 w-full bg-red-200 hover:bg-red-900"
        onClick={() => {
          if (inputRef?.current) {
            inputRef.current.click();
          }
        }}
      >
        <Input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={uploadFile}
        />
      </div>
    </>
  );
};

export default UserHeader;
