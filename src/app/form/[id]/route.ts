import { db } from "@/db";
import { forms, submissions, users } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

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
            ],
          },
        ],
        from: {
          email: "noreply@formie.dev",
          name: "formie",
        },
        subject: `New submission for ${form.name}`,
        content: [
          {
            type: "text/plain",
            value: `New submission for ${form.name}. Check it out at https://formie.dev.`,
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
