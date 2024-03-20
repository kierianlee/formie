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
  secret: z.string({
    invalid_type_error: "Invalid reCAPTCHA secret",
  }),
});

export async function updateFormReCAPTCHASecret(
  formId: string,
  formData: FormData,
) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await auth();

  if (!session) {
    throw Error("Unauthenticated");
  }

  const validatedFields = schema.safeParse({
    secret: formData.get("secret"),
  });

  if (!validatedFields.success) {
    throw new Error(
      validatedFields.error.flatten().fieldErrors.secret?.join(", "),
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

    await db
      .update(formsTable)
      .set({
        recaptchaSecret: formData.get("secret") as string,
        recaptchaEnabled:
          (formData.get("secret") as string) === ""
            ? false
            : form.recaptchaEnabled,
      })
      .where(
        and(eq(formsTable.id, formId), eq(formsTable.userId, session.user.id)),
      );
  }

  revalidatePath("/dashboard/[id]", "page");
}
