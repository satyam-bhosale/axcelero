import { useRequestPasswordReset } from "@axcelero/auth-client/web";
import { useRequestPasswordResetOtpForm } from "@axcelero/forms/web";
import { formatDuration, parseDuration } from "@axcelero/utils";
import { AuthContainer, AuthContainerContent, AuthContainerDescription, AuthContainerHeader, AuthContainerTitle } from "@client/features/auth/components/auth-container";
import authClient from "@client/lib/auth";
import { Button } from "@shadcn/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@shadcn/ui/components/field";
import { Input } from "@shadcn/ui/components/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

export default function RequestPasswordResetForm() {
    const router = useRouter();
    const { requestPasswordReset, status: { isPending } } = useRequestPasswordReset(authClient);
    const { handleRequestPasswordReset, control, reset, formState: { isValid } } = useRequestPasswordResetOtpForm({
        onSubmit: ({ email }) => {
            toast.promise(
                requestPasswordReset({ email }).then((result) => {
                    if (result.error) throw result.error;
                    return result.data;
                }),
                {
                    loading: 'Sending password reset code...',
                    success: () => {
                        reset();
                        router.push(`/reset-password?email=${email}`);

                        return `Password reset code sent`
                    },
                    error: (err) => {
                        if (err?.retryAfter) return `Too many requests, please try again after ${formatDuration(parseDuration(err?.retryAfter), { format: 'short' })}`;

                        return err?.message ?? 'Unable to send password reset code'
                    }
                }
            );
        }
    });

    return (
        <div className="flex flex-col items-center gap-2">
            <AuthContainer>
                <AuthContainerHeader>
                    <AuthContainerTitle>
                        Forgot Password
                    </AuthContainerTitle>
                    <AuthContainerDescription>
                        Enter your email address to receive a password reset code.
                    </AuthContainerDescription>
                </AuthContainerHeader>
                <AuthContainerContent>
                    <form onSubmit={handleRequestPasswordReset} className="flex flex-col gap-4">
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Field>
                                        <FieldLabel htmlFor="forgot-password-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            id="forgot-password-email"
                                            value={value}
                                            onChange={onChange}
                                            autoComplete="off"
                                            type="email"
                                        />
                                        <FieldError errors={[error]} />
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <Button
                            type="submit"
                            className="w-full" size="lg"
                            disabled={!isValid || isPending}
                        >
                            {isPending && <Loader2 className="animate-spin" />}
                            {isPending ? "Sending Code..." : "Send Reset Code"}
                        </Button>
                    </form>
                </AuthContainerContent>
            </AuthContainer>
        </div>
    );
}