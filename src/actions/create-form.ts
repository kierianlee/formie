"use server";

import { db } from "@/db";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { forms as formsTable } from "@/db/schema";

export async function createForm(session: Session) {
  await db.insert(formsTable).values({
    id: crypto.randomUUID(),
    name: "New Endpoint",
    redirectUrl: "",
    userId: session.user.id,
  });

  revalidatePath("/dashboard/[id]");
}
