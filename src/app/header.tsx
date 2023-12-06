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
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
