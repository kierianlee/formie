import { CreateFormButton } from "../[id]/_components/create-form-button";
import { db } from "@/db";
import {
  Form,
  FormsToTeams,
  forms as formsTable,
  formsToTeams as formsToTeamsTable,
  teamMembers as teamMembersTable,
} from "@/db/schema";
import { and, eq, inArray, notInArray } from "drizzle-orm";
import SidebarItem from "./sidebar-item";
import { auth } from "@/auth";

const DashboardLayoutSidebar = async () => {
  const session = await auth();

  if (!session) {
    return <></>;
  }

  const teams = await db.query.teamMembers.findMany({
    where: eq(teamMembersTable.userId, session.user.id),
  });

  let teamForms: (FormsToTeams & { form: Form })[] = [];

  if (!!teams.length) {
    teamForms = await db.query.formsToTeams.findMany({
      where: inArray(
        formsToTeamsTable.teamId,
        teams.map(t => t.teamId),
      ),
      with: {
        form: true,
      },
    });
  }

  const ownForms = await db.query.forms.findMany({
    where: and(
      eq(formsTable.userId, session.user.id),
      ...(!!teams.length
        ? [
            notInArray(
              formsTable.id,
              teams.map(t => t.teamId),
            ),
          ]
        : []),
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
