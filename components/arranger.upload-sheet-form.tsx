"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import SheetThumbnail from "./sheets/sheet-thumbnail";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import SheetViewer from "./sheets/sheet-viewer";
import { useToast } from "@/hooks/use-toast";
import { uploadSheet } from "@/app/actions";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(100, {
      message: "Title must be at most 100 characters.",
    }),
  og_artists: z
    .array(
      z.object({
        value: z.string().min(1, {
          message: "Artist name must be at least 1 character.",
        }),
      })
    )
    .min(1, {
      message: "At least one artist",
    }),
  sheets_file_url: z.string().url({
    message: "Sheet URL must be a valid URL.",
  }),
  thumbnail_url: z.string().url({
    message: "Thumbnail URL must be a valid URL.",
  }),
  instruments_used: z
    .array(
      z.object({
        value: z.string().min(1, {
          message: "Instrument name must be at least 1 character.",
        }),
      })
    )
    .min(1, {
      message: "At least one instrument",
    }),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  genres: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
});

export default function ArrangerUploadSheetForm() {
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      og_artists: [
        {
          value: "",
        },
      ],
      thumbnail_url: "",
      sheets_file_url: "",
      instruments_used: [
        {
          value: "",
        },
      ],
      difficulty: "Beginner",
      genres: [
        {
          value: "",
        },
      ],
    },
  });

  const {
    fields: og_artists,
    append: appendOgArtist,
    remove: removeOgArtist,
  } = useFieldArray({
    control: form.control,
    name: "og_artists",
  });

  const {
    fields: instruments_used,
    append: appendInstrumentUsed,
    remove: removeInstrumentUsed,
  } = useFieldArray({
    control: form.control,
    name: "instruments_used",
  });

  const {
    fields: genres,
    append: appendGenre,
    remove: removeGenre,
  } = useFieldArray({
    control: form.control,
    name: "genres",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (uploadingPdf)
      return toast({
        title: "Uploading PDF",
        description: "Please wait while we upload your PDF.",
        variant: "destructive",
      });
    if (!user)
      return toast({
        title: "Error",
        description: "Please login to upload a sheet.",
        variant: "destructive",
      });
    const res = await uploadSheet(
      {
        title: data.title,
        og_artists: data.og_artists.map((artist) => artist.value),
        thumbnail_url: data.thumbnail_url,
        arranger_id: user.id,
        difficulty: data.difficulty,
        genres: data.genres?.map((genre) => genre.value),
        instruments_used: data.instruments_used.map(
          (instrument) => instrument.value
        ),
      },
      data.sheets_file_url
    );
    if (res.error) {
      return toast({
        title: "Error",
        description: res.error,
        variant: "destructive",
      });
    }
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <p className="text-muted-foreground">Upload Sheet</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="sheets_file_url"
            render={({ field }) => (
              <FormItem className="self-stretch flex  flex-col ">
                <>
                  {field.value ? (
                    <Dialog>
                      <DialogTrigger className="mx-auto">
                        <div className="flex flex-col gap-4 flex-1">
                          <SheetThumbnail
                            className="border rounded-md overflow-hidden flex-1"
                            _setThumbnailUrl={(url) => {
                              form.setValue("thumbnail_url", url);
                            }}
                            pdfUrl={field.value}
                          />
                          <Button
                            type="button"
                            className="mb-0 mt-auto"
                            onClick={() => form.resetField("sheets_file_url")}
                          >
                            Remove
                          </Button>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="p-4">
                        <DialogHeader>
                          <DialogTitle>Sheet Review</DialogTitle>
                          <SheetViewer url={field.value} key={field.value} />
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <UploadButton
                      // content={{
                      //   button({ ready, isUploading }) {
                      //     // if (ready) return <Plus size={16} />;
                      //     if (isUploading)
                      //       return <Loader size={16} className="animate-spin" />;
                      //   },
                      // }}
                      // className="ut-button:bg-foreground ut-button:text-background ut-label:text-background flex rounded-md justify-normal p-2 mx-auto ut-button:size-9 "
                      className="p-4 h-full border rounded-md ut-button:bg-foreground hover:ut-button:bg-foreground/90 ut-button:ring-foreground"
                      endpoint="sheet"
                      onClientUploadComplete={(data) => {
                        form.setValue("sheets_file_url", data[0].url);
                        setUploadingPdf(false);
                      }}
                      onUploadBegin={() => setUploadingPdf(true)}
                      onUploadError={() => setUploadingPdf(false)}
                      onUploadAborted={() => setUploadingPdf(false)}
                    />
                  )}
                </>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4 flex-1 ">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {og_artists.map((field, index) => (
              <FormField
                key={field.id}
                name={`og_artists.${index}.value`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    {index === 0 && <FormLabel>Original Artists</FormLabel>}
                    <FormControl>
                      <div className="flex flex-row gap-2">
                        <Input
                          className="flex-1"
                          placeholder={`Artist ${index + 1}`}
                          {...field}
                        />
                        {index === og_artists.length - 1 && (
                          <Button
                            type="button"
                            onClick={() => appendOgArtist({ value: "" })}
                            size="icon"
                          >
                            <Plus size={16} />
                          </Button>
                        )}
                        {og_artists.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeOgArtist(index)}
                            size="icon"
                          >
                            <Minus size={16} />
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    {index === og_artists.length - 1 && (
                      <FormDescription>
                        Enter the original artists of the song
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {instruments_used.map((field, index) => (
              <FormField
                key={field.id}
                name={`instruments_used.${index}.value`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    {index === 0 && <FormLabel>Instruments Used</FormLabel>}
                    <FormControl>
                      <div className="flex flex-row gap-2">
                        <Input
                          className="flex-1"
                          placeholder={`Instrument ${index + 1}`}
                          {...field}
                        />
                        {index === instruments_used.length - 1 && (
                          <Button
                            type="button"
                            onClick={() => appendInstrumentUsed({ value: "" })}
                            size="icon"
                          >
                            <Plus size={16} />
                          </Button>
                        )}
                        {instruments_used.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeInstrumentUsed(index)}
                            size="icon"
                          >
                            <Minus size={16} />
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    {index === instruments_used.length - 1 && (
                      <FormDescription>
                        Enter the instruments used in the song
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {genres.map((field, index) => (
              <FormField
                key={field.id}
                name={`genres.${index}.value`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    {index === 0 && <FormLabel>Genres</FormLabel>}
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
                        {genres.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeGenre(index)}
                            size="icon"
                          >
                            <Minus size={16} />
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    {index === genres.length - 1 && (
                      <FormDescription>
                        Enter the genres of the song
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              name="difficulty"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-auto mb-0">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
