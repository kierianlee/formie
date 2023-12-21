import Logo from "@/components/ui/logo";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <>
      <div className="grid flex-1 place-items-center">
        <div className="rounded-md border bg-zinc-800/40 p-6 text-center">
          <h1 className="text-2xl font-semibold">Thank you!</h1>
          <h1 className="text-zinc-400">
            Your form was successfully submitted.
          </h1>
          <Link
            href="/"
            target="_blank"
            className="mt-8 flex items-center justify-center gap-1 text-sm"
          >
            Powered by <Logo className="h-3" />
          </Link>
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="fixed bottom-0 left-0 w-full"
      >
        <path
          fill="#a4d6ad"
          fill-opacity="1"
          d="M0,192L24,192C48,192,96,192,144,192C192,192,240,192,288,192C336,192,384,192,432,202.7C480,213,528,235,576,229.3C624,224,672,192,720,181.3C768,171,816,181,864,176C912,171,960,149,1008,154.7C1056,160,1104,192,1152,186.7C1200,181,1248,139,1296,106.7C1344,75,1392,53,1416,42.7L1440,32L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
        />
      </svg>
    </>
  );
};

export default SuccessPage;
