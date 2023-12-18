"use server";

import { db } from "@/db";
import { TEAM_MEMBER_ROLES, teamInvites, teams } from "@/db/schema";
import { authOptions } from "@/lib/next-auth";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  email: z
    .string({
      invalid_type_error: "Invalid email",
    })
    .min(1, "Name must be at least 1 character")
    .email("Invalid email"),
});

export async function deleteTeamInvite(teamId: string, formData: FormData) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await getServerSession(authOptions);

  if (!session) {
    throw Error("Unauthenticated");
  }

  const validatedFields = schema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    throw new Error(
      validatedFields.error.flatten().fieldErrors.email?.join(", "),
    );
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

  if (user.role !== TEAM_MEMBER_ROLES.ADMIN) {
    throw new Error("You are not an admin of this team");
  }

  await db
    .delete(teamInvites)
    .where(
      and(
        eq(teamInvites.teamId, teamId),
        eq(teamInvites.email, formData.get("email") as string),
      ),
    );

  revalidatePath("/settings/teams", "page");
  revalidatePath("/settings/teams/[id]", "page");
}
