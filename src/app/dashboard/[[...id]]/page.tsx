import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ClipboardInput from "@/components/clipboard-input";
import Logo from "@/components/logo";
import SubmissionCard from "./submission-card";
import { Input } from "@/components/ui/input";

export const mockForms = [
  {
    id: "1",
    name: "Project A",
    submissions: [
      {
        id: "S1",
        date: new Date().toISOString(),
        fields: {
          email: "john@doe.com",
          message: "Hello there!",
          submit: "",
          firstName: "John",
          lastName: "Doe",
        },
      },
      {
        id: "S2",
        date: new Date().toISOString(),
        fields: {
          email: "john@doe.com",
          message: "Hello there!",
        },
      },
      {
        id: "S3",
        date: new Date().toISOString(),
        fields: {
          email: "john@doe.com",
          message: "Hello there!",
        },
      },
      {
        id: "S4",
        date: new Date().toISOString(),
        fields: {
          email: "john@doe.com",
          message: "Hello there!",
        },
      },
      {
        id: "S5",
        date: new Date().toISOString(),
        fields: {
          email: "john@doe.com",
          message: "Hello there!",
        },
      },
      {
        id: "S6",
        date: new Date().toISOString(),
        fields: {
          email: "john@doe.com",
          message: "Hello there!",
        },
      },
    ],
  },
  {
    id: "2",
    name: "Project B",
    submissions: [],
  },
  {
    id: "3",
    name: "Project C",
    submissions: [],
  },
  {
    id: "4",
    name: "Project D",
    submissions: [],
  },
];

export default async function Dashboard({
  params: { id: idParam },
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const id = idParam ? idParam[0] : null;
  const form = mockForms.find((form) => form.id === id);
  const formUrl = `https://formie.dev/form/${form?.id}`;

  return (
    <div className="mx-auto w-full max-w-6xl py-10">
      <div className="">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="col-span-12 rounded-md border bg-zinc-800/40 lg:col-span-3">
            <div className="p-6">
              <div className="mb-3 text-xs uppercase">Forms list:</div>
              <div className="flex flex-col space-y-4">
                {mockForms.map((form) => (
                  <Link
                    href={`/dashboard/${form.id}`}
                    key={form.id}
                    className={cn(
                      "group rounded-md px-4 py-2 text-sm",
                      id === form.id && "bg-zinc-700/60 duration-300",
                    )}
                  >
                    <span className="flex">
                      <div
                        className={cn(
                          "mr-3 transition-all",
                          id === form.id
                            ? "text-foreground"
                            : "text-muted-foreground/40 group-hover:text-foreground",
                        )}
                      >
                        •
                      </div>{" "}
                      <div>{form.name}</div>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t p-6">
              <Button className="w-full">Create new form</Button>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-9 flex flex-col space-y-6">
            {!!form ? (
              <>
                <div className="rounded-md border bg-zinc-800/40 p-6">
                  <div className="mb-2 flex justify-between">
                    <div className="mb-3 text-xs uppercase">
                      {form?.name} settings:
                    </div>
                    <div className="text-xs text-red-400">Delete endpoint</div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <ClipboardInput inputValue={formUrl} value={formUrl} />
                    <div className="flex space-x-4">
                      <Input placeholder="Set redirect URL" />
                      <Button variant="secondary">Save</Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border bg-zinc-800/40 p-6">
                  <div className="mb-3 text-xs uppercase">Submissions:</div>
                  <div className="flex flex-col space-y-5">
                    {form?.submissions.map((s) => (
                      <div key={s.id}>
                        <SubmissionCard submission={s} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-md border bg-zinc-800/40 p-6 text-center">
                <Logo variant="small" className="mb-4 w-12" />
                <div>Select or create a form.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
