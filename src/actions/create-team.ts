"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { TEAM_MEMBER_ROLES, teamMembers, teams } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

// To rework
const MAXIMUM_USER_TEAM_COUNT = parseInt(
  process.env.MAXIMUM_USER_TEAM_COUNT ?? "100",
);

const schema = z.object({
  name: z
    .string({
      invalid_type_error: "Invalid name",
    })
    .min(1, "Name must be at least 1 character"),
});

export async function createTeam(formData: FormData) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await auth();

  if (!session) {
    throw Error("Unauthenticated");
  }

  const validatedFields = schema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    throw new Error(
      validatedFields.error.flatten().fieldErrors.name?.join(", "),
    );
  }

  const [{ count: teamCount }] = await db
    .select({ count: count() })
    .from(teams)
    .where(eq(teams.createdById, session.user.id));

  if (teamCount >= MAXIMUM_USER_TEAM_COUNT) {
    throw new Error("You have created the maximum number of teams");
  }

  const teamId = crypto.randomUUID();

  await db.insert(teams).values({
    createdById: session.user.id,
    name: formData.get("name") as string,
    id: teamId,
  });

  await db.insert(teamMembers).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    teamId,
    role: TEAM_MEMBER_ROLES.ADMIN,
  });

  revalidatePath("/settings/teams", "page");
  revalidatePath("/settings/teams/[id]", "page");
}
