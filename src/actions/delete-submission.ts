"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import {
  submissions as submissionsTable,
  forms as formsTable,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { auth } from "@/auth";

export async function deleteSubmission(submissionId: string) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await auth();

  if (!session) {
    throw Error("Unauthenticated");
  }

  const submission = await db.query.submissions.findFirst({
    where: eq(submissionsTable.id, submissionId),
  });
  if (!submission) {
    throw Error("Submission not found");
  }
  const form = await db.query.forms.findFirst({
    where: and(
      eq(formsTable.id, submission.formId),
      eq(formsTable.userId, session.user.id),
    ),
  });
  if (!form) {
    throw Error("Unauthorized");
  }

  await db
    .delete(submissionsTable)
    .where(eq(submissionsTable.id, submissionId));

  revalidatePath("/dashboard/[id]", "page");
}
