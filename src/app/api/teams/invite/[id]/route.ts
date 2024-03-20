import { db } from "@/db";
import { TEAM_MEMBER_ROLES, teamInvites, teams } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { renderAsync } from "@react-email/render";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import TeamInviteEmail from "../../../../../../emails/team-invite";

export const runtime = "edge";

const schema = z.object({
  email: z
    .string({
      invalid_type_error: "Invalid email",
    })
    .min(1, "Name must be at least 1 character")
    .email("Invalid email"),
});

export async function POST(
  req: NextRequest,
  { params: { id: teamId } }: { params: { id: string } },
) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const formData = await req.formData();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: { message: "Unauthenticated" } },
      { status: 401 },
    );
  }

  const validatedFields = schema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return NextResponse.json(
      {
        error: {
          message: validatedFields.error
            .flatten()
            .fieldErrors.email?.join(", "),
        },
      },
      { status: 400 },
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
    return NextResponse.json(
      { error: { message: "Team not found" } },
      { status: 400 },
    );
  }

  const user = team.members.find(m => m.user.email === session.user.email);

  if (!user) {
    return NextResponse.json(
      { error: { message: "You are not a member of this team" } },
      { status: 400 },
    );
  }

  if (user.role !== TEAM_MEMBER_ROLES.ADMIN) {
    return NextResponse.json(
      { error: { message: "You are not an admin of this team" } },
      { status: 400 },
    );
  }

  const existingMember = team.members.find(
    m => m.user.email === (formData.get("email") as string),
  );

  if (existingMember) {
    return NextResponse.json(
      { error: { message: "User is already a member of this team" } },
      { status: 400 },
    );
  }

  const exisitingInvite = await db.query.teamInvites.findFirst({
    where: and(
      eq(teamInvites.email, formData.get("email") as string),
      eq(teamInvites.teamId, teamId),
    ),
  });

  if (exisitingInvite) {
    return NextResponse.json(
      { error: { message: "Email has already been invited" } },
      { status: 400 },
    );
  }

  try {
    await db.insert(teamInvites).values({
      id: crypto.randomUUID(),
      email: formData.get("email") as string,
      invitedAt: new Date(),
      invitedById: session.user.id,
      teamId,
    });

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
      return NextResponse.json(
        { error: { message: error.message } },
        { status: 400 },
      );
    }
  }

  return NextResponse.json(true, { status: 200 });
}
