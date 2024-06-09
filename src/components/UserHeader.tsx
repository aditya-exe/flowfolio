"use client";

import { cn } from "@/lib/utils";
import { useRef, type FC } from "react";

interface IUserHeader {
  headerImage?: string | null;
}

const UserHeader: FC<IUserHeader> = ({ headerImage }) => {
  const uploaderRef = useRef();
  
  return (
    <>
      <div>

      </div>
    </>
  )
};

export default UserHeader;
