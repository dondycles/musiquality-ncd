"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggleBtn() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      variant="ghost"
      size="icon"
      className="rounded-full flex items-center justify-center"
    >
      <Sun size={20} className="dark:hidden block" />
      <Moon size={20} className="hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
