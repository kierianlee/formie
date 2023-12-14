"use server";

import { db } from "@/db";
import { forms as formsTable } from "@/db/schema";
import { authOptions } from "@/lib/next-auth";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import z from "zod";

const schema = z.object({
  redirectUrl: z
    .string({
      invalid_type_error: "Invalid redirect URL",
    })
    .min(1, "Redirect URL must be at least 1 character")
    .url("Invalid URL"),
});

export async function updateFormRedirectUrl(
  formId: string,
  formData: FormData,
) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await getServerSession(authOptions);

  if (!session) {
    throw Error("Unauthenticated");
  }

  const validatedFields = schema.safeParse({
    redirectUrl: formData.get("redirectUrl"),
  });

  if (!validatedFields.success) {
    throw new Error(
      validatedFields.error.flatten().fieldErrors.redirectUrl?.join(", "),
    );
  }

  if (formId !== "") {
    await db
      .update(formsTable)
      .set({ redirectUrl: formData.get("redirectUrl") as string })
      .where(
        and(eq(formsTable.id, formId), eq(formsTable.userId, session.user.id)),
      );
  }

  revalidatePath("/dashboard/[id]", "page");
}
