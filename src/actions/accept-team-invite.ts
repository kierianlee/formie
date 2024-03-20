"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { TEAM_MEMBER_ROLES, teamInvites, teamMembers } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function acceptTeamInvite(inviteId: string) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await auth();

  if (!session) {
    throw Error("Unauthenticated");
  }

  const invite = await db.query.teamInvites.findFirst({
    where: and(eq(teamInvites.id, inviteId)),
  });

  if (!invite) {
    throw new Error("Invite not found");
  }

  if (invite.respondedAt !== null) {
    throw new Error("Invite has expired");
  }

  await db.insert(teamMembers).values({
    id: crypto.randomUUID(),
    role: TEAM_MEMBER_ROLES.MEMBER,
    teamId: invite.teamId,
    userId: session.user.id,
    inviteId: invite.id,
  });
  await db
    .update(teamInvites)
    .set({
      accepted: true,
      respondedAt: new Date(),
    })
    .where(eq(teamInvites.id, inviteId));

  revalidatePath("/settings/teams", "page");
  revalidatePath("/settings/teams/[id]", "page");
}
