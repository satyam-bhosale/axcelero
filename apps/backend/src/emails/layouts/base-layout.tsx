import type { ReactNode } from "react";
import { Font, Head, Html, Tailwind } from "react-email";

type Props = {
    children: ReactNode
}

export function BaseLayout({ children }: Props) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Arial"
                    fontStyle="normal"
                    fontWeight={100}
                    webFont={{
                        url: "https://fonts.gstatic.com/s/inter/v20/UcCo3FwrK3iLTcvvYwYL8g.woff2",
                        format: "woff2"
                    }}
                />
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Arial"
                    fontStyle="normal"
                    fontWeight={200}
                    webFont={{
                        url: "https://fonts.gstatic.com/s/inter/v20/UcCo3FwrK3iLTcvvYwYL8g.woff2",
                        format: "woff2"
                    }}
                />
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Arial"
                    fontStyle="normal"
                    fontWeight={300}
                    webFont={{
                        url: "https://fonts.gstatic.com/s/inter/v20/UcCo3FwrK3iLTcvvYwYL8g.woff2",
                        format: "woff2"
                    }}
                />
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Arial"
                    fontStyle="normal"
                    fontWeight={400}
                    webFont={{
                        url: "https://fonts.gstatic.com/s/inter/v20/UcCo3FwrK3iLTcvvYwYL8g.woff2",
                        format: "woff2"
                    }}
                />
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Arial"
                    fontStyle="normal"
                    fontWeight={500}
                    webFont={{
                        url: "https://fonts.gstatic.com/s/inter/v20/UcCo3FwrK3iLTcvvYwYL8g.woff2",
                        format: "woff2"
                    }}
                />
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Arial"
                    fontStyle="normal"
                    fontWeight={600}
                    webFont={{
                        url: "https://fonts.gstatic.com/s/inter/v20/UcCo3FwrK3iLTcvvYwYL8g.woff2",
                        format: "woff2"
                    }}
                />
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Arial"
                    fontStyle="normal"
                    fontWeight={700}
                    webFont={{
                        url: "https://fonts.gstatic.com/s/inter/v20/UcCo3FwrK3iLTcvvYwYL8g.woff2",
                        format: "woff2"
                    }}
                />
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Arial"
                    fontStyle="normal"
                    fontWeight={800}
                    webFont={{
                        url: "https://fonts.gstatic.com/s/inter/v20/UcCo3FwrK3iLTcvvYwYL8g.woff2",
                        format: "woff2"
                    }}
                />
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Arial"
                    fontStyle="normal"
                    fontWeight={900}
                    webFont={{
                        url: "https://fonts.gstatic.com/s/inter/v20/UcCo3FwrK3iLTcvvYwYL8g.woff2",
                        format: "woff2"
                    }}
                />
                <title>Verification Email</title>
            </Head>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            fontFamily: {
                                sans: ["Inter", "Arial", "sans-serif"],
                                inter: ["Inter", "Arial", "sans-serif"]
                            },
                        },
                    },
                }}
            >
                {children}
            </Tailwind>
        </Html>
    )
}