import { Code } from "bright";
import MockForm from "./mock-form";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl py-10">
      <div>
        <h1 className="mb-2 text-5xl font-medium">
          Instant forms with zero setup
        </h1>
        <span className="mb-4 text-muted-foreground">
          The fastest way to receive form submissions on your website. Framework
          agnostic, it just works.
        </span>
        <Code lang="html" theme="nord">
          {`<form action="https://formie.dev/{form_id}" method="post">
  <input name="Email" id="email" type="email">
  <textarea name="Message" id="message">
  <button type="submit">Submit</button>
</form>`}
        </Code>
      </div>

      <hr className="my-8 border-dashed border-muted-foreground" />

      <MockForm />
    </div>
  );
}
