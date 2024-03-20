"use server";

import { db } from "@/db";
import { TEAM_MEMBER_ROLES, teamInvites, teams } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { renderAsync } from "@react-email/render";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
import TeamInviteEmail from "../../emails/team-invite";
import { auth } from "@/auth";

const schema = z.object({
  email: z
    .string({
      invalid_type_error: "Invalid email",
    })
    .min(1, "Name must be at least 1 character")
    .email("Invalid email"),
});

export async function inviteUserToTeam(teamId: string, formData: FormData) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await auth();

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

  const existingMember = team.members.find(
    m => m.user.email === (formData.get("email") as string),
  );

  if (existingMember) {
    throw new Error("User is already a member of this team");
  }

  const exisitingInvite = await db.query.teamInvites.findFirst({
    where: and(
      eq(teamInvites.email, formData.get("email") as string),
      eq(teamInvites.teamId, teamId),
    ),
  });

  if (exisitingInvite) {
    throw new Error("Email has already been invited");
  }

  await db.insert(teamInvites).values({
    id: crypto.randomUUID(),
    email: formData.get("email") as string,
    invitedAt: new Date(),
    invitedById: session.user.id,
    teamId,
  });

  try {
    await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              {
                email: formData.get("email") as string,
              },
            ],
          },
        ],
        from: {
          email: "noreply@formie.dev",
          name: "formie",
        },
        subject: `You have been invited to join ${team.name} on formie`,
        content: [
          {
            type: "text/plain",
            value: `You have been invited to join team ${team.name} by ${user.user.name}. Head over to https://formie.dev to accept your invitation.`,
          },
          {
            type: "text/html",
            value: await renderAsync(
              TeamInviteEmail({
                inviteLink: `https://formie.dev/`,
                teamName: team.name,
                inviterName: user.user.name || "",
              }),
            ),
          },
        ],
      }),
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/settings/teams", "page");
  revalidatePath("/settings/teams/[id]", "page");
}
