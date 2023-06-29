import { env } from "@/env.mjs"
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
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

export default function NewsletterWelcomeEmail({
  firstName = "there",
  fromEmail,
  token,
}: NewsletterWelcomeEmailProps) {
  const previewText = `Hi ${firstName}, welcome to skateshop!`

  return (
    <Html>
      <Head>
        <title>Welcome to skateshop!</title>
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] max-w-xl rounded p-4">
            <Section className="mt-[32px]">
              <Row>
                <Column className="w-full">
                  <Heading className="text-center text-2xl font-bold">
                    Welcome to skateshop!
                  </Heading>
                  <Hr className="my-4" />
                  <Text className="text-center">{previewText}</Text>
                  <Text className="text-center">
                    {`We'll`} be sending you the latest news and updates from
                    our blog.
                  </Text>
                  <Text className="text-center">
                    If you have any questions, please{" "}
                    <Link
                      className="text-blue-500"
                      href={`mailto:${fromEmail}`}
                    >
                      contact us
                    </Link>
                    .
                  </Text>
                  <Text className="text-center">Thanks for subscribing!</Text>
                  <Text className="text-center">
                    <Link
                      className="text-blue-500"
                      href="https://skateshop.sadmn.com"
                    >
                      skateshop
                    </Link>
                  </Text>
                  <Text className="text-center">
                    <Link
                      className="text-blue-500"
                      href="https://skateshop.sadmn.com"
                    >
                      skateshop.sadmn.com
                    </Link>
                  </Text>
                </Column>
                <Column className="w-full">
                  <Text className="text-center">
                    <Link
                      className="text-blue-500"
                      href={`${env.NEXT_PUBLIC_APP_URL}/email-preferences?token=${token}`}
                    >
                      Unsubscribe
                    </Link>
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
