import {
  Body,
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

// For previewing we need to put images in the .react-email/public folder
// In production we need to put images in the root public folder
const newsletterImages = [
  {
    src: `${baseUrl}/images/newsletter/skater-one.webp`,
    alt: "Skateboarder flying high",
    credit: "ALLAN FRANCA CARMO",
    creditUrl:
      "https://www.pexels.com/photo/time-lapse-photography-of-man-doing-skateboard-trick-3133685/",
    description: `Skateboarding is a sport that has been around for decades. It's not just about the tricks, but also about the culture and community that surrounds it. So we decided to create a newsletter to share our passion with others who love skateboarding as much as we do!`,
  },
  {
    src: `${baseUrl}/images/newsletter/skater-two.webp`,
    alt: "Skateboarder landing on half pipe",
    credit: "cottonbro studio",
    creditUrl:
      "https://www.pexels.com/photo/skateboarder-jumping-a-skateboard-5037502/",
    description: `${`We'll`} be keeping you up to date with the latest skateboarding news, events, and more. Stay up to date with the latest trends and tricks. Stay tuned for more!`,
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
        <Body className="mx-auto bg-zinc-50 font-sans">
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
            <Section className="mt-6">
              {newsletterImages.map((item) => (
                <Row key={item.alt} className="mt-10">
                  <Img
                    src={item.src}
                    alt={item.alt}
                    height={424}
                    className="aspect-video w-full object-cover"
                  />
                  <Text className="mb-0 mt-2 text-center text-zinc-400">
                    Photo by{" "}
                    <Link
                      href={item.creditUrl}
                      className="text-blue-500 underline"
                    >
                      {item.credit}
                    </Link>
                  </Text>
                  <Text className="mb-0 mt-4 text-center text-base">
                    {item.description}
                  </Text>
                </Row>
              ))}
            </Section>
            <Section className="mt-4 text-center text-zinc-400">
              <Text className="my-4">
                {`We're`} looking forward to seeing you around! If you have any
                questions, please {`don't`} hesitate to reach out to us at{" "}
                <Link
                  href={`mailto:${fromEmail}`}
                  className="text-blue-500 underline"
                >
                  {fromEmail}
                </Link>
              </Text>
              <Text className="mb-0 mt-4">
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
