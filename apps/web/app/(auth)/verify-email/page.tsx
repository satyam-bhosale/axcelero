"use client"

import SuspenseFallback from "@client/components/suspense-fallback";
import VerifyEmailForm from "@client/features/auth/forms/verify-email-form";
import { Suspense } from "react";

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={<SuspenseFallback />}
        >
            <VerifyEmailForm />
        </Suspense>
    );
}
