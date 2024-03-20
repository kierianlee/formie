import { Code } from "bright";
import MockForm from "./_components/mock-form";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  angularSnippet,
  htmlSnippet,
  reactSnippet,
  svelteSnippet,
  vueSnippet,
} from "./_data/code-snippets";
import { MailboxIcon, SortAscIcon, Users2Icon, XIcon } from "lucide-react";
import Logo from "@/components/ui/logo";
import { Shantell_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { auth } from "@/auth";

const handwrittenFont = Shantell_Sans({ weight: ["700"], subsets: ["latin"] });

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-6xl pt-10">
      <section className="px-6">
        <h1
          className={cn(
            "mb-2 text-3xl font-medium lg:text-5xl",
            handwrittenFont.className,
          )}
        >
          Zero setup <span className="text-primary">form backend</span>.
        </h1>
        <span className="mb-4 text-muted-foreground">
          The easiest & fastest way to receive form submissions on your website.
          Framework agnostic, it just works.
        </span>
        <Tabs defaultValue="html" className="mt-4 w-full">
          <div className="overflow-auto">
            <TabsList>
              <TabsTrigger value="html" className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="langs/html.svg" className="w-4" alt="HTML" />
                HTML
              </TabsTrigger>
              <TabsTrigger value="react" className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="langs/react.svg" className="w-4" alt="React" />
                React
              </TabsTrigger>
              <TabsTrigger value="svelte" className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="langs/svelte.svg" className="w-4" alt="Svelte" />
                Svelte
              </TabsTrigger>
              <TabsTrigger value="vue" className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="langs/vue.svg" className="w-4" alt="Vue" />
                Vue
              </TabsTrigger>
              <TabsTrigger value="angular" className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="langs/angular.svg" className="w-4" alt="Angular" />
                Angular
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="html">
            <Code lang="html" theme="nord">
              {htmlSnippet}
            </Code>
          </TabsContent>
          <TabsContent value="react">
            <Code lang="jsx" theme="nord">
              {reactSnippet}
            </Code>
          </TabsContent>
          <TabsContent value="svelte">
            <Code lang="svelte" theme="nord">
              {svelteSnippet}
            </Code>
          </TabsContent>
          <TabsContent value="vue">
            <Code lang="vue" theme="nord">
              {vueSnippet}
            </Code>
          </TabsContent>
          <TabsContent value="angular">
            <Code lang="tsx" theme="nord">
              {angularSnippet}
            </Code>
          </TabsContent>
        </Tabs>
        <span className="text-xs text-muted-foreground">
          ...yes {`they're`} all <span className="italic">almost</span> exactly
          the same.
        </span>
      </section>

      <section className="px-6">
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: MailboxIcon,
              title: "Email notifications",
              description:
                "Every time your form is submitted, you'll receive an email with the data.",
            },
            {
              icon: XIcon,
              title: "Spam prevention",
              description:
                "formie makes it trivial to integrate Google's reCAPTCHA into your forms.",
            },
            {
              icon: Users2Icon,
              title: "Team collaboration",
              description:
                "Invite your team members to collaborate on your forms.",
            },
            {
              icon: SortAscIcon,
              title: "Filtering & sorting",
              description:
                "Filter and sort your form submissions by any field previously submitted.",
            },
          ].map(({ title, description, ...item }, i) => (
            <div
              className="block rounded-md border bg-zinc-800/40 p-8 shadow-xl transition hover:border-primary/10 hover:shadow-primary/10"
              key={i}
            >
              <item.icon className="text-primary" />
              <h2 className="mt-4 text-xl font-bold text-white">{title}</h2>
              <p className="mt-1 text-sm text-gray-300">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* <hr className="my-8 border-dashed border-muted-foreground" /> */}

      <section className="mt-24 px-6">
        <div className="mb-12">
          <h2
            className={cn(
              "flex items-center justify-center gap-2 text-2xl font-medium underline decoration-primary lg:text-4xl",
              handwrittenFont.className,
            )}
          >
            How <Logo className="inline h-6 lg:h-8" /> works:
          </h2>
        </div>

        <MockForm />
      </section>

      <section>
        <div className="relative isolate overflow-hidden">
          <div className="px-6 pb-16 pt-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Proudly open source.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
                {`formie's`} source code is freely is available on GitHub - feel
                free to read, review, or contribute to it!
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="https://github.com/inkiear/formie"
                  target="_blank"
                  className="flex items-center gap-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="GitHub" src="/github.svg" className="w-4" />
                  <span>Star on GitHub</span>
                </Link>
              </div>
            </div>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
                <stop stopColor="#39AEA9" />
                <stop offset={1} stopColor="#a4d6ad" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </section>
    </div>
  );
}
