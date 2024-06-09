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
import { type TCreateFormSchema } from "@/lib/utils";
import { toast } from "./ui/use-toast";
import { api } from "@/trpc/react";
import { redirect, useRouter } from "next/navigation";

interface ICreateForm {
  user: User;
}

const CreateForm: FC<ICreateForm> = ({ user }) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<TCreateFormSchema, "owner">>({
    // resolver: zodResolver(createFormSchema),
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
  const { mutate } = api.project.create.useMutation({
    onSuccess: ({ projectId }) => {
      // router.push("/")
      router.push(`/projects/${projectId}`);
    },
  });

  const onSubmit = (data: Omit<TCreateFormSchema, "owner">) => {
    const dataWithOwner = {
      ...data,
      owner: user.id,
    };

    mutate(dataWithOwner);
  };

  if (errors.projectName) {
    toast({
      variant: "destructive",
      title: "Project name cannot be empty!",
    });
  }

  return (
    <div className="bg-red-20 flex w-full grow flex-col justify-between">
      <form className="flex w-full p-12">
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
                  <section
                    key={field.id}
                    className="section flex items-center gap-2"
                  >
                    <Input
                      placeholder="Column name"
                      {...register(`columns.${idx}.name`, {
                        required: true,
                      })}
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
                  </section>
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
      </form>

      <footer className="sticky bottom-0 flex h-[80px] w-full items-center justify-end bg-violet-900 p-4 shadow-md">
        <Button onClick={handleSubmit(onSubmit)}>Create Project!</Button>
      </footer>
    </div>
  );
};

export default CreateForm;
