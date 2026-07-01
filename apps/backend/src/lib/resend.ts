import env from "@backend/src/config/env.js";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export default resend;