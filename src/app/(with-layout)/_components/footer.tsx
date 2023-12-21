import Link from "next/link";

const Footer = () => {
  return (
    <>
      <hr />
      <footer className="py-6">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex flex-col justify-center gap-2">
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
