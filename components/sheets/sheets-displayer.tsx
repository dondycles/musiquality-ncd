import * as React from "react";
import { cn } from "@/lib/utils";
import { chunkArray } from "@/lib/chunkArray";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import ListViewer from "../list-viewer";
import { PrivateSheetData, PublicSheetData } from "@/utils/db/types";
import PageViewToggleBtn from "../page-view-toggle-btn";
import SheetsDisplayerOrientor from "../orientor";
import SheetCard from "./sheet-cart";
import SheetBar from "./sheet-bar";

interface SheetsDisplayerProps extends React.HTMLAttributes<HTMLDivElement> {}

const SheetsDisplayer = React.forwardRef<HTMLDivElement, SheetsDisplayerProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
);
SheetsDisplayer.displayName = "SheetsDisplayer";

interface SheetsDisplayerHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const SheetsDisplayerHeader = React.forwardRef<
  HTMLDivElement,
  SheetsDisplayerHeaderProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex gap-1 items-center font-semibold", className)}
    {...props}
  />
));
SheetsDisplayerHeader.displayName = "SheetsDisplayerHeader";

interface SheetsDisplayerTitleProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const SheetsDisplayerTitle = React.forwardRef<
  HTMLParagraphElement,
  SheetsDisplayerTitleProps
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("", className)} {...props} />
));
SheetsDisplayerTitle.displayName = "SheetsDisplayerTitle";

interface SheetsDisplayerIconProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const SheetsDisplayerIcon = React.forwardRef<
  HTMLDivElement,
  SheetsDisplayerIconProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
SheetsDisplayerIcon.displayName = "SheetsDisplayerIcon";

interface SheetsDisplayerViewToggleBtnProps
  extends React.HTMLAttributes<HTMLDivElement> {
  actionType: "search" | "library" | "top-selling";
}

const SheetsDisplayerViewToggleBtn = React.forwardRef<
  HTMLDivElement,
  SheetsDisplayerViewToggleBtnProps
>(({ className, actionType }) => (
  <PageViewToggleBtn
    className={cn("ml-auto mr-0", className)}
    actionType={actionType}
  />
));
SheetsDisplayerViewToggleBtn.displayName = "SheetsDisplayerViewToggleBtn";

interface SheetsDisplayerContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  actionType: "search" | "library" | "top-selling";
  sheets: PublicSheetData[] | PrivateSheetData[];
}

const SheetsDisplayerContent = React.forwardRef<
  HTMLDivElement,
  SheetsDisplayerContentProps
>(({ className, actionType, sheets, ...props }, ref) => (
  <Carousel
    ref={ref}
    className={cn("", className)}
    opts={{
      align: "start",
      slidesToScroll: 1,
    }}
    {...props}
  >
    <div className="flex flex-col">
      <CarouselContent>
        <SheetsDisplayerOrientor
          actionType={actionType}
          row={chunkArray(sheets, 10).map((sheetChunk, index) => (
            <CarouselItem key={`chunked-${index}`} className="basis-full">
              <ListViewer length={sheetChunk.length}>
                {sheetChunk.map((s) => (
                  <SheetBar sheet={s} key={s.sheets.id} />
                ))}
              </ListViewer>
            </CarouselItem>
          ))}
          col={sheets.map((sheet) => (
            <CarouselItem
              key={sheet.sheets.id}
              className="max-w-fit w-fit min-w-fit"
            >
              <SheetCard sheet={sheet} />
            </CarouselItem>
          ))}
        />
      </CarouselContent>
      <div className="flex gap-4 items-center justify-center mt-3">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </div>
  </Carousel>
));
SheetsDisplayerContent.displayName = "SheetsDisplayerContent";

export {
  SheetsDisplayer,
  SheetsDisplayerHeader,
  SheetsDisplayerTitle,
  SheetsDisplayerIcon,
  SheetsDisplayerContent,
  SheetsDisplayerViewToggleBtn,
};
