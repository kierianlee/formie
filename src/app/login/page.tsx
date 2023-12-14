import { getServerSession } from "next-auth";
import SignInButton from "./_components/signin-button";
import { authOptions } from "@/lib/next-auth";
import { redirect } from "next/navigation";

export const LoginPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  const gitHubCredentialsFound = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const googleCredentialsFound = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 items-center py-10">
      <div className="mx-auto flex w-full max-w-md flex-col gap-2 rounded-md bg-zinc-800 p-4">
        {gitHubCredentialsFound && (
          <SignInButton
            provider="github"
            logoClassName="invert group-hover:invert-0"
          />
        )}
        {googleCredentialsFound && <SignInButton provider="google" />}
      </div>
    </div>
  );
};

export default LoginPage;
