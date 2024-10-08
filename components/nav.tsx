"use client";
import Link from "next/link";
import UserBtn from "./user-btn";
import { SignInButton } from "@clerk/nextjs";
import { ThemeToggleBtn } from "./theme-toggle-btn";
import { Button } from "./ui/button";
import CartDrawer from "./cart/cart-drawer";
import { useContext } from "react";
import { UserDataContext } from "./providers/user-data-provider";
import { Skeleton } from "./ui/skeleton";
export default function Nav() {
  const { isLoading, resource } = useContext(UserDataContext);

  return (
    <header className="fixed top-0 left-0 w-full border-b backdrop-blur bg-background/95 z-10 x-padding">
      <nav className="flex justify-between items-center w-full h-[70px]">
        <Link
          href={"/"}
          className="font-cormorant font-black text-xl xs:text-3xl"
        >
          MusiQuality
        </Link>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="flex gap-2 items-center">
            <ThemeToggleBtn />
            <CartDrawer />
            {!resource ? (
              <SignInButton>
                <Button>Sign in</Button>
              </SignInButton>
            ) : (
              <UserBtn user={resource} />
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
