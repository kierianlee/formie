"use server";

import { db } from "@/db";
import { forms as formsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateFormRedirectUrl(
  formId: string,
  formData: FormData,
) {
  "use server";

  const redirectUrl = formData.get("redirectUrl") as string;

  if (formId !== "") {
    await db
      .update(formsTable)
      .set({ redirectUrl })
      .where(eq(formsTable.id, formId));
  }

  revalidatePath("/dashboard/[id]");
}
