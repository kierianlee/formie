"use server";

import { db } from "@/db";
import { forms } from "@/db/schema";
import { authOptions } from "@/lib/next-auth";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import z from "zod";

const schema = z.object({
  name: z
    .string({
      invalid_type_error: "Invalid name",
    })
    .min(1, "Name must be at least 1 character"),
});

export async function renameForm(formId: string, formData: FormData) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await getServerSession(authOptions);

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

  const form = await db.query.forms.findFirst({
    where: and(eq(forms.id, formId), eq(forms.userId, session.user.id)),
  });

  if (!form) {
    throw new Error("Form not found");
  }

  await db
    .update(forms)
    .set({
      name: formData.get("name") as string,
    })
    .where(and(eq(forms.id, formId), eq(forms.userId, session.user.id)));

  revalidatePath("/dashboard/[id]", "page");
}
