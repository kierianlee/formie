"use server";

import { db } from "@/db";
import { TEAM_MEMBER_ROLES, teamMembers, teams } from "@/db/schema";
import { authOptions } from "@/lib/next-auth";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function leaveTeam(teamId: string) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await getServerSession(authOptions);

  if (!session) {
    throw Error("Unauthenticated");
  }

  const team = await db.query.teams.findFirst({
    where: and(eq(teams.id, teamId)),
    with: {
      members: {
        with: {
          user: true,
        },
      },
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  const user = team.members.find(m => m.user.email === session.user.email);

  if (!user) {
    throw new Error("You are not a member of this team");
  }

  if (
    team.members.filter(m => m.role === TEAM_MEMBER_ROLES.ADMIN).length < 2 &&
    user.role === TEAM_MEMBER_ROLES.ADMIN
  ) {
    throw new Error("You cannot leave as the last admin of a team");
  }

  if (team.members.length < 2) {
    throw new Error("You cannot leave as the last member of a team");
  }

  await db
    .delete(teamMembers)
    .where(
      and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, session.user.id),
      ),
    );

  revalidatePath("/settings/teams", "page");
  revalidatePath("/settings/teams/[id]", "page");
  redirect("/settings/teams");
}
