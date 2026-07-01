import { useSignIn } from "@axcelero/auth-client/web";
import { PasswordInput } from "@axcelero/components";
import { useSignInForm } from "@axcelero/forms/web";
import { formatDuration, parseDuration } from "@axcelero/utils";
import { AuthContainer, AuthContainerContent, AuthContainerDescription, AuthContainerFooter, AuthContainerForm, AuthContainerHeader, AuthContainerTitle } from "@client/features/auth/components/auth-container";
import { GoogleSignInButton } from "@client/features/auth/components/google-sign-in-button";
import authClient from "@client/lib/auth";
import { Button } from "@shadcn/ui/components/button";
import { Checkbox } from "@shadcn/ui/components/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@shadcn/ui/components/field";
import { Input } from "@shadcn/ui/components/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

export default function SignInForm() {
    const router = useRouter();
    const { signIn, status: { isPending } } = useSignIn(authClient);
    const { handleSignIn, control, formState: { isValid } } = useSignInForm({
        onSubmit: ({ email, password, rememberMe }) => {
            toast.promise(signIn({ email, password, rememberMe }).then((result) => {
                if (result.error) throw result.error;
                return result.data;
            }), {
                loading: "Signing you in...",
                success: (data) => {
                    console.log(data);

                    router.replace('/');
                    return "Signed in successfully"
                },
                error: (err) => {
                    const retryAfter = err?.retryAfter || 0;
                    const emailVerified = err?.status === 403;

                    if (emailVerified) {
                        router.replace(`/verify-email?email=${email}`);
                    }
                    if (retryAfter) {
                        return `Too many requests, please try again after ${formatDuration(parseDuration(retryAfter), { format: 'short' })}`
                    }
                    return err?.message ?? "Unable to sign in"
                }
            });
        }
    })
    return (
        <div className="w-full lg:w-fit flex flex-col px-4 items-center gap-2">
            <AuthContainer>
                <AuthContainerHeader>
                    <AuthContainerTitle>Sign In</AuthContainerTitle>
                    <AuthContainerDescription>Welcome back to Axcelero.</AuthContainerDescription>
                </AuthContainerHeader>
                <AuthContainerContent>
                    <AuthContainerForm className="flex flex-col gap-4" onSubmit={handleSignIn}>
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Field>
                                        <FieldLabel htmlFor="sign-in-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            type="email"
                                            autoComplete="off"
                                            value={value}
                                            onChange={onChange}
                                        />
                                        <FieldError errors={[error]} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={control}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Field>
                                        <FieldLabel htmlFor="sign-in-email">
                                            Password
                                        </FieldLabel>
                                        <PasswordInput
                                            value={value}
                                            onChange={onChange}
                                        />
                                        <FieldError errors={[error]} />
                                        <Link href="/forget-password" className="text-xs font-medium text-right text-muted-foreground hover:text-primary duration-300 ease-in-out">
                                            Forgot password?
                                        </Link>
                                    </Field>
                                )}
                            />
                            <Controller
                                name="rememberMe"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <Field>
                                        <div className="flex flex-row items-center gap-1">
                                            <Checkbox
                                                checked={value}
                                                onCheckedChange={onChange}
                                            />
                                            <FieldLabel>Remember me</FieldLabel>
                                        </div>
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <Button
                            size="lg"
                            type="submit"
                            disabled={!isValid || isPending}
                        >
                            {isPending && <Loader2 className="animate-spin" />}
                            {isPending ? "Signing In..." : "Sign In"}
                        </Button>
                    </AuthContainerForm>
                </AuthContainerContent>
                <AuthContainerFooter>
                    <GoogleSignInButton mode="signin" />
                </AuthContainerFooter>
            </AuthContainer>
            <p className="text-sm">
                Don't have an account?
                {" "}
                <Link
                    href="/sign-up"
                    className="font-medium underline underline-offset-1"
                >
                    Create account
                </Link>
            </p>
        </div>
    )
}