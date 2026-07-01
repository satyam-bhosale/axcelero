"use client"

import SuspenseFallback from "@client/components/suspense-fallback";
import SignUpForm from "@client/features/auth/forms/sign-up-form";
import { Suspense } from "react";

export default function SignUpPage() {
    return (
        <Suspense fallback={<SuspenseFallback />}>
            <SignUpForm />
        </Suspense>
    );
}