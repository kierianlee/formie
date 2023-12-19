import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface NewSubmissionEmailProps {
  name?: string;
  formName?: string;
  submissionDate?: Date;
  submissionFields?: Record<string, any>;
  formLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL}`
  : "";

export const NewSubmissionEmail = ({
  name = "John Doe",
  formName = "Contact Form",
  submissionDate = new Date(),
  submissionFields = {
    name: "John Doe",
    email: "john@doe.com",
    message: "Hello world!",
  },
  formLink = `https://formie.dev/dashboard/1`,
}: NewSubmissionEmailProps) => {
  const previewText = `New submission - ${formName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/logo-small.png`}
                width="40"
                height="37"
                alt="formie"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Form Submission
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {name},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              You have received a new submission on your form{" "}
              <strong>{formName}</strong> at{" "}
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              }).format(submissionDate)}
              :
            </Text>
            <Section className="text-[14px] leading-[24px] text-black">
              {Object.entries(submissionFields).map(([key, value], index) => (
                <Row key={index} className="">
                  <Column align="left" className="w-1/2">
                    {key}:{" "}
                  </Column>
                  <Column align="left" className="w-1/2">
                    {value}
                  </Column>
                </Row>
              ))}
            </Section>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-4 py-2 text-center text-[12px] font-semibold text-white no-underline"
                href={formLink}
              >
                View on formie
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link href={formLink} className="text-blue-600 no-underline">
                {formLink}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewSubmissionEmail;
