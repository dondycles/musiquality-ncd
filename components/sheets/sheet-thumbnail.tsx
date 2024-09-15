"use client";
import { getPdfThumbnail } from "@/lib/getPdfThumbnail";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ClassNameValue } from "tailwind-merge";
export default function SheetThumbnail({
  pdfUrl,
  _setThumbnailUrl,
  existingThumbnailUrl,
  className,
}: {
  pdfUrl?: string;
  _setThumbnailUrl?: (url: string) => void;
  existingThumbnailUrl?: string;
  className?: ClassNameValue;
}) {
  const [thumbnailUrl, setThumbnailUrl] = useState<null | string>(null);

  useEffect(() => {
    async function fetchThumbnail() {
      if (!pdfUrl) return;
      const url = await getPdfThumbnail(pdfUrl);
      setThumbnailUrl(url);
      _setThumbnailUrl!(url);
    }
    fetchThumbnail();
  }, [_setThumbnailUrl, pdfUrl]);

  useEffect(() => {
    if (!existingThumbnailUrl) return;
    setThumbnailUrl(existingThumbnailUrl);
  }, [existingThumbnailUrl]);

  return (
    <div
      className={cn(
        "max-w-64 w-screen aspect-[561/795] bg-white relative flex items-center justify-center",
        className
      )}
    >
      {thumbnailUrl || existingThumbnailUrl ? (
        <Image
          className="object-contain object-top w-full h-full"
          fill
          src={thumbnailUrl || existingThumbnailUrl || "/favicon.ico"}
          alt={"PDF Viewer"}
          quality={100}
          sizes="(max-width: 768px) 256px, (max-width: 1200px) 512px, 720px"
        />
      ) : (
        <Loader className="animate-spin m-auto" />
      )}
    </div>
  );
}
