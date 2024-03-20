import { db } from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import { and, eq, isNull } from "drizzle-orm";
import {
  TEAM_MEMBER_ROLES,
  teamInvites,
  teams as teamsTable,
} from "@/db/schema";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import TeamMembersTable from "./_components/table";
import Link from "next/link";
import InviteUserForm from "../_components/invite-user-form";
import DeleteTeamButton from "./_components/delete-team-button";
import LeaveTeamButton from "./_components/leave-team-button";

export const runtime = "edge";

const TeamsPage = async ({ params: { id } }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  if (!id) {
    redirect("/");
  }

  const [team, invites] = await Promise.all([
    db.query.teams.findFirst({
      where: eq(teamsTable.id, id),
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
    }),
    db.query.teamInvites.findMany({
      where: and(eq(teamInvites.teamId, id), isNull(teamInvites.respondedAt)),
    }),
  ]);

  if (!team) {
    redirect("/settings/teams");
  }

  const userIsAdmin = team.members.find(
    m => m.userId === session.user.id && m.role === TEAM_MEMBER_ROLES.ADMIN,
  );

  return (
    <div className="rounded-md border bg-zinc-800/40 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2" asChild variant="outline">
            <Link href="/settings/teams">
              <ArrowLeftIcon className="w-4" />
            </Link>
          </Button>
          <h1 className="font-semibold">{team.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          {userIsAdmin && <DeleteTeamButton teamId={team.id} />}
          <LeaveTeamButton teamId={team.id} />
        </div>
      </div>
      {userIsAdmin && (
        <div className="mt-4">
          <InviteUserForm teamId={team.id} />
        </div>
      )}

      <hr className="my-4" />
      <div>
        <TeamMembersTable
          teamId={team.id}
          data={
            [
              ...team.members.map(item => ({
                id: item.id,
                name: item.user.name || "",
                role: item.role as (typeof TEAM_MEMBER_ROLES)[keyof typeof TEAM_MEMBER_ROLES],
                email: item.user.email || "",
              })),
              ...invites.map(item => ({
                id: item.id,
                name: item.email,
                role: "INVITED" as const,
                email: item.email,
              })),
            ] || []
          }
          isAdmin={!!userIsAdmin}
        />
      </div>
    </div>
  );
};

export default TeamsPage;
