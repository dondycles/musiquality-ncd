"use client";

import { applyAsArranger } from "@/app/actions";
import { Button } from "./ui/button";
import { SignInButton, useClerk } from "@clerk/nextjs";

export default function ApplyAsArrangerBtn() {
  const { user } = useClerk();
  if (!user)
    return (
      <SignInButton>
        <Button>Sign in to apply</Button>
      </SignInButton>
    );
  if (user.publicMetadata.is_arranger)
    return <Button disabled>You are already an arranger</Button>;
  return (
    <Button
      className="w-fit mx-auto"
      onClick={async () => {
        await applyAsArranger();
        location.reload();
      }}
    >
      Apply as Arranger
    </Button>
  );
}
