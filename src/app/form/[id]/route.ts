import { db } from "@/db";
import { forms, submissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function POST(
  req: Request,
  { params: { id } }: { params: { id: string } },
) {
  const formData = await req.formData();

  const entries = Object.fromEntries(formData.entries());
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, id),
  });

  if (!form) {
    return redirect("/400");
  }
  try {
    await db.insert(submissions).values({
      id: crypto.randomUUID(),
      date: new Date(),
      formId: form.id,
      fields: entries,
    });
  } catch (error) {
    return redirect("/400");
  }

  if (form.redirectUrl) {
    return redirect(form.redirectUrl);
  }

  return redirect("/success");
}
