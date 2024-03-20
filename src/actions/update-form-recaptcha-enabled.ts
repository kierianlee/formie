"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { forms as formsTable } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

const schema = z.object({
  enabled: z.enum(["true", "false"], {
    invalid_type_error: "Invalid option",
  }),
});

export async function updateFormReCAPTCHAEnabled(
  formId: string,
  formData: FormData,
) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await auth();

  if (!session) {
    throw Error("Unauthenticated");
  }

  const validatedFields = schema.safeParse({
    enabled: formData.get("enabled"),
  });

  if (!validatedFields.success) {
    throw new Error(
      validatedFields.error.flatten().fieldErrors.enabled?.join(", "),
    );
  }

  if (formId !== "") {
    const form = await db.query.forms.findFirst({
      where: and(
        eq(formsTable.id, formId),
        eq(formsTable.userId, session.user.id),
      ),
    });
    if (!form) {
      throw new Error("Form not found");
    }

    if (!form.recaptchaSecret) {
      throw new Error("reCAPTCHA secret not set");
    }

    await db
      .update(formsTable)
      .set({
        recaptchaEnabled:
          (formData.get("enabled") as string) === "true" ? true : false,
      })
      .where(
        and(eq(formsTable.id, formId), eq(formsTable.userId, session.user.id)),
      );
  }

  revalidatePath("/dashboard/[id]", "page");
}
