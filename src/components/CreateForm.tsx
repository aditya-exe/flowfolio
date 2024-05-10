"use client";

import { type FC } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Icons } from "./Icons";
import { type User } from "next-auth";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type TCreateFormSchema, createFormSchema } from "@/lib/utils";
import { createFormStore } from "@/lib/zustand";

interface ICreateForm {
  user: User;
}

const CreateForm: FC<ICreateForm> = ({ user }) => {
  const { data: storeData, setData: setStoreData } = createFormStore();
  const { register, control, handleSubmit } = useForm<
    Omit<TCreateFormSchema, "owner">
  >({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      projectName: "",
      columns: [
        {
          name: "",
        },
      ],
    },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const onSubmit = (data: Omit<TCreateFormSchema, "owner">) => {
    console.log(data);
  };

  return (
    <div className="bg-red-20 w-full p-12">
      <form className="flex w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-1/2 space-y-8">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              {...register("projectName")}
              id="name"
              className="w-[400px]"
              placeholder="Project name"
            />
          </div>
          <div className="flex items-center gap-x-4 space-y-2">
            <Label>Owner</Label>
            <Link
              href={`/user/${user.id}`}
              className="rounded-full hover:ring-2 hover:ring-fuchsia-500"
            >
              <Avatar>
                <AvatarImage
                  src={user.image ?? ""}
                  alt={user.name ?? "User image"}
                />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
          <div className="space-y-2">
            <Label htmlFor="columns">Columns</Label>
            <div className="space-y-2" id="columns">
              {fields.map((field, idx) => {
                return (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input
                      key={field.id}
                      {...register(`columns.${idx}.name` as const)}
                      className="w-[400px]"
                    />
                    <Button
                      className="w-fit"
                      size={"sm"}
                      variant={"destructive"}
                      onClick={() => remove(idx)}
                      disabled={fields.length === 1}
                    >
                      <Icons.cross />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              append({ name: "" });
            }}
            variant="outline"
          >
            Add column
          </Button>
        </div>
        <div className="w-1/2">
          <div className="flex items-center gap-x-4">
            <h1 className="font-bold">Add Users to your project</h1>
            <Button>
              <Icons.userPlus />
            </Button>
          </div>
          TODO: SO EMPTY ONLY YOU
        </div>
        <input type="submit" />
      </form>
    </div>
  );
};

export default CreateForm;
