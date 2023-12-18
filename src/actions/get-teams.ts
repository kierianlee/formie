"use server";

import { db } from "@/db";
import { getServerSession } from "next-auth";
import { teamMembers as teamMembersTable } from "@/db/schema";
import { authOptions } from "@/lib/next-auth";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { eq } from "drizzle-orm";

export async function getTeams() {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await getServerSession(authOptions);

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
