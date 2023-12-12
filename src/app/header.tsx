import AuthButton from "@/components/auth-button";
import Logo from "@/components/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex justify-between gap-4">
          <Link href="/">
            <Logo className="w-32" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/inkiear/formie" target="_blank">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="GitHub"
                src="github.svg"
                className="w-8 opacity-50 invert transition-all duration-200 hover:opacity-100"
              />
            </Link>
            <div className="hidden md:block">
              <AuthButton />
            </div>
            <div className="block md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <MenuIcon />
                </SheetTrigger>
                <SheetContent className="w-full">
                  <hr className="my-4" />
                  <AuthButton />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
