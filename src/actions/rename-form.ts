"use server";

import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function renameForm(formId: string, formData: FormData) {
  const name = formData.get("name");

  const form = await db.query.forms.findFirst({ where: eq(forms.id, formId) });

  if (!form) {
    throw new Error("Form not found");
  }

  await db
    .update(forms)
    .set({
      name: name as string,
    })
    .where(eq(forms.id, formId));

  revalidatePath("/dashboard/[id]", "page");
}
