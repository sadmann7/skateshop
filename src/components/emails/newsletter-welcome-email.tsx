import {
  Body,
  Column,
  Container,
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
} from "@react-email/components"

interface NewsletterWelcomeEmailProps {
  firstName?: string
  fromEmail: string
  token: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? ""

export default function NewsletterWelcomeEmail({
  firstName = "there",
  fromEmail,
  token,
}: NewsletterWelcomeEmailProps) {
  const previewText = `Hi ${firstName}, welcome to Skateshop13!`

  return (
    <Html>
      <Head>
        <title>Skateshop13 Newsletter</title>
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto bg-zinc-50 font-sans">
          <Container className="mx-auto my-[40px] max-w-2xl rounded p-4">
            <Section className="mt-4">
              <Heading className="text-center text-2xl font-semibold text-zinc-950">
                Skateshop13
              </Heading>
              <Hr className="my-4" />
              <Heading className="text-center text-3xl font-semibold text-zinc-800">
                Welcome to Skateshop13!
              </Heading>
              <Text className="mb-0 mt-6 text-center text-base">
                {`We're`} so glad {`you're`} here. {`We're`} excited to share
                our passion for skateboarding with you.
              </Text>
              <Text className="m-0 text-center text-base">
                {`We'll`} be sending you a newsletter every month.
              </Text>
            </Section>
            <Section>
              <Img
                src={`${baseUrl}/static/skateboarder-landing-on-half-pipe.webp`}
                alt="Skateboard laying on the ground"
                height={424}
                className="mt-8 aspect-video w-full object-cover"
              />
              <Text className="my-2.5 text-center text-zinc-400">
                Photo by{" "}
                <Link
                  href="https://www.pexels.com/photo/skateboarder-jumping-a-skateboard-5037502/"
                  className="text-blue-500 underline"
                >
                  cottonbro studio
                </Link>
              </Text>
            </Section>
            <Section className="mt-4 text-center text-zinc-400">
              <Text>
                {`We're`} looking forward to seeing you around! If you have any
                questions, please {`don't`} hesitate to reach out to us at{" "}
                <Link
                  href={`mailto:${fromEmail}`}
                  className="text-blue-500 underline"
                >
                  {fromEmail}
                </Link>
              </Text>
              <Text className="m-0">
                @ Skateshop13 {new Date().getFullYear()}
              </Text>
              <Text className="m-0">
                If you no longer want to receive these emails, you can{" "}
                <Link
                  href={`${baseUrl}/email-preferences?token=${token}`}
                  className="text-blue-500 underline"
                >
                  unsubscribe here
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
