"use server";

import { db } from "@/db";
import { teamInvites } from "@/db/schema";
import { authOptions } from "@/lib/next-auth";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function declineTeamInvite(inviteId: string) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await getServerSession(authOptions);

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

  await db
    .update(teamInvites)
    .set({
      accepted: false,
      respondedAt: new Date(),
    })
    .where(eq(teamInvites.id, inviteId));

  revalidatePath("/settings/teams", "page");
  revalidatePath("/settings/teams/[id]", "page");
}
