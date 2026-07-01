import { Container, Img, Section, type ContainerProps } from "react-email";

export function AxceleroContainer({ children, ...props }: ContainerProps) {
    return (
        <Container
            className="mx-auto p-4 max-w-116 border-solid border border-neutral-200 rounded-lg"
            {...props}
        >
            <Section>
                <Img
                    height={30}
                    className="object-cover"
                    src="https://pub-a14f88ca72904afbbbebc7cd82e4985a.r2.dev/static/logos/wordmark.png"
                    alt="axcelero-wordmark-logo"
                />
            </Section>
            {children}
        </Container>
    )
}