import { AxceleroContainer } from "@backend/src/emails/components/container.js"
import { AxceleroFooter } from "@backend/src/emails/components/footer.js"
import { OtpContainer } from "@backend/src/emails/components/otp-container.js"
import { BaseLayout } from "@backend/src/emails/layouts/base-layout.js"
import { Body, Heading, Preview, Section, Text } from "react-email"

type Props = {
    otp: string
}

export default function RequestPasswordResetOtpEmail({ otp }: Props) {
    return (
        <BaseLayout>
            <Body>
                <Preview>Reset your password securely. This code expires in 10 minutes.</Preview>
                <AxceleroContainer>
                    <Section>
                        <Heading as="h2" className="text-xl py-0">
                             Reset your password for Axcelero
                        </Heading>
                        <Text className="text-sm font-600">
                            Hey there, received a request to reset your Axcelero account password. Use the below code to set a new password.
                        </Text>
                    </Section>
                    <OtpContainer otp={otp} />
                    <AxceleroFooter />
                </AxceleroContainer>
            </Body>
        </BaseLayout>

    )
}