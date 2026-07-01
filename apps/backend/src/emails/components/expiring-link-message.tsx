import type { ReactNode } from "react";
import { Text } from "react-email";

export function ExpiringLinkMessage({ expiringIn, children }: { expiringIn: number, children?: ReactNode }) {
    return (
        <>
            <Text className="text-xs">
                <strong>
                    {`This link is valid for ${expiringIn} minutes and can only be used once.`}
                </strong>
            </Text>
            {children}
        </>
    )
}