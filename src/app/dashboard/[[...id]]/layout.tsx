import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import DashboardLayoutSidebar from "./sidebar";

export default async function DashboardLayout({
  params: { id: idParam },
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  const id = idParam ? idParam[0] : null;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full max-w-6xl py-10">
      <div className="">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="col-span-12 rounded-md border bg-zinc-800/40 lg:col-span-3">
            <DashboardLayoutSidebar activeId={id} />
          </div>
          <div className="col-span-12 flex flex-col space-y-4 lg:col-span-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
