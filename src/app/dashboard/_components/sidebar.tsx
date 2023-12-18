import { CreateFormButton } from "../[id]/_components/create-form-button";
import { db } from "@/db";
import {
  forms as formsTable,
  formsToTeams as formsToTeamsTable,
  teamMembers as teamMembersTable,
} from "@/db/schema";
import { getServerSession } from "next-auth";
import { and, eq, inArray, notInArray } from "drizzle-orm";
import SidebarItem from "./sidebar-item";
import { authOptions } from "@/lib/next-auth";

const DashboardLayoutSidebar = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <></>;
  }

  const teams = await db.query.teamMembers.findMany({
    where: eq(teamMembersTable.userId, session.user.id),
  });
  const teamForms = await db.query.formsToTeams.findMany({
    where: inArray(
      formsToTeamsTable.teamId,
      teams.map(t => t.teamId),
    ),
    with: {
      form: true,
    },
  });
  const ownForms = await db.query.forms.findMany({
    where: and(
      eq(formsTable.userId, session.user.id),
      notInArray(
        formsTable.id,
        teams.map(t => t.teamId),
      ),
    ),
  });
  const unfilteredForms = [...teamForms.map(item => item.form), ...ownForms];

  const forms = unfilteredForms
    .filter(
      (val, idx, arr) => arr.findIndex(item => item.id === val.id) === idx,
    )
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .reverse();

  return (
    <>
      <div className="p-6">
        <div className="mb-3 text-xs uppercase">Forms list:</div>
        <div className="flex flex-col space-y-2">
          {forms.map(form => (
            <SidebarItem key={form.id} form={form} />
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
