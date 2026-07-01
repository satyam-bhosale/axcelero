import { useSignUp } from "@axcelero/auth-client/web";
import { PasswordInput } from "@axcelero/components";
import { useSignUpForm } from "@axcelero/forms/web";
import { AuthContainer, AuthContainerContent, AuthContainerDescription, AuthContainerFooter, AuthContainerHeader, AuthContainerTitle } from "@client/features/auth/components/auth-container";
import { GoogleSignInButton } from "@client/features/auth/components/google-sign-in-button";
import authClient from "@client/lib/auth";
import { Button } from "@shadcn/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@shadcn/ui/components/field";
import { Input } from "@shadcn/ui/components/input";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

export default function SignUpForm() {
    const { theme } = useTheme();
    const router = useRouter();
    const { signUp, status: { isPending } } = useSignUp(authClient);
    const { handleSignUp, control, formState: { isValid } } = useSignUpForm({
        onSubmit: ({ email, password }) => {
            toast.promise(
                signUp({ email, password }).then((result) => {
                    if (result.error) throw result.error;
                    return result.data;
                }),
                {
                    loading: "Creating your account...",
                    success: (data) => {
                        const userEmail = data?.user?.email;
                        router.push(`/verify-email?email=${userEmail}`)
                        return "Account created successfully";
                    },
                    error: (err) => err?.message ?? "Unable to create your account"
                }
            );
        }
    });

    useEffect(() => {
        console.log("Theme: ", theme)
    }, [theme])

    return (
        <div className="flex flex-col items-center gap-2">
            <AuthContainer>
                <AuthContainerHeader>
                    <AuthContainerTitle>
                        Sign Up
                    </AuthContainerTitle>
                    <AuthContainerDescription>
                        Enter your crendentials to create your axcelero account
                    </AuthContainerDescription>
                </AuthContainerHeader>
                <AuthContainerContent>
                    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Field>
                                        <FieldLabel htmlFor="sign-up-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            id="sign-up-email"
                                            value={value}
                                            onChange={onChange}
                                            autoComplete="off"
                                            type="email"
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
                                        <FieldLabel htmlFor="sign-up-password">
                                            Password
                                        </FieldLabel>
                                        <PasswordInput
                                            value={value}
                                            onChange={onChange}
                                        />
                                        <FieldError errors={[error]} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Field>
                                        <FieldLabel htmlFor="sign-up-confirm-password">
                                            Confirm Password
                                        </FieldLabel>
                                        <PasswordInput
                                            value={value}
                                            onChange={onChange}
                                        />
                                        <FieldError errors={[error]} />
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <Button size="lg" disabled={!isValid || isPending} type="submit">
                            {isPending && <Loader2 className="animate-spin" />}
                            Create Account
                        </Button>
                    </form>
                </AuthContainerContent>
                <AuthContainerFooter>
                    <GoogleSignInButton mode="signup" />
                </AuthContainerFooter>
            </AuthContainer>
            <p className="text-sm">
                Already have an account?
                {" "}
                <Link
                    href="/sign-in"
                    className="font-medium underline underline-offset-1"
                >
                    Sign In
                </Link>
            </p>
        </div>
    );
}