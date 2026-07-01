import { Section, Text } from "react-email";

export function OtpContainer({ otp }: { otp: string }) {
    return (
        <Section className="w-fit my-0 py-0 px-5 bg-white border-2 border-[#0066ffff] text-[#0066ffff] rounded-xl">
            <Text className="font-bold tracking-widest text-2xl">
                {otp}
            </Text>
        </Section>
    )
}