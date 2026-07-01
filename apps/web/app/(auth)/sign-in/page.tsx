"use client"

import SuspenseFallback from "@client/components/suspense-fallback";
import SignInForm from "@client/features/auth/forms/sign-in-form";
import { Suspense } from "react";

export default function SignInPage() {
    return (
        <Suspense fallback={<SuspenseFallback />}>
            <SignInForm />
        </Suspense>
    );
}