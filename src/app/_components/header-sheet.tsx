"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import AuthButton from "./auth-button";
import { useState } from "react";

const HeaderSheet = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open}>
      <SheetTrigger asChild onClick={() => setOpen(prev => !prev)}>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent className="w-full">
        <hr className="my-4" />
        <AuthButton onClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default HeaderSheet;
