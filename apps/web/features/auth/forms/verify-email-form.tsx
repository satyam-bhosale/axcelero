import { useSendVerificationOtp, useVerifyEmailOtp } from "@axcelero/auth-client/web";
import { AUTH_CONSTANTS } from "@axcelero/constants";
import { useVerifyEmailOtpForm } from "@axcelero/forms/web";
import { formatDuration, parseDuration } from "@axcelero/utils";
import { AuthContainer, AuthContainerContent, AuthContainerDescription, AuthContainerFooter, AuthContainerHeader, AuthContainerTitle } from "@client/features/auth/components/auth-container";
import EmailParamError from "@client/features/auth/components/email-param-error";
import ResendOtp from "@client/features/auth/components/resend-otp";
import { useEmailParam } from "@client/features/auth/hooks/use-email-param";
import authClient from "@client/lib/auth";
import { Button } from "@shadcn/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@shadcn/ui/components/field";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@shadcn/ui/components/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

export default function VerifyEmailForm() {
    const router = useRouter();
    const { email: userEmail, isValid: isUserEmailValid } = useEmailParam();
    const { verifyEmailOtp, status: { isPending } } = useVerifyEmailOtp(authClient)
    const { handleVerifyEmailOtp, control, formState: { isValid } } = useVerifyEmailOtpForm({
        onSubmit: ({ otp }) => {
            if (!isUserEmailValid) {
                toast.error("User email address is required!", {
                    action: {
                        label: "Sign up",
                        onClick: () => router.replace('/sign-up')
                    }
                })
            } else {
                toast.promise(verifyEmailOtp({ email: userEmail!, otp }).then((result) => {
                    if (result.error) throw result.error;
                    return result.data;
                }), {
                    loading: "Verifying your email...",
                    success: () => {
                        router.replace('/');
                        return 'Verification was successful'
                    },
                    error: (error) => error?.message ?? "Failed to verify email"
                });
            }
        }
    });

    if (!isUserEmailValid) {
        return (
            <EmailParamError
                action={() => router.replace('/sign-in')}
                label="Sign In"
            />
        );
    }

    return (
        <AuthContainer>
            <AuthContainerHeader>
                <AuthContainerTitle>Verify Email</AuthContainerTitle>
                <AuthContainerDescription>We sent a 6-digit code to {" "}<span className="font-medium text-blue-600 dark:text-blue-400">{userEmail}</span>.</AuthContainerDescription>
            </AuthContainerHeader>
            <AuthContainerContent>
                <form onSubmit={handleVerifyEmailOtp} className="flex flex-col gap-4">
                    <FieldGroup>
                        <Controller
                            name="otp"
                            control={control}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <Field>
                                    <FieldLabel>
                                        Verification OTP
                                    </FieldLabel>
                                    <div className="w-full h-fit flex flex-row items-center justify-center py-2.5 gap-3">

                                        <InputOTP
                                            maxLength={6}
                                            value={value}
                                            onChange={onChange}
                                            pattern={REGEXP_ONLY_DIGITS}
                                        >
                                            <InputOTPGroup className="
                                                *:data-[slot=input-otp-slot]:h-10
                                                *:data-[slot=input-otp-slot]:w-10
                                                *:data-[slot=input-otp-slot]:text-lg
                                                "
                                            >
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup className="
                                                *:data-[slot=input-otp-slot]:h-10
                                                *:data-[slot=input-otp-slot]:w-10
                                                *:data-[slot=input-otp-slot]:text-lg
                                                ">
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    <FieldError errors={[error]} />
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <Button
                        size="lg"
                        disabled={!userEmail || !isValid || isPending}
                        type="submit"
                    >
                        {isPending && <Loader2 className="animate-spin" />}
                        {isPending ? "Verifying" : "Verify"}
                    </Button>
                </form>
            </AuthContainerContent>
            <AuthContainerFooter>
                <ResendVerificationOtp email={userEmail!} />
            </AuthContainerFooter>
        </AuthContainer>
    )
}

function ResendVerificationOtp({ email }: { email: string }) {
    const { sendVerificationOtp, status: { isPending } } = useSendVerificationOtp(authClient);
    const { RATELIMIT: { sendVerificationOtp: { window, max } } } = AUTH_CONSTANTS
    return (
        <ResendOtp
            cooldown={window / max}
            action={() => sendVerificationOtp({ email })}
            disabled={!email}
            isPending={isPending}
            onSuccess={() => toast.success(`Sent verification code at ${email}`)}
            onError={
                (error) => {
                    if (error?.retryAfter) {
                        toast.error(`Too many requests, please try again after ${formatDuration(parseDuration(error?.retryAfter), { format: 'short' })}`);
                    } else {
                        toast.error(error?.message);
                    }
                }
            }
        />
    )
}