"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { submissions as submissionsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteSubmission(submissionId: string) {
  await db
    .delete(submissionsTable)
    .where(eq(submissionsTable.id, submissionId));

  revalidatePath("/dashboard/[id]", "page");
}
