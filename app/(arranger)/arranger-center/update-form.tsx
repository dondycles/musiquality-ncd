/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrangersPublicData } from "@/utils/db/schema";
import { Minus, Plus } from "lucide-react";
import ArrangerAvatar from "../../../components/arranger.avatar";
import { UploadButton } from "@/utils/uploadthing";
import { updateArranger } from "@/app/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

import {
  SOCIAL_MEDIA_BASE_URLS,
  SOCIAL_MEDIA_TYPES,
  SOCIAL_MEDIAS,
} from "@/lib/constants";
import { ToastAction } from "../../../components/ui/toast";
import { Separator } from "../../../components/ui/separator";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  bio: z.string().max(160, {
    message: "Bio must not exceed 160 characters.",
  }),
  slug: z.string().min(3, {
    message: "Slug must be at least 3 characters.",
  }),
  avatar_url: z.string().url({
    message: "Avatar URL must be a valid URL.",
  }),
  instruments: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
  genres: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
  social_links: z
    .array(
      z.object({
        value: z.string(),
        type: SOCIAL_MEDIA_TYPES,
        base_url: SOCIAL_MEDIA_BASE_URLS,
      })
    )
    .optional(),
});

export default function ArrangerUpdateForm({
  arranger_data,
}: {
  arranger_data: typeof ArrangersPublicData.$inferSelect;
}) {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [changes, setChanges] = useState({
    avatar_url: false,
    name: false,
    bio: false,
    slug: false,
  });

  const default_instruments =
    arranger_data.instruments?.map((ins) => ({
      value: ins,
    })) ?? [];

  const default_genres =
    arranger_data.genres?.map((genre) => ({
      value: genre,
    })) ?? [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: arranger_data.name,
      bio: arranger_data.bio ?? undefined,
      slug: arranger_data.slug,
      avatar_url: arranger_data.avatar_url ?? undefined,
      instruments: default_instruments,
      genres: default_genres,
      social_links: arranger_data.social_links?.map((link) => ({
        value: link.value,
        type: link.type,
        base_url: link.base_url,
      })),
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const res = await updateArranger({
      id: arranger_data.id,
      name: values.name,
      slug: values.slug,
      bio: values.bio,
      avatar_url: values.avatar_url,
      instruments: values.instruments?.map((ins) => ins.value),
      genres: values.genres?.map((genre) => genre.value),
      social_links: values.social_links,
    });
    if (res.error) {
      if (res.field) {
        form.setError(res.field as keyof (typeof formSchema)["shape"], {
          message: res.error,
        });
      }
      return toast({
        description: res.error,
        variant: "destructive",
      });
    }
    toast({
      description: "Your profile has been updated.",
    });

    setOpen(false);
  }

  useEffect(() => {
    const detectChanges = (field: keyof typeof changes) => {
      const formValue = form.watch(field);
      const arrangerValue = arranger_data[field];

      return formValue !== arrangerValue;
      // }
    };

    setChanges({
      avatar_url: detectChanges("avatar_url"),
      name: detectChanges("name"),
      bio: detectChanges("bio"),
      slug: detectChanges("slug"),
    });
  }, [
    arranger_data,
    form.watch("social_links"),
    form.watch("avatar_url"),
    form.watch("name"),
    form.watch("bio"),
    form.watch("slug"),
    form.watch("instruments"),
    form.watch("genres"),
  ]);

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (Object.values(changes).some((change) => change)) {
          if (state === false) {
            return toast({
              description: `Are you sure you want to close without saving? ${Object.entries(
                changes
              )
                .map((change) => change)
                .join(", ")}`,
              variant: "destructive",
              action: (
                <ToastAction
                  onClick={() => {
                    setOpen(false);
                    form.reset();
                  }}
                  altText="Close"
                >
                  Close
                </ToastAction>
              ),
              duration: 3000,
            });
          }
        }
        setOpen(state);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-fit mx-auto sm:mx-0 mt-2">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Edit your profile information.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4 overflow-y-auto p-4 pt-0"
          >
            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem className="mx-auto flex justify-center flex-col items-center">
                  <ArrangerAvatar
                    size={128}
                    arranger_data={{
                      ...arranger_data,
                      avatar_url: field.value,
                    }}
                  />
                  <UploadButton
                    className="ut-button:bg-foreground hover:ut-button:bg-foreground/90 ut-button:ring-foreground"
                    endpoint="imageUploader"
                    disabled={imageUploading}
                    onClientUploadComplete={(res) => {
                      form.setValue("avatar_url", res?.[0].url);
                      setImageUploading(false);
                    }}
                    onUploadBegin={() => {
                      setImageUploading(true);
                    }}
                    onUploadError={() => {
                      setImageUploading(false);
                    }}
                    onUploadAborted={() => {
                      setImageUploading(false);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your bio will be displayed on your profile page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="your-unique-slug" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be used in your profile URL.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />

            <p className="text-sm">Instruments</p>
            <FormFieldArray
              form={form}
              name="instruments"
              isSocialLinks={false}
            />

            <Separator />

            <p className="text-sm">Genres</p>
            <FormFieldArray form={form} name="genres" isSocialLinks={false} />

            <Separator />

            <p className="text-sm">Social Links</p>
            <FormFieldArray
              form={form}
              name="social_links"
              isSocialLinks={true}
            />

            <div className="flex flex-row gap-4 justify-end">
              <Button
                onClick={() => setOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button type="submit">Update Profile</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function AddSocialLinkButton({
  appendSocialLink,
  children,
}: {
  appendSocialLink: ({
    base_url,
    type,
    value,
  }: {
    base_url: (typeof SOCIAL_MEDIAS)[number]["url"];
    type: (typeof SOCIAL_MEDIAS)[number]["type"];
    value: string;
  }) => void;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {SOCIAL_MEDIAS.map((sm) => {
          return (
            <DropdownMenuItem
              key={sm.url}
              onClick={() =>
                appendSocialLink({
                  base_url: sm.url,
                  type: sm.type,
                  value: "",
                })
              }
            >
              <div className="flex flex-row gap-2 items-center">
                {sm.icon}
                <p className="text-muted-foreground text-xs">{sm.name}</p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FormFieldArray({
  form,
  name,
  isSocialLinks = false,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  name: keyof Pick<
    z.infer<typeof formSchema>,
    "instruments" | "genres" | "social_links"
  >;
  isSocialLinks: boolean;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: name,
  });

  return (
    <>
      {fields.length > 0 ? (
        fields.map((f, index) => (
          <FormField
            control={form.control}
            key={f.id}
            name={`${name}.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-row gap-2 placeholder:capitalize">
                    {isSocialLinks === true ? (
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-row gap-1">
                          {
                            SOCIAL_MEDIAS.find(
                              (sm) =>
                                sm.type ===
                                (
                                  f as unknown as {
                                    type: (typeof SOCIAL_MEDIAS)[number]["type"];
                                  }
                                ).type
                            )?.icon
                          }
                          <p className="text-muted-foreground text-xs">
                            {
                              (
                                f as unknown as {
                                  base_url: (typeof SOCIAL_MEDIAS)[number]["url"];
                                }
                              ).base_url
                            }
                          </p>
                        </div>
                        <div className="flex flex-row gap-2">
                          <Input
                            className="flex-1"
                            placeholder={`Social Link ${index + 1}`}
                            {...field}
                          />
                          {index === fields.length - 1 && (
                            <AddSocialLinkButton appendSocialLink={append}>
                              <Button type="button" size="icon">
                                <Plus size={16} />
                              </Button>
                            </AddSocialLinkButton>
                          )}
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            size="icon"
                          >
                            <Minus size={16} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Input
                          className="flex-1"
                          placeholder={`${name.replace("_", " ")} ${index + 1}`}
                          {...field}
                        />
                        {index === fields.length - 1 && (
                          <Button
                            type="button"
                            onClick={() => append({ value: "" })}
                            size="icon"
                          >
                            <Plus size={16} />
                          </Button>
                        )}
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          size="icon"
                        >
                          <Minus size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </FormControl>
                {index === fields.length - 1 && (
                  <FormDescription>
                    Enter the {name.replace("_", " ")} you work with
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))
      ) : (
        <>
          <p className="text-muted-foreground text-xs">
            No {name.replace("_", " ")} found, add some
          </p>
          {isSocialLinks === true ? (
            <AddSocialLinkButton appendSocialLink={append}>
              <Button type="button">Add Social Link</Button>
            </AddSocialLinkButton>
          ) : (
            <Button type="button" onClick={() => append({ value: "" })}>
              Add Instrument
            </Button>
          )}
        </>
      )}
    </>
  );
}
