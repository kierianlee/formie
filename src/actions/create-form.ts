"use server";

import { db } from "@/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { forms as formsTable } from "@/db/schema";
import { authOptions } from "@/lib/next-auth";

export async function createForm() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw Error("Unauthenticated");
  }

  await db.insert(formsTable).values({
    id: crypto.randomUUID(),
    name: "New Endpoint",
    redirectUrl: "",
    userId: session.user.id,
  });

  revalidatePath("/dashboard/[id]", "page");
}
