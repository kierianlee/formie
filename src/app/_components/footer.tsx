import Link from "next/link";

const Footer = () => {
  return (
    <>
      <hr />
      <footer className="px-6 py-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col gap-2 lg:flex-row lg:justify-between">
            <div />
            <div className="items-center text-center text-sm text-muted-foreground">
              Created with ❤️ by{" "}
              <Link
                href="https://kierian.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                Kierian
              </Link>
              .
            </div>
            <Link
              href="/privacy"
              className="text-center text-xs text-muted-foreground underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
