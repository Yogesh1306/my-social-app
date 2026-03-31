"use client";
import { commentValidation, CommentValidation } from "@/lib/validations/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldContent, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserId, currentUserImg }: Props) => {
  const pathname = usePathname();
  const form = useForm<CommentValidation>({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (data: CommentValidation) => {
    await addCommentToThread(
      threadId,
      data.thread,
      JSON.parse(currentUserId),
      pathname,
    );
    form.reset();
  };
  return (
    <form
      id="form-rhf-demo"
      className=" comment-form"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="thread"
          control={form.control}
          render={({ field }) => (
            <Field className="flex items-center gap-3">
              <FieldLabel htmlFor="thread" className="max-w-fit">
                <Image
                  src={currentUserImg}
                  alt="profile img"
                  width={48}
                  height={48}
                  className="rounded-full object-cover w-12 h-12"
                />
              </FieldLabel>
              <FieldContent className="bg-transparent h-13">
                <Input
                  {...field}
                  id="thread"
                  type="text"
                  placeholder="Comment...."
                  className="no-focus text-light-1 outline-none border-none h-full"
                />
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" className="comment-form_btn ">
        Reply
      </Button>
    </form>
  );
};

export default Comment;
