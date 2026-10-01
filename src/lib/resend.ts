import { Resend } from "resend";
import { serverEnv } from "@/lib/env";

let resendClient: Resend | null = null;

export function getResendClient(): Resend | null {
  if (!serverEnv.RESEND_API_KEY) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(serverEnv.RESEND_API_KEY);
  }

  return resendClient;
}
