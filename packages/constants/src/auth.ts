export const AUTH_CONSTANTS = {
    PREFIX: 'axcelero',
    OTP_LENGTH: 6,
    RATELIMIT: {
        sendVerificationOtp: {
            window: 900,
            max: 5
        },
        verifyEmailOtp: {
            window: 900,
            max: 5
        },
        requestPasswordResetOtp: {
            window: 900,
            max: 5
        }
    }
} as const