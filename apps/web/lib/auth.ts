import { createWebAuthClient } from "@axcelero/auth-client/web";
import env from "@client/config/env";

const authClient = createWebAuthClient({
    baseURL: env.NEXT_PUBLIC_BACKEND_URL,
    basePath: env.NEXT_PUBLIC_AUTH_BASE_PATH
});

export default authClient;