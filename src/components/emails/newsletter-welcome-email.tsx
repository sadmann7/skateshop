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

const newsletterImages = [
  {
    id: 1,
    src: `${baseUrl}/images/deck-1.webp`,
    alt: "Skateboard deck",
  },

  {
    id: 2,
    src: `${baseUrl}/images/shoe-1.webp`,
    alt: "Skate shoes",
  },
]

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
          <Container className="mx-auto my-[40px] max-w-xl rounded p-4">
            <Section>
              <Row>
                <Column className="text-center">
                  <Heading className="text-2xl font-bold">Skateshop13</Heading>
                  <Text className="text-zinc-500">
                    An open source e-commerce skateshop build with everything
                    new in Next.js 13.
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="mt-4">
              <Row>
                {newsletterImages.map((image) => (
                  <Img
                    key={image.id}
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={400}
                    className="rounded"
                  />
                ))}
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
