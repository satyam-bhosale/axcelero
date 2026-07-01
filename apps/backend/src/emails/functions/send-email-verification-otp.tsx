import { authLogger } from "@backend/src/config/logger.js";
import SendVerificationOtpEmail from "@backend/src/emails/templates/auth/send-verification-otp.js";
import resend from "@backend/src/lib/resend.js";
import { env } from "process";
import { pretty, render } from "react-email";

export async function sendVerificationOtpEmail(email: string, otp: string) {
    return resend.emails.send({
        from: `Axcelero <${env.SYSTEM_EMAIL_ID}>`,
        to: [email],
        subject: "Verify your Axcelero Account",
        html: await pretty(await render(<SendVerificationOtpEmail otp={otp} />))
    }).then((result) => {
        if(result.data) authLogger.info(`Verification email sent to: ${email}`);
        if(result.error) authLogger.error(`Failed to send verification email to ${email}`);
    })
}