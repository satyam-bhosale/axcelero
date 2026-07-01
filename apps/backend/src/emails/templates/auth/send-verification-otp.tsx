import { AxceleroContainer } from "@backend/src/emails/components/container.js"
import { AxceleroFooter } from "@backend/src/emails/components/footer.js"
import { OtpContainer } from "@backend/src/emails/components/otp-container.js"
import { BaseLayout } from "@backend/src/emails/layouts/base-layout.js"
import { Body, Heading, Preview, Section, Text } from "react-email"

type Props = {
    otp: string
}

export default function SendVerificationOtpEmail({ otp }: Props) {
    return (
        <BaseLayout>
            <Body>
                <Preview>Confirm your Axcelero account to get started, This code expires soon.</Preview>
                <AxceleroContainer>
                    <Section>
                        <Heading as="h2" className="text-xl py-0">
                            Hey there, verify your email address
                        </Heading>
                        <Text className="text-sm font-600">
                            Thanks for signing up! To complete your registration and start using the Axcelero, please verify your email address using the below code.
                        </Text>
                    </Section>
                    <OtpContainer otp={otp} />
                    <AxceleroFooter />
                </AxceleroContainer>
            </Body>
        </BaseLayout>

    )
}