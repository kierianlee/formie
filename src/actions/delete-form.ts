"use server";

import { db } from "@/db";
import { forms as formsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteForm(formId: string) {
  if (formId !== "") {
    await db.delete(formsTable).where(eq(formsTable.id, formId));

    revalidatePath("/dashboard/[id]");
    redirect("/dashboard");
  }
}
