"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "../ui/textarea";
import { threadValidation, ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

function PostThread({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<ThreadValidation>({
    resolver: zodResolver(threadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit = async (data: ThreadValidation) => {
    await createThread({
      text: data.thread,
      author: userId,
      communityId: null,
      path: pathname,
    });

    router.push("/");
  };
  return (
    <form
      id="form-rhf-demo"
      className=" mt-10 flex flex-col justify-start gap-10"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="thread"
          control={form.control}
          render={({ field }) => (
            <Field
              orientation="vertical"
              className="flex flex-col w-full gap-3"
            >
              <FieldLabel
                className="text-base-semibold text-light-2"
                htmlFor="thread"
              >
                Content
              </FieldLabel>
              <FieldContent className="no-focus border border-dark-4 bg-dark-3 text-light-1 ">
                <Textarea {...field} rows={15} id="thread" />
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" className="bg-primary-500">
        Post Thread
      </Button>
    </form>
  );
}

export default PostThread;
