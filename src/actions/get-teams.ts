"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { teamMembers as teamMembersTable } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { eq } from "drizzle-orm";

export async function getTeams() {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await auth();

  if (!session) {
    throw Error("Unauthenticated");
  }

  const teams = await db.query.teamMembers.findMany({
    where: eq(teamMembersTable.userId, session.user.id),
    with: {
      team: true,
    },
  });

  return teams.map(t => t.team);
}
