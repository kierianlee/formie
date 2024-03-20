import { db } from "@/db";
import CreateTeamButton from "./_components/create-team-button";
import TeamsTable from "./_components/table";
import { redirect } from "next/navigation";
import { and, eq, isNull } from "drizzle-orm";
import {
  TEAM_MEMBER_ROLES,
  teamInvites as teamInvitesTable,
  teamMembers as teamMembersTable,
} from "@/db/schema";
import { auth } from "@/auth";

export const runtime = "edge";

const TeamsPage = async () => {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const [teams, invites] = await Promise.all([
    db.query.teamMembers
      .findMany({
        where: eq(teamMembersTable.userId, session.user.id),
        with: {
          team: true,
        },
      })
      .then(teamMembers =>
        teamMembers.map(teamMember => ({
          ...teamMember.team,
          role: teamMember.role as (typeof TEAM_MEMBER_ROLES)[keyof typeof TEAM_MEMBER_ROLES],
        })),
      ),
    db.query.teamInvites
      .findMany({
        where: and(
          eq(teamInvitesTable.email, session.user.email!),
          isNull(teamInvitesTable.respondedAt),
        ),
        with: {
          team: true,
        },
      })
      .then(teamInvites =>
        teamInvites.map(teamInvite => ({
          ...teamInvite.team,
          role: "INVITED" as const,
          inviteId: teamInvite.id,
        })),
      ),
  ]);

  return (
    <div className="rounded-md border bg-zinc-800/40 p-6">
      <CreateTeamButton />
      <hr className="my-4" />
      <TeamsTable data={[...teams, ...invites]} />
    </div>
  );
};

export default TeamsPage;
