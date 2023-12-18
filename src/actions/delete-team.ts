"use server";

import { db } from "@/db";
import { teams as teamsTable } from "@/db/schema";
import { authOptions } from "@/lib/next-auth";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteTeam(teamId: string) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await getServerSession(authOptions);

  if (!session) {
    throw Error("Unauthenticated");
  }

  if (teamId !== "") {
    await db.delete(teamsTable).where(and(eq(teamsTable.id, teamId)));

    revalidatePath("/settings/teams");
    revalidatePath("/settings/teams/[id]");
    redirect("/settings/teams");
  }
}
