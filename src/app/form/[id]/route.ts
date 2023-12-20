import { db } from "@/db";
import { User, forms, submissions, users } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { renderAsync } from "@react-email/render";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import NewSubmissionEmail from "../../../../emails/new-submission";
import { env } from "@/env.mjs";

export const runtime = "edge";

export async function POST(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const formData = await req.formData();

  const entries = Object.fromEntries(formData.entries());
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, id),
    with: {
      formsToTeams: {
        with: {
          team: {
            with: {
              members: {
                with: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 400 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, form.userId),
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  if (form.recaptchaEnabled && form.recaptchaSecret) {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${form.recaptchaSecret}&response=${entries["g-recaptcha-response"]}`,
      {
        method: "POST",
      },
    );
    const json = await response.json();
    if (!json.success) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 },
      );
    }
  }

  const teamMembersToSendTo: User[] = [];

  for (const { team } of form.formsToTeams) {
    for (const member of team.members) {
      if (
        !teamMembersToSendTo.find(
          m => m.id === member.user.id && m.id !== user.id,
        )
      ) {
        teamMembersToSendTo.push(member.user);
      }
    }
  }

  try {
    await db.insert(submissions).values({
      id: crypto.randomUUID(),
      date: new Date(),
      formId: form.id,
      fields: entries,
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
                email: user.email,
                name: user.name,
              },
              ...teamMembersToSendTo.map(user => ({
                email: user.email,
                name: user.name,
              })),
            ],
          },
        ],
        from: {
          email: "noreply@formie.dev",
          name: "formie",
        },
        subject: `New submission - ${form.name}`,
        content: [
          {
            type: "text/plain",
            value: `New submission for ${form.name}. View at https://formie.dev/dashboard/${form.id}.`,
          },
          {
            type: "text/html",
            value: await renderAsync(
              NewSubmissionEmail({
                formLink: `${env.NEXT_PUBLIC_BASE_URL}/dashboard/${form.id}`,
                formName: form.name,
                name: user.name || "",
                submissionDate: new Date(),
                submissionFields: entries,
              }),
            ),
          },
        ],
      }),
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  if (form.redirectUrl) {
    return redirect(form.redirectUrl);
  }

  return redirect("/success");
}
