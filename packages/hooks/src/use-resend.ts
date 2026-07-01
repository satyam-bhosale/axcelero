import { useEffect } from "react";
import { useResendCodeCountdown } from "./use-resend-countdown";

type ActionResult<T, E> = {
    data: T | null;
    error: E | null;
};

type Args<T, E> = {
    cooldown: number;

    action: () => Promise<ActionResult<T, E>>;

    onSuccess?: (data: T) => void;

    onError?: (error: E) => void;
};

// Cooldown is client-side throttling.
// It is restarted after every attempt to reduce pressure on server-side rate limiting.
export function useResend<T, E>(args: Args<T, E>) {
    const { remainingTime, isRunning, controls: {restartCountdown, resetCountdown } } = useResendCodeCountdown(args.cooldown);

    useEffect(() => {
        return () => resetCountdown();
    }, [resetCountdown]);

    async function resend() {
        try {
            const { data, error } = await args.action();
            
            if (data) {
                args?.onSuccess?.(data);
            }
            
            if (error) {
                args.onError?.(error);
            }
            restartCountdown();
        } catch(err) {
            const error = err as E;
            args.onError?.(error);
        }

    }

    return {
        resend,
        remainingTime,
        isCooling: isRunning
    }
}