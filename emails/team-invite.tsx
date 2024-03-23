import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Fragment } from "react";

interface TeamInviteEmailProps {
  inviterName?: string;
  teamName?: string;
  inviteLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL}`
  : "";

export const TeamInviteEmail = ({
  inviterName = "John Doe",
  teamName = "Apex",
  inviteLink = `https://formie.dev/`,
}: TeamInviteEmailProps) => {
  const previewText = `Team invite - ${teamName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Fragment>
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
                Team Invite
              </Heading>
              <Text className="text-[14px] leading-[24px] text-black">
                Hello,
              </Text>
              <Text className="text-[14px] leading-[24px] text-black">
                You have been invited by {inviterName} to join the team{" "}
                <strong>{teamName}</strong> on formie.
              </Text>
              <Section className="mb-[32px] mt-[32px] text-center">
                <Button
                  className="rounded bg-[#000000] px-4 py-2 text-center text-[12px] font-semibold text-white no-underline"
                  href={inviteLink}
                >
                  Visit formie
                </Button>
              </Section>
              <Text className="text-[14px] leading-[24px] text-black">
                or copy and paste this URL into your browser:{" "}
                <Link href={inviteLink} className="text-blue-600 no-underline">
                  {inviteLink}
                </Link>
              </Text>
            </Container>
          </Body>
        </Fragment>
      </Tailwind>
    </Html>
  );
};

export default TeamInviteEmail;
