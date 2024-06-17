"use client";

import { FLOWFOLIO_HEADERS } from "@/lib/utils";
import { type ChangeEvent, useRef, type FC } from "react";
import {
  useFileUrl,
  useUpload,
} from "@supabase-cache-helpers/storage-react-query";
import { supabase } from "@/lib/utils";
import { toast } from "./ui/use-toast";
import Image from "next/image";
import { Icons } from "./Icons";
import { Input } from "./ui/input";

interface IUserHeaderImage {
  userId: string;
  headerImage: string | null | undefined;
}

const UserHeaderImage: FC<IUserHeaderImage> = ({ userId }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: headerUrl, isLoading, isError } = useFileUrl(
    supabase.storage.from(FLOWFOLIO_HEADERS),
    `${userId}/header`,
    "public",
    {
      refetchOnWindowFocus: false,
    },
  );
  const { mutate: upload } = useUpload(
    supabase.storage.from(FLOWFOLIO_HEADERS),
    {
      upsert: true,
      buildFileName: () => `${userId}/header`,
      onError: () => {
        toast({
          description: "Failed to upload header",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({ description: "Updated header successfully" });
      },
    },
  );

  function uploadFile(e: ChangeEvent<HTMLInputElement>) {
    let file;

    if (e.target.files) {
      file = e.target.files;
    }

    if (file !== undefined && e.target.files) {
      upload({ files: [...file] });
    }
  }

  return (
    <div className="flex h-1/3 w-full flex-col">
      <div className="group h-full w-full">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Icons.loading className="size-8 animate-spin" />
          </div>
        ) : (
          <div className="relative h-full">
            <Image
              src={headerUrl!}
              quality={100}
              className="h-full w-full object-cover"
              alt="user-header"
              // loading="lazy"
              width={10}
              height={10}
            />
            <div
              className="absolute bottom-0 flex h-full w-full cursor-pointer items-center justify-center bg-black/20 opacity-0 transition-all duration-300 group-hover:opacity-100"
              onClick={() => {
                if (inputRef?.current) {
                  inputRef.current.click();
                }
              }}
            >
              <Icons.imagePlus />
              <Input
                type="file"
                ref={inputRef}
                className="hidden"
                onChange={uploadFile}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHeaderImage;
