import { type ResetPasswordOtpInput, ResetPasswordOtpSchema } from "@axcelero/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type UseResetPasswordFormOptions = {
    onSubmit: (data: ResetPasswordOtpInput) => void | Promise<void>;
};

export function useResetPasswordOtpForm({ onSubmit }: UseResetPasswordFormOptions) {
    const { handleSubmit, ...rest } = useForm<ResetPasswordOtpInput>({
        resolver: zodResolver(ResetPasswordOtpSchema),
        mode: "onChange",
        defaultValues: {
            newPassword: "",
            confirmNewPassword: "",
            otp: "",
        },
    });

    return {
        handleResetPasswordOtp: handleSubmit(onSubmit),
        ...rest,
    };
}