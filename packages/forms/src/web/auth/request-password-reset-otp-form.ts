import { RequestPasswordResetOtpSchema, type RequestPasswordResetOtpInput } from "@axcelero/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type UseRequestPasswordResetFormOptions = {
    onSubmit: (data: RequestPasswordResetOtpInput) => void | Promise<void>;
};

export function useRequestPasswordResetOtpForm({ onSubmit }: UseRequestPasswordResetFormOptions) {
    const { handleSubmit, ...rest } = useForm<RequestPasswordResetOtpInput>({
        resolver: zodResolver(RequestPasswordResetOtpSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
        },
    });

    return {
        handleRequestPasswordReset: handleSubmit(onSubmit),
        ...rest,
    };
}