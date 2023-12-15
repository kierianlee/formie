import ClipboardInput from "@/components/ui/clipboard-input";
import Logo from "@/components/ui/logo";
import SubmissionCard from "./_components/submission-card";
import { db } from "@/db";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";
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
import SortButton from "./_components/sort-button";
import { redirect } from "next/navigation";
import { FilterMenu } from "./_components/filter-menu";
import { InputType, QueryType } from "@/components/filter/filter-consts";
import FilterBadge from "./_components/filter-badge";
import RecaptchaForm from "./_components/recaptcha-form";

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

  const sortDir = (searchParams.sortDir as string) || "desc";
  if (sortDir !== "asc" && sortDir !== "desc") {
    return redirect("/dashboard");
  }
  const sortField = (searchParams.sortField as string) || "Date";

  const filterField = searchParams.filterField as string;
  const filterValue = searchParams.filterValue as string;
  const filterType = searchParams.filterType as string;

  const id = idParam ? idParam[0] : null;

  const form = id
    ? await db.query.forms.findFirst({
        where: eq(formsTable.id, id),
      })
    : null;
  const submissions = form
    ? await db
        .select()
        .from(submissionsTable)
        .where(
          and(
            eq(submissionsTable.formId, form.id),
            ...(filterField && filterType && filterValue
              ? [
                  filterType === QueryType.CONTAINS
                    ? sql`fields ->> ${filterField} ilike ${`%${filterValue}%`}`
                    : sql`fields ->> ${filterField} = ${filterValue}`,
                ]
              : []),
          ),
        )
        .orderBy(
          sortField === "Date"
            ? sortDir === "asc"
              ? asc(submissionsTable.date)
              : desc(submissionsTable.date)
            : sortDir === "asc"
              ? sql`fields ->> ${sortField} asc nulls first`
              : sql`fields ->> ${sortField} desc nulls first`,
        )
        .limit(take)
        .offset((page - 1) * take)
    : [];
  const [{ count: submissionsCount }] = form
    ? await db.select({ count: count() }).from(submissionsTable)
    : [{ count: 0 }];
  const submissionKeys = form
    ? ((await db
        .execute(
          sql`
          SELECT
            JSON_OBJECT_KEYS(fields) AS KEY
          FROM
            ${submissionsTable}
          WHERE
            ${submissionsTable.formId} = ${form.id}
          GROUP BY
            KEY;`,
        )
        .then(res => res.rows)) as { key: string }[])
    : [];

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
              <RecaptchaForm
                formId={form.id}
                defaultEnabled={form.recaptchaEnabled}
                defaultValue={form.recaptchaSecret || ""}
              />
            </div>
          </div>

          <div className="rounded-md border bg-zinc-800/40 p-6">
            <div className="mb-4 flex items-center gap-4">
              <SortButton
                sort={{ direction: sortDir, field: sortField }}
                href=""
                options={submissionKeys.map(item => item.key)}
              />
              <FilterMenu
                options={submissionKeys.map(item => ({
                  label: item.key,
                  accessor: item.key,
                  input: InputType.TEXT,
                  queries: [QueryType.CONTAINS, QueryType.EQUALS],
                }))}
              />
            </div>
            {!!filterField && !!filterType && !!filterValue && (
              <div>
                <FilterBadge
                  filterField={filterField}
                  filterType={filterType}
                  filterValue={filterValue}
                />
              </div>
            )}
            <hr className="my-4" />
            <div className="mb-3 text-xs uppercase">Submissions:</div>
            <div className="flex flex-col space-y-5">
              {submissions.map(s => (
                <div key={s.id}>
                  <SubmissionCard submission={s} />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <PaginationNavigation
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
