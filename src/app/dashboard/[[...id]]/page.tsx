import ClipboardInput from "@/components/ui/clipboard-input";
import Logo from "@/components/ui/logo";
import SubmissionCard from "./_components/submission-card";
import { db } from "@/db";
import { count, eq } from "drizzle-orm";
import {
  forms as formsTable,
  submissions as submissionsTable,
} from "@/db/schema";
import { getServerSession } from "next-auth";
import RedirectUrlForm from "./_components/redirect-url-form";
import { authOptions } from "@/lib/next-auth";
import { DeleteFormButton } from "./_components/delete-form.button";
import { env } from "@/env.mjs";
import PaginationNavigation from "@/components/pagination-navigation";

export default async function Dashboard({
  params: { id: idParam },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <></>;
  }

  const page = parseInt(searchParams.page?.toString() || "1");
  const take = 10;

  const id = idParam ? idParam[0] : null;

  const form = id
    ? await db.query.forms.findFirst({
        where: eq(formsTable.id, id),
      })
    : null;
  const submissions = form
    ? await db.query.submissions.findMany({
        where: eq(submissionsTable.formId, form.id),
        limit: take,
        offset: (page - 1) * take,
      })
    : [];
  const [{ count: submissionsCount }] = form
    ? await db.select({ count: count() }).from(submissionsTable)
    : [{ count: 0 }];

  const formUrl = `${env.NEXT_PUBLIC_BASE_URL}/form/${form?.id}`;

  return (
    <>
      {!!form ? (
        <>
          <div className="rounded-md border bg-zinc-800/40 p-6">
            <div className="mb-2 flex justify-between">
              <div className="mb-3 text-xs uppercase">
                {form?.name} settings:
              </div>
              <DeleteFormButton formId={form.id} />
            </div>

            <div className="flex flex-col space-y-4">
              <ClipboardInput inputValue={formUrl} value={formUrl} />
              <RedirectUrlForm
                formId={form.id}
                defaultValue={form.redirectUrl}
              />
            </div>
          </div>

          <div className="rounded-md border bg-zinc-800/40 p-6">
            <div className="mb-3 text-xs uppercase">Submissions:</div>
            <div className="flex flex-col space-y-5">
              {submissions.map((s) => (
                <div key={s.id}>
                  <SubmissionCard submission={s} />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <PaginationNavigation
                href={`/dashboard/${form.id}`}
                totalPages={Math.ceil(submissionsCount / take)}
                currentPage={page}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center rounded-md border bg-zinc-800/40 p-6 text-center">
          <Logo variant="small" className="mb-4 w-12" />
          <div>Select or create a form.</div>
        </div>
      )}
    </>
  );
}
