import Footer from "@/components/footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import ArrangerCenterNav from "./_nav";

export default function ArrangerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row mt-[70px] flex-1">
      <ArrangerCenterNav />
      <ScrollArea className="flex-1 h-[calc(100dvh-70px)]">
        {children}
        <Footer />
      </ScrollArea>
    </div>
  );
}
