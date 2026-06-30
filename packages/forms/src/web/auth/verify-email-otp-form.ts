import { VerifyEmailOtpSchema, type VerifyEmailOtpInput } from "@axcelero/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


type UseVerifyEmailOtpOptions = {
    onSubmit: (data: VerifyEmailOtpInput) => void | Promise<void>;
}

export function useVerifyEmailOtpForm({ onSubmit }: UseVerifyEmailOtpOptions) {
    const { handleSubmit, ...rest } = useForm<VerifyEmailOtpInput>({
        resolver: zodResolver(VerifyEmailOtpSchema),
        mode: "onChange",
        defaultValues: {
            otp: ""
        }
    });

    return {
        handleVerifyEmailOtp: handleSubmit(onSubmit),
        ...rest
    }
}