import { db } from "@/db";
import { forms, submissions, users } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import Email from "vercel-email";

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

    await Email.send({
      to: { email: user.email },
      from: { email: "noreply@formie.dev", name: "formie" },
      subject: `${form.name} - New Submission`,
      text: "Your form has received a new submission. Check it out at https://formie.dev.",
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
