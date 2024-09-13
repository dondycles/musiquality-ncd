import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-muted-foreground text-xs flex flex-col gap-4 justify-center items-center py-8 mt-20 border-t">
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href={"/"}>Terms & Policies</Link>
        <Link href={"/"}>Privacy Policies</Link>
        <Link href={"/"}>Copyright</Link>
        <Link href={"/"}>FAQs</Link>
        <Link href={"/"}>Help</Link>
        <Link href={"/"}>Sell</Link>
      </div>
      <p className="font-cormorant text-2xl">MusiQuality 2024</p>
    </footer>
  );
}
