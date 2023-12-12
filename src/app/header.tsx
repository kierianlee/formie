import AuthButton from "@/components/auth-button";
import Logo from "@/components/logo";
import Link from "next/link";

const Header = () => {
  return (
    <header className="px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex justify-between">
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
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
