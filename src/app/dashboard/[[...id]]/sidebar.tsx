import { CreateFormButton } from "./create-form-button";
import { db } from "@/db";
import { forms as formsTable } from "@/db/schema";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import SidebarItem from "./sidebar-item";
import { authOptions } from "@/lib/next-auth";

interface DashboardLayoutSidebarProps {
  activeId: string | null;
}

const DashboardLayoutSidebar = async ({
  activeId,
}: DashboardLayoutSidebarProps) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <></>;
  }

  const forms = await db.query.forms.findMany({
    where: eq(formsTable.userId, session.user.id),
  });

  return (
    <>
      <div className="p-6">
        <div className="mb-3 text-xs uppercase">Forms list:</div>
        <div className="flex flex-col space-y-2">
          {forms.map((form) => (
            <SidebarItem key={form.id} form={form} activeId={activeId} />
          ))}
        </div>
      </div>
      <div className="border-t p-6">
        <CreateFormButton />
      </div>
    </>
  );
};

export default DashboardLayoutSidebar;
