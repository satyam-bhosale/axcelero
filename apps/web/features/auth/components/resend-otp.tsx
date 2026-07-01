import { useResend } from "@axcelero/hooks";
import { formatDuration, parseDuration } from "@axcelero/utils";
import { Button } from "@shadcn/ui/components/button";
import { Loader2 } from "lucide-react";

type Props<T, E> = {
    label?: string;
    action: () => Promise<{ data: T | null, error: E | null }>;
    cooldown: number;
    disabled?: boolean;
    isPending: boolean,
    onSuccess: (data: T) => void;
    onError: (error: E) => void;
}

export default function ResendOtp<T, E>({
    label = "Didn't receive the code?",
    action,
    cooldown,
    disabled = false,
    isPending,
    onSuccess,
    onError

}: Props<T, E>) {
    const { resend, remainingTime, isCooling } = useResend({
        cooldown,
        action: action,
        onSuccess: onSuccess,
        onError: onError
    });
    return (
        <div className="w-full flex flex-row items-center justify-center gap-2">
            <p>{label}</p>
            {isCooling ? <p className="text-sm font-medium">{formatDuration(parseDuration(remainingTime), { format: 'digital' })}</p>
                : <Button
                    size="xs"
                    variant="outline"
                    type="button"
                    disabled={isPending || disabled}
                    onClick={resend}
                >
                    {isPending && <Loader2 className="animate-spin" />}
                    {isPending ? "Sending" : "Resend"}
                </Button>}
        </div>
    )
}