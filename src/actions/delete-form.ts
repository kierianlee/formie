"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { forms as formsTable } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteForm(formId: string) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await auth();

  if (!session) {
    throw Error("Unauthenticated");
  }

  if (formId !== "") {
    await db
      .delete(formsTable)
      .where(
        and(eq(formsTable.id, formId), eq(formsTable.userId, session.user.id)),
      );

    revalidatePath("/dashboard/[id]");
    redirect("/dashboard");
  }
}
