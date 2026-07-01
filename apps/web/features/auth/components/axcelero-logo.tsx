"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function AxceleroLogo() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <Image
            src={
                resolvedTheme === "dark"
                    ? "/images/wordmark_white.png"
                    : "/images/wordmark.png"
            }
            alt="Filmato wordmark"
            width={150}
            height={30}
            className="h-fit w-25 sm:w-30 md:w-35 p-2 z-20"
        />
    )
}