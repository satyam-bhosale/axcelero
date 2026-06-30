import { SignUpSchema, type SignUpInput } from "@axcelero/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type UseSignUpFormOptions = {
    onSubmit: (data: SignUpInput) => void | Promise<void>;
}

export function useSignUpForm({onSubmit}:UseSignUpFormOptions) {
    const { handleSubmit, control, reset, formState } = useForm<SignUpInput>({
        resolver: zodResolver(SignUpSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    return {
        handleSignUp: handleSubmit(onSubmit),
        control,
        reset,
        formState
    }
}