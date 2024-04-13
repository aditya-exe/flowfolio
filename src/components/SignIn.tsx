"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const SignIn = () => {
  return (
    <>
      <Button
        onClick={() => signIn("discord")}
        variant={"link"}
        className="peer mt-12 text-gray-400 hover:font-bold hover:italic hover:text-fuchsia-400"
        size={"lg"}
      >
        Sign In
      </Button>
      <p className="hidden font-bold italic text-fuchsia-400 peer-hover:block">
        Track tasks!
      </p>
    </>
  );
};

export default SignIn;
