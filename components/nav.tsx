"use client";
import Link from "next/link";
import UserBtn from "./user-btn";
import { SignInButton, useClerk } from "@clerk/nextjs";
import { ThemeToggleBtn } from "./theme-toggle-btn";
import { Button } from "./ui/button";
export default function Nav() {
  const { user } = useClerk();

  return (
    <header className="fixed top-0 left-0 w-full border-b backdrop-blur bg-background/95 z-10 x-padding">
      <nav className="flex justify-between items-center w-full h-[70px]">
        <Link href={"/"} className="font-cormorant font-black text-3xl">
          MusiQuality
        </Link>
        <div className="flex gap-2 items-center">
          <ThemeToggleBtn />
          {!user ? (
            <SignInButton>
              <Button>Sign in</Button>
            </SignInButton>
          ) : (
            <UserBtn user={user} />
          )}
        </div>
      </nav>
    </header>
  );
}
