"use client";

import { useFieldArray, useForm } from "react-hook-form";
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
import { ArrangersPublicData } from "@/app/db/schema";
import { Minus, Plus } from "lucide-react";
import ArrangerAvatar from "./arranger.avatar";
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
import { ToastAction } from "./ui/toast";
import { Separator } from "./ui/separator";
const formSchema = z.object({
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
        slug: z.string(),
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
    instruments: false,
    genres: false,
    social_links: false,
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
        slug: link.slug,
        type: link.type,
        base_url: link.base_url,
      })),
    },
  });

  const {
    fields: instruments,
    append: appendInstrument,
    remove: removeInstrument,
  } = useFieldArray({
    control: form.control,
    name: "instruments",
  });

  const {
    fields: genres,
    append: appendGenre,
    remove: removeGenre,
  } = useFieldArray({
    control: form.control,
    name: "genres",
  });

  const {
    fields: social_links,
    append: appendSocialLink,
    remove: removeSocialLink,
  } = useFieldArray({
    control: form.control,
    name: "social_links",
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
      if (field === "social_links") {
        console.log(
          `${field} : form=${JSON.stringify(
            formValue
          )} | arranger=${JSON.stringify(arrangerValue ?? [])}`
        );
        return (
          JSON.stringify(formValue) !== JSON.stringify(arrangerValue ?? [])
        );
      }
      if (Array.isArray(formValue) && Array.isArray(arrangerValue)) {
        console.log(
          `${field} : form=${
            JSON.stringify(formValue.map((ins) => ins)) ===
            JSON.stringify([null])
              ? JSON.stringify([])
              : JSON.stringify(formValue.map((ins) => ins))
          } | arranger=${JSON.stringify(arrangerValue)}`
        );

        return (
          (JSON.stringify(formValue.map((ins) => ins)) ===
          JSON.stringify([null])
            ? JSON.stringify([])
            : JSON.stringify(formValue.map((ins) => ins))) !==
          JSON.stringify(arrangerValue)
        );
      } else {
        console.log(`${field} : form=${formValue} | arranger=${arrangerValue}`);
        return formValue !== arrangerValue;
      }
    };

    setChanges({
      avatar_url: detectChanges("avatar_url"),
      name: detectChanges("name"),
      bio: detectChanges("bio"),
      slug: detectChanges("slug"),
      instruments: detectChanges("instruments"),
      genres: detectChanges("genres"),
      social_links: detectChanges("social_links"),
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
                      className="resize-none"
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
            {instruments.length > 0 ? (
              instruments.map((f, index) => (
                <FormField
                  control={form.control}
                  key={f.id}
                  name={`instruments.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-row gap-2">
                          <Input
                            className="flex-1"
                            placeholder={`Instrument ${index + 1}`}
                            {...field}
                          />
                          {index === instruments.length - 1 && (
                            <Button
                              type="button"
                              onClick={() => appendInstrument({ value: "" })}
                              size="icon"
                            >
                              <Plus size={16} />
                            </Button>
                          )}
                          <Button
                            type="button"
                            onClick={() => removeInstrument(index)}
                            size="icon"
                          >
                            <Minus size={16} />
                          </Button>
                        </div>
                      </FormControl>
                      {index === instruments.length - 1 && (
                        <FormDescription>
                          Enter the instruments you work with
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
                  No instruments found, add some to get started.
                </p>
                <Button
                  type="button"
                  onClick={() => appendInstrument({ value: "" })}
                >
                  Add Instrument
                </Button>
              </>
            )}

            <Separator />

            <p className="text-sm">Genres</p>
            {genres.length > 0 ? (
              genres.map((f, index) => (
                <FormField
                  control={form.control}
                  key={f.id}
                  name={`genres.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-row gap-2">
                          <Input
                            className="flex-1"
                            placeholder={`Genre ${index + 1}`}
                            {...field}
                          />
                          {index === genres.length - 1 && (
                            <Button
                              type="button"
                              onClick={() => appendGenre({ value: "" })}
                              size="icon"
                            >
                              <Plus size={16} />
                            </Button>
                          )}
                          <Button
                            type="button"
                            onClick={() => removeGenre(index)}
                            size="icon"
                          >
                            <Minus size={16} />
                          </Button>
                        </div>
                      </FormControl>
                      {index === genres.length - 1 && (
                        <FormDescription>
                          Enter the genres you work with, separated by commas.
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
                  No genres found, add some to get started.
                </p>
                <Button
                  type="button"
                  onClick={() => appendGenre({ value: "" })}
                >
                  Add Genre
                </Button>
              </>
            )}

            <Separator />

            <p className="text-sm">Social Links</p>
            {social_links.length > 0 ? (
              social_links.map((f, index) => (
                <FormField
                  control={form.control}
                  key={f.id}
                  name={`social_links.${index}.slug`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-col gap-2 ">
                          <div className="flex flex-row gap-1">
                            {
                              SOCIAL_MEDIAS.find((sm) => sm.type === f.type)
                                ?.icon
                            }
                            <p className="text-muted-foreground text-xs">
                              {f.base_url}
                            </p>
                          </div>
                          <div className="flex flex-row gap-2">
                            <Input
                              className="flex-1"
                              placeholder={`Social Link ${index + 1}`}
                              {...field}
                            />
                            {index === social_links.length - 1 && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button type="button" size="icon">
                                    <Plus size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {SOCIAL_MEDIAS.map((sm) => {
                                    return (
                                      <DropdownMenuItem
                                        key={sm.url}
                                        onClick={() =>
                                          appendSocialLink({
                                            base_url: sm.url,
                                            type: sm.type,
                                            slug: "",
                                          })
                                        }
                                      >
                                        <div className="flex flex-row gap-2 items-center">
                                          {sm.icon}
                                          <p className="text-muted-foreground text-xs">
                                            {sm.name}
                                          </p>
                                        </div>
                                      </DropdownMenuItem>
                                    );
                                  })}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                            <Button
                              type="button"
                              onClick={() => removeSocialLink(index)}
                              size="icon"
                            >
                              <Minus size={16} />
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      {index === social_links.length - 1 && (
                        <FormDescription>
                          Enter your social links, separated by commas.
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
                  No social links found, add some to get started.
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button">Add social link</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {SOCIAL_MEDIAS.map((sm) => {
                      return (
                        <DropdownMenuItem
                          key={sm.url}
                          onClick={() =>
                            appendSocialLink({
                              slug: "",
                              base_url: sm.url,
                              type: sm.type,
                            })
                          }
                        >
                          <div className="flex flex-row gap-2 items-center">
                            {sm.icon}
                            <p className="text-muted-foreground text-xs">
                              {sm.name}
                            </p>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

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
