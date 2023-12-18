import AuthButton from "@/app/_components/auth-button";
import Logo from "@/components/ui/logo";
import Link from "next/link";
import HeaderSheet from "./header-sheet";
import HeaderMenu from "./header-menu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header className="px-6 pt-10">
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
                src="/github.svg"
                className="w-8 opacity-50 invert transition-all duration-200 hover:opacity-100"
              />
            </Link>
            <div className="hidden md:block">
              {session ? <HeaderMenu /> : <AuthButton />}
            </div>
            <div className="block md:hidden">
              <HeaderSheet />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
