"use server";

import { db } from "@/db";
import { forms as formsTable } from "@/db/schema";
import { authOptions } from "@/lib/next-auth";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteForm(formId: string) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await getServerSession(authOptions);

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
