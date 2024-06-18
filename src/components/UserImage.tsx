"use client";

import { type FC, useRef, type ChangeEvent } from "react";
import { AvatarFallback, Avatar, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Icons } from "./Icons";
import { api } from "@/trpc/react";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface IUserImage {
  userId: string;
  userName: string;
  userImage: string | null | undefined;
}

const UserImage: FC<IUserImage> = ({ userId, userImage, userName }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { mutate } = api.user.changeImage.useMutation({
    onError: (err) => {
      console.log(err);
      toast({
        description: "Failed to update image",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Updated image successfully",
      });
      router.refresh();
    },
  });
  // const [userImageState, setUserImage] = useState(userImage);

  // useEffect(() => {
  //   setUserImage(data?.image);
  // }, [data?.image]);

  function addImage(e: ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();

    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result !== undefined) {
        const compressedImage: string = readerEvent.target?.result as string;
        mutate({
          userId,
          newImage: compressedImage,
        });
      }
    };
  }

  return (
    <div className="group relative ">
      <Avatar className="size-[100px] ring-2 ring-fuchsia-700">
        <AvatarImage
          src={userImage!}
          alt={userName ?? "User image"}
          className=""
        />
        <AvatarFallback>{userName?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div
        className="z-99 absolute bottom-0 flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black/20 opacity-0 transition-all duration-300 group-hover:opacity-100"
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
          onChange={addImage}
        />
      </div>
    </div>
  );
};

export default UserImage;
