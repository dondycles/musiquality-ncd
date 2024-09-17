import Footer from "@/components/footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import ArrangerCenterNav from "./_nav";

export default function ArrangerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mt-[70px] flex-1 grid grid-cols-[69px_1fr]">
      <ArrangerCenterNav />
      <div className="flex-1 h-[calc(100dvh-70px)] overflow-auto">
        {children}
        <Footer />
      </div>
    </div>
  );
}
