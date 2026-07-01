import { AUTH_CONSTANTS } from "@axcelero/constants";
import env from "@backend/src/config/env.js";
import { authLogger } from "@backend/src/config/logger.js";
import db from "@backend/src/db/index.js";
import { accounts, sessions, users, verifications } from "@backend/src/db/schemas/auth.js";
import { sendRequestPasswordResetOtpEmail, sendVerificationOtpEmail } from "@backend/src/emails/functions/index.js";
import { hashPassword, verifyPassword } from "@backend/src/lib/password.js";
import redis from "@backend/src/lib/redis.js";
import { waitUntil } from "@vercel/functions";
import { betterAuth, type RateLimit } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";

const isProd = env.VERCEL_ENV === 'production' || env.NODE_ENV === 'production';
const { RATELIMIT, PREFIX, OTP_LENGTH } = AUTH_CONSTANTS;

const REDIS_PREFIX = `${PREFIX}:auth`;

const RateLimitTTL = {
    auth: 315,
    otp: 915,
    default: 75
}

const auth = betterAuth({
    baseURL: {
        allowedHosts: env.BETTER_AUTH_ALLOWED_HOSTS,
        protocol: isProd ? 'https' : 'auto'
    },
    basePath: "/auth",
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        schema: { users, accounts, sessions, verifications }
    }),
    plugins: [
        emailOTP({
            overrideDefaultEmailVerification: true,
            otpLength: OTP_LENGTH,
            storeOTP: "hashed",
            async sendVerificationOTP({ email, type, otp }) {
                switch (type) {
                    case "email-verification":
                        if (env.VERCEL_ENV) {
                            waitUntil(sendVerificationOtpEmail(email, otp));
                        } else {
                            sendVerificationOtpEmail(email, otp);
                        }
                        break;
                    case "forget-password":
                        if (env.VERCEL_ENV) {
                            waitUntil(sendRequestPasswordResetOtpEmail(email, otp));
                        } else {
                            sendRequestPasswordResetOtpEmail(email, otp);
                        }
                        break;
                }
            },
        })
    ],
    trustedOrigins: env.ALLOWED_ORIGINS,
    emailAndPassword: {
        enabled: true,
        password: {
            hash: hashPassword,
            verify: verifyPassword
        },
        requireEmailVerification: true,
        revokeSessionsOnPasswordReset: true,
        resetPasswordTokenExpiresIn: 60 * 10,
    },
    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET
        }
    },
    session: {
        storeSessionInDatabase: true,
        preserveSessionInDatabase: true,
        expiresIn: 60 * 60 * 24 * 7,
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 60 * 15
        }
    },
    disabledPaths: ["/verify-email", "/request-password-reset", "/change-password", "send-verifiction-email"],
    rateLimit: {
        enabled: true,
        window: 60,
        max: 30,
        customRules: {
            "/sign-up/*": {
                window: 300,
                max: 5
            },
            "/sign-in/*": {
                window: 300,
                max: 5
            },
            "/email-otp/send-verification-otp": RATELIMIT.sendVerificationOtp,
            "/email-otp/verify-email": RATELIMIT.verifyEmailOtp,
            "/email-otp/request-password-reset": RATELIMIT.requestPasswordResetOtp
        },
        customStorage: {
            get: async (key) => {
                const result = await redis.get(key);
                return result as RateLimit;
            },
            set: async (key, value) => {
                let TTL: number;

                if (key.includes("sign-up") || key.includes("sign-in")) {
                    TTL = RateLimitTTL.auth;
                } else if (key.includes("send-verification-otp") || key.includes("verify-email") || key.includes("request-password-reset")) {
                    TTL = RateLimitTTL.otp;
                } else {
                    TTL = RateLimitTTL.default;
                }

                await redis.set(`${REDIS_PREFIX}:${key}`, value, { ex: TTL });
            }
        }
    },
    advanced: {
        database: {
            generateId: "uuid",
        },
        cookiePrefix: PREFIX,
        crossSubDomainCookies: {
            enabled: true
        },
        defaultCookieAttributes: {
            sameSite: isProd ? "none" : "lax",
            secure: isProd,
            httpOnly: true
        }
    },
    onAPIError: {
        throw: true,
        onError: (error, _ctx) => {
            authLogger.error("Auth error: ", { error });
        },
        errorURL: "/auth/error"
    },
    logger: {
        level: isProd ? "info" : "debug",
        log(level, message, ...args) {
            switch (level) {
                case "info":
                    authLogger.info(message, { args });
                    break;
                case "warn":
                    authLogger.warn(message, { args });
                    break;
                case "error":
                    authLogger.error(message, { args });
                    break;
                case "debug":
                    authLogger.debug(message, { args });
                    break;
            }
        },
    }
});

export default auth;