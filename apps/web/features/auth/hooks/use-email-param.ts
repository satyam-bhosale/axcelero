import { useSearchParams } from "next/navigation";
import * as z from 'zod';

const emailSchema = z.email({ error: "Invalid email address" });

export function useEmailParam() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    if (!email) {
        return {
            email: null,
            isValid: false,
            error: "Email parameter is required"
        };
    }

    const parsedResult = emailSchema.safeParse(email);

    return {
        email: parsedResult.success ? parsedResult.data : null,
        isValid: parsedResult.success,
        error: parsedResult.success ? null : parsedResult.error.issues[0]?.message
    }

}