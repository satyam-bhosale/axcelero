"use client";

import { Toaster } from "@shadcn/ui/components/sonner";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import type { ToasterProps } from "sonner";

export function SonnerProvider() {
    const { theme } = useTheme();
    useEffect(() => {
        console.log("Theme: ", theme);
        
    }, [theme])
    return (
        <Toaster
            richColors
            theme={theme as ToasterProps["theme"]}
            position="top-right"
        />
    );
}