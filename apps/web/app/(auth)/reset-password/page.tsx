"use client";

import SuspenseFallback from "@client/components/suspense-fallback";
import ResetPasswordForm from "@client/features/auth/forms/reset-password-form";
import { Suspense } from "react";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<SuspenseFallback />}>
            <ResetPasswordForm />
        </Suspense>
    );
}