import { Code } from "bright";
import MockForm from "./_components/mock-form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authOptions } from "@/lib/next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-6xl py-10">
      <div>
        <h1 className="mb-2 text-3xl lg:text-5xl font-medium">
          Instant forms with zero setup
        </h1>
        <span className="mb-4 text-muted-foreground">
          The fastest way to receive form submissions on your website. Framework
          agnostic, it just works.
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
              {`<form action="https://formie.dev/{form_id}" method="post">
  <input name="Email" id="email" type="email">
  <textarea name="Message" id="message">
  <button type="submit">Submit</button>
</form>`}
            </Code>
          </TabsContent>
          <TabsContent value="react">
            <Code lang="jsx" theme="nord">
              {`<form action="https://formie.dev/{form_id}" method="post">
  <input name="Email" id="email" type="email">
  <textarea name="Message" id="message">
  <button type="submit">Submit</button>
</form>`}
            </Code>
          </TabsContent>
          <TabsContent value="svelte">
            <Code lang="svelte" theme="nord">
              {`<form action="https://formie.dev/{form_id}" method="post">
  <input name="Email" id="email" type="email">
  <textarea name="Message" id="message">
  <button type="submit">Submit</button>
</form>`}
            </Code>
          </TabsContent>
          <TabsContent value="vue">
            <Code lang="vue" theme="nord">
              {`<form action="https://formie.dev/{form_id}" method="post">
  <input name="Email" id="email" type="email">
  <textarea name="Message" id="message">
  <button type="submit">Submit</button>
</form>`}
            </Code>
          </TabsContent>
          <TabsContent value="angular">
            <Code lang="tsx" theme="nord">
              {`<form action="https://formie.dev/{form_id}" method="post">
  <input name="Email" id="email" type="email">
  <textarea name="Message" id="message">
  <button type="submit">Submit</button>
</form>`}
            </Code>
          </TabsContent>
        </Tabs>
      </div>

      <hr className="my-8 border-dashed border-muted-foreground" />

      <MockForm />
    </div>
  );
}
