import { SignInSchema, type SignInInput } from "@axcelero/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type UseSignInFormOptions = {
    onSubmit: (data: SignInInput) => void | Promise<void>;

}

export function useSignInForm({ onSubmit }: UseSignInFormOptions) {
    const { handleSubmit, ...rest } = useForm<SignInInput>({
        resolver: zodResolver(SignInSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false
        }
    });

    return {
        handleSignIn: handleSubmit(onSubmit),
        ...rest
    }
}