"use server";

import { db } from "@/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { forms, forms as formsTable } from "@/db/schema";
import { authOptions } from "@/lib/next-auth";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { count, eq } from "drizzle-orm";

// To rework
const MAXIMUM_USER_FORM_COUNT = parseInt(
  process.env.MAXIMUM_USER_FORM_COUNT ?? "100",
);

export async function createForm() {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await getServerSession(authOptions);

  if (!session) {
    throw Error("Unauthenticated");
  }

  const [{ count: formCount }] = await db
    .select({ count: count() })
    .from(formsTable)
    .where(eq(forms.userId, session.user.id));

  if (formCount >= MAXIMUM_USER_FORM_COUNT) {
    throw new Error("You have reached the maximum number of forms");
  }

  await db.insert(formsTable).values({
    id: crypto.randomUUID(),
    name: "New Endpoint",
    redirectUrl: "",
    userId: session.user.id,
  });

  revalidatePath("/dashboard/[id]", "page");
}
