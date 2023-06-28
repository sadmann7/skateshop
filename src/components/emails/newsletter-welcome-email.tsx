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
}

export default function NewsletterWelcomeEmail({
  firstName = "there",
  fromEmail,
}: NewsletterWelcomeEmailProps) {
  const previewText = `Hi ${firstName}, welcome to skateshop!`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto bg-background font-sans">
          <Container className="mx-auto p-4">
            <Section className="rounded-lg bg-white shadow-lg">
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
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
