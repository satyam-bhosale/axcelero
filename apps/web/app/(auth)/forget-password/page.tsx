"use client"

import SuspenseFallback from "@client/components/suspense-fallback";
import RequestPasswordResetForm from "@client/features/auth/forms/request-password-reset";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<SuspenseFallback />}>
            <RequestPasswordResetForm />
        </Suspense>
    );
}