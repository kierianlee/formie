import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { authOptions } from "@/lib/next-auth";
import SettingsLayoutSidebar from "./_components/sidebar";

export default async function SettingsLayout({
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="col-span-12 rounded-md border bg-zinc-800/40 lg:col-span-3">
            <SettingsLayoutSidebar />
          </div>
          <div className="col-span-12 flex flex-col space-y-4 lg:col-span-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
