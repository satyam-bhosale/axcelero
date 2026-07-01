import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { type CreateAuthClientOptions } from "../types/factory.types";


export const createWebAuthClient = ({ baseURL, basePath }: CreateAuthClientOptions) => {
    const auth = createAuthClient({
        baseURL,
        basePath,
        plugins: [
            emailOTPClient()
        ],
    });

    return auth;
}