import AuthButton from "@/components/auth-button";
import Logo from "@/components/logo";

const Header = () => {
  return (
    <header className="px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex justify-between">
          <Logo className="w-32" />
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
