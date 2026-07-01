import { useRequestPasswordReset, useResetPassword } from "@axcelero/auth-client/web";
import { PasswordInput } from "@axcelero/components";
import { AUTH_CONSTANTS } from "@axcelero/constants";
import { useResetPasswordOtpForm } from "@axcelero/forms/web";
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


export default function ResetPasswordForm() {
    const router = useRouter();
    const { email: userEmail, isValid: isEmailValid } = useEmailParam();
    const { resetPasswordOtp, status: { isPending } } = useResetPassword(authClient);
    const { handleResetPasswordOtp, control, formState: { isValid } } = useResetPasswordOtpForm({
        onSubmit: ({ confirmNewPassword, otp }) => {
            if (!isEmailValid) {
                toast.error("User email address is required", {
                    action: {
                        label: "Enter email",
                        onClick: () => router.replace('/forget-password')
                    }
                })
            } else {
                toast.promise(
                    resetPasswordOtp({ email: userEmail!, password: confirmNewPassword, otp }).then((result) => {
                        if (result.error) throw result.error;
                        return result.data;
                    }),
                    {
                        loading: "Resetting your password...",
                        success: () => {
                            router.push('/sign-in');
                            return "Password reset successfully";
                        },
                        error: (err) => err?.message ?? "Unable to reset your password"
                    }
                );
            }
        }
    });

    if (!isEmailValid) {
        return (
            <EmailParamError
                label="Forget password"
                action={() => router.replace('/forget-password')}
            />
        );
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <AuthContainer>
                <AuthContainerHeader>
                    <AuthContainerTitle>
                        Reset Password
                    </AuthContainerTitle>
                    <AuthContainerDescription>
                        Enter your new credentials to reset your axcelero account password
                    </AuthContainerDescription>
                </AuthContainerHeader>
                <AuthContainerContent>
                    <form onSubmit={handleResetPasswordOtp} className="flex flex-col gap-4">
                        <FieldGroup>
                            <Controller
                                name="newPassword"
                                control={control}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Field>
                                        <FieldLabel htmlFor="reset-password-new-password">
                                            New Password
                                        </FieldLabel>
                                        <PasswordInput
                                            id="reset-password-new-password"
                                            value={value}
                                            onChange={onChange}
                                        />
                                        <FieldError errors={[error]} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="confirmNewPassword"
                                control={control}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Field>
                                        <FieldLabel htmlFor="reset-password-confirm-new-password">
                                            Confirm New Password
                                        </FieldLabel>
                                        <PasswordInput
                                            id="reset-password-confirm-new-password"
                                            value={value}
                                            onChange={onChange}
                                        />
                                        <FieldError errors={[error]} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="otp"
                                control={control}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Field>
                                        <FieldLabel htmlFor="reset-password-otp">
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
                        <Button size="lg" disabled={!isEmailValid || !isValid || isPending} type="submit">
                            {isPending && <Loader2 className="animate-spin" />}
                            Reset Password
                        </Button>
                    </form>
                </AuthContainerContent>
                <AuthContainerFooter>
                    <ResendRequestPasswordReset email={userEmail!} />
                </AuthContainerFooter>
            </AuthContainer>
        </div>
    );
}

function ResendRequestPasswordReset({ email }: { email: string }) {
    const { requestPasswordReset, status: { isPending } } = useRequestPasswordReset(authClient);
    const { RATELIMIT: { requestPasswordResetOtp: { window, max } } } = AUTH_CONSTANTS
    return (
        <ResendOtp
            cooldown={window / max}
            action={() => requestPasswordReset({ email })}
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