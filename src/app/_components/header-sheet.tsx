"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LineChartIcon, MenuIcon, SettingsIcon } from "lucide-react";
import AuthButton from "./auth-button";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeaderSheet = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={open => setOpen(open)}>
      <SheetTrigger asChild>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-2">
        <span className="mb-4 text-xs uppercase">Menu</span>
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/dashboard">
            <LineChartIcon className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" className="w-full justify-start">
          <Link href="/settings">
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </Button>
        <hr className="mb-4 mt-2" />
        <AuthButton onClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default HeaderSheet;
