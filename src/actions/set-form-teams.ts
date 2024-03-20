"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { forms, formsToTeams } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { getIPAddress } from "@/lib/server-actions";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

const schema = z.object({
  teamIds: z.array(
    z.string({
      invalid_type_error: "Invalid ID",
    }),
    { invalid_type_error: "Invalid team IDs" },
  ),
});

export async function setFormTeams(formId: string, formData: FormData) {
  await rateLimit((await getIPAddress()) ?? "anonymous");

  const session = await auth();

  if (!session) {
    throw Error("Unauthenticated");
  }

  const parsedJson = JSON.parse(formData.get("teamIds") as string);

  const validatedFields = schema.safeParse({
    teamIds: parsedJson,
  });

  if (!validatedFields.success) {
    throw new Error(
      validatedFields.error.flatten().fieldErrors.teamIds?.join(", "),
    );
  }

  const form = await db.query.forms.findFirst({
    where: and(eq(forms.id, formId), eq(forms.userId, session.user.id)),
    with: {
      formsToTeams: true,
    },
  });

  if (!form) {
    throw new Error("Form not found");
  }

  const existingTeamIds = form.formsToTeams.map(
    formToTeam => formToTeam.teamId,
  );
  const incomingTeamIds = parsedJson as string[];

  const idsToRemove = existingTeamIds.filter(
    id => !incomingTeamIds.includes(id),
  );
  const idsToAdd = incomingTeamIds.filter(id => !existingTeamIds.includes(id));

  if (idsToRemove.length) {
    for (const id of idsToRemove) {
      await db
        .delete(formsToTeams)
        .where(
          and(eq(formsToTeams.formId, formId), eq(formsToTeams.teamId, id)),
        );
    }
  }

  if (idsToAdd.length) {
    for (const id of idsToAdd) {
      await db.insert(formsToTeams).values({
        formId,
        teamId: id,
      });
    }
  }

  revalidatePath("/dashboard/[id]", "page");
}
