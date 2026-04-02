"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation, userValidation } from "@/lib/validations/user";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { uploadImageToCloudinary } from "@/lib/uploadToCloudinary";
import { updateUser } from "@/lib/actions/user.actions";
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

const AccountProfile = ({ user, btnTitle }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<UserValidation>({
    resolver: zodResolver(userValidation),
    defaultValues: {
      profile_photo: user?.image ? user.image : "",
      name: user?.name ? user.name : "",
      username: user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
  ) => {
    e.preventDefault();

    const reader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0] ?? null;

      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) {
        setPreview(null);
        fieldChange("");
        return;
      }

      reader.onloadend = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || " ";
        fieldChange(imageDataUrl);
        setPreview(imageDataUrl);
      };

      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: UserValidation) {
    const blob = data.profile_photo;
    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imageUrl = await uploadImageToCloudinary(files);
      if (imageUrl) {
        data.profile_photo = imageUrl;
      }
    }

    await updateUser({
      userId: user.id,
      username: data.username,
      name: data.name,
      bio: data.bio,
      image: data.profile_photo,
      path: pathname,
    });

    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  }

  useEffect(() => {
    (() => {
      if (user?.image) {
        setPreview(user.image);
      }
    })();
  }, [user?.image]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <form
      id="form-rhf-demo"
      className="flex flex-col justify-start gap-10 md:w-100"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        {/* image controller */}
        <Controller
          name="profile_photo"
          control={form.control}
          render={({ field: { onChange, ref }, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex items-center gap-4"
            >
              <FieldLabel
                className="account-form_image-label!"
                htmlFor="profile_image"
              >
                {preview ? (
                  <Image
                    src={preview}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-cover w-15 h-15 md:w-24 md:h-24 aspect-square"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    width={24}
                    height={24}
                    className="object-contain w-15 h-15 md:w-24 md:h-24 aspect-square"
                  />
                )}
              </FieldLabel>
              <div className=" w-[80%] text-base-semibold text-gray-200">
                <Input
                  id="profile_image"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  ref={ref}
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, onChange)}
                />
              </div>
            </Field>
          )}
        />
        {/* Name */}
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => (
            <Field
              orientation="vertical"
              className="flex flex-col w-full gap-3"
            >
              <FieldLabel
                className="text-base-semibold text-light-2"
                htmlFor="name"
              >
                Name
              </FieldLabel>

              <Input
                {...field}
                id="name"
                className="account-form_input no-focus h-10 "
              />
            </Field>
          )}
        />
        {/* Username */}
        <Controller
          name="username"
          control={form.control}
          render={({ field }) => (
            <Field
              orientation="vertical"
              className="flex flex-col w-full gap-3"
            >
              <FieldLabel
                className="text-base-semibold text-light-2"
                htmlFor="username"
              >
                Username
              </FieldLabel>

              <Input
                {...field}
                id="username"
                className="account-form_input no-focus h-10 "
              />
            </Field>
          )}
        />
        {/* bio */}
        <Controller
          name="bio"
          control={form.control}
          render={({ field }) => (
            <Field
              orientation="vertical"
              className="flex flex-col w-full gap-3"
            >
              <FieldLabel
                className="text-base-semibold text-light-2"
                htmlFor="bio"
              >
                Bio
              </FieldLabel>

              <Textarea
                {...field}
                rows={20}
                id="bio"
                className="account-form_input no-focus "
              />
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" className="bg-primary-500!">
        {btnTitle}
      </Button>
    </form>
  );
};
export default AccountProfile;
