import { authLogger } from "@backend/src/config/logger.js";
import RequestPasswordResetOtpEmail from "@backend/src/emails/templates/auth/request-password-reset-otp.js";
import resend from "@backend/src/lib/resend.js";
import { env } from "process";
import { pretty, render } from "react-email";

export async function sendRequestPasswordResetOtpEmail(email: string, otp: string) {
    return resend.emails.send({
        from: `Axcelero <${env.SYSTEM_EMAIL_ID}>`,
        to: [email],
        subject: "Reset password of your Axcelero account",
        html: await pretty(await render(<RequestPasswordResetOtpEmail otp={otp} />))
    }).then((result) => {
        if (result.data) authLogger.info(`Reset password otp email sent to: ${email}`);
        if (result.error) authLogger.error(`Failed to send reset password otp email to ${email}`);
    })
}